import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { processAndUploadFiles } from '@/lib/storage'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*, order_files(version_number)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })

    if (!['draft', 'revision_in_progress', 'extra_revision_paid'].includes(order.status)) {
      return NextResponse.json({ error: 'لا يمكن رفع ملفات في هذه الحالة' }, { status: 400 })
    }

    const formData     = await req.formData()
    const previewFile  = formData.get('preview')  as File | null
    const originalFile = formData.get('original') as File | null
    const designerNote = formData.get('note')     as string | null
    const revisionId   = formData.get('revision_id') as string | null

    if (!previewFile || !originalFile) {
      return NextResponse.json({ error: 'يجب رفع ملف المعاينة والملف الأصلي' }, { status: 400 })
    }

    const lastVersion = order.order_files?.length > 0
      ? Math.max(...order.order_files.map((f: any) => f.version_number)) : 0
    const newVersionNumber = lastVersion + 1

    const previewBuffer  = Buffer.from(await previewFile.arrayBuffer())
    const originalBuffer = Buffer.from(await originalFile.arrayBuffer())

    const { previewPath, originalPath } = await processAndUploadFiles(
      orderId, newVersionNumber, previewBuffer, originalBuffer, originalFile.type
    )

    await adminClient.from('order_files').update({ is_current: false }).eq('order_id', orderId).eq('is_current', true)

    const { data: newFile, error: fileError } = await adminClient
      .from('order_files')
      .insert({
        order_id: orderId, version_number: newVersionNumber, is_current: true,
        preview_storage_path: previewPath, original_storage_path: originalPath,
        uploaded_by: order.designer_id, designer_note: designerNote,
      })
      .select()
      .single()

    if (fileError) throw fileError

    await adminClient.from('orders').update({ status: 'pending' }).eq('id', orderId)

    if (revisionId) {
      await adminClient.from('revisions')
        .update({ response_file_id: newFile.id, responded_at: new Date().toISOString() })
        .eq('id', revisionId)
    }

    return NextResponse.json({
      message: 'تم رفع الملفات بنجاح', file: newFile,
      preview_url: `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${order.preview_token}`,
    }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/orders/[id]/upload]', err)
    return NextResponse.json({ error: err.message ?? 'خطأ في الخادم' }, { status: 500 })
  }
}
