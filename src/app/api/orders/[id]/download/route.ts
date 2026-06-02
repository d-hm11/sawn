import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { generateDownloadSignedUrl } from '@/lib/storage'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const downloadToken = req.nextUrl.searchParams.get('dt')
    if (!downloadToken) return NextResponse.json({ error: 'رمز التحميل مفقود' }, { status: 400 })

    const { data: order, error } = await adminClient
      .from('orders')
      .select('id, status, download_token, order_files(original_storage_path, is_current)')
      .eq('id', id)
      .eq('download_token', downloadToken)
      .single()

    if (error || !order) return NextResponse.json({ error: 'رمز تحميل غير صالح' }, { status: 404 })
    if (!['delivered', 'settled'].includes(order.status)) return NextResponse.json({ error: 'الطلب لم يُسلَّم بعد' }, { status: 403 })

    const currentFile = (order.order_files as any[]).find(f => f.is_current)
    if (!currentFile) return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 })

    const signedUrl = await generateDownloadSignedUrl(currentFile.original_storage_path, 300)
    return NextResponse.json({ download_url: signedUrl, expires_in: 300 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
