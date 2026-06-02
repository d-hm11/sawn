import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { applyWatermark } from '@/lib/watermark'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    const { data: order, error } = await adminClient
      .from('orders')
      .select('id, status, expires_at, order_files!inner(preview_storage_path, is_current)')
      .eq('preview_token', token)
      .eq('order_files.is_current', true)
      .single()

    if (error || !order) return new NextResponse('رابط غير صالح', { status: 404 })
    if (new Date(order.expires_at) < new Date()) return new NextResponse('انتهت الصلاحية', { status: 410 })
    if (['paid','delivered','settled'].includes(order.status)) return new NextResponse('تم الدفع', { status: 403 })

    const ip    = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
    const email = req.nextUrl.searchParams.get('e') ?? undefined

    const previewPath = (order.order_files as any)[0].preview_storage_path
    const { data: fileData, error: dlError } = await adminClient.storage.from('previews').download(previewPath)

    if (dlError || !fileData) return new NextResponse('فشل تحميل الصورة', { status: 500 })

    const imageBuffer   = Buffer.from(await fileData.arrayBuffer())
    const watermarked   = await applyWatermark(imageBuffer, { ip, email, timestamp: new Date(), opacity: 0.20 })

    adminClient.from('preview_access_log').insert({
      order_id: order.id, ip_address: ip,
      user_agent: req.headers.get('user-agent') ?? '',
    }).then(() => {})

    return new NextResponse(watermarked as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (err: any) {
    console.error('[GET /api/preview/[token]/image]', err)
    return new NextResponse('خطأ في الخادم', { status: 500 })
  }
}
