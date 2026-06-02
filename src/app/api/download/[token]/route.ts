import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { generateDownloadSignedUrl } from '@/lib/storage'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    const { data: order, error } = await adminClient
      .from('orders')
      .select('id, status, project_title, client_amount, users!designer_id(full_name), order_files(original_storage_path, is_current)')
      .eq('download_token', token)
      .single()

    if (error || !order) return NextResponse.json({ error: 'رابط التحميل غير صالح', code: 'INVALID' }, { status: 404 })
    if (!['delivered', 'settled'].includes(order.status)) return NextResponse.json({ error: 'الطلب لم يُسلَّم بعد', code: 'NOT_DELIVERED' }, { status: 403 })

    const currentFile = (order.order_files as any[]).find(f => f.is_current)
    if (!currentFile) return NextResponse.json({ error: 'الملف غير موجود', code: 'NO_FILE' }, { status: 404 })

    const EXPIRES = 300
    const downloadUrl = await generateDownloadSignedUrl(currentFile.original_storage_path, EXPIRES)

    return NextResponse.json({
      projectTitle: order.project_title,
      designerName: (order.users as any).full_name,
      downloadUrl,
      expiresIn:   EXPIRES,
      orderId:     order.id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
