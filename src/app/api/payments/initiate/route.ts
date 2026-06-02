import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { toHalalah } from '@/lib/moyasar'

export async function POST(req: NextRequest) {
  try {
    const { preview_token, payment_type = 'main' } = await req.json()

    const { data: order, error } = await adminClient
      .from('orders')
      .select('id, status, client_amount, project_title, preview_token, expires_at')
      .eq('preview_token', preview_token)
      .single()

    if (error || !order) return NextResponse.json({ error: 'طلب غير موجود' }, { status: 404 })
    if (new Date(order.expires_at) < new Date()) return NextResponse.json({ error: 'انتهت الصلاحية' }, { status: 410 })

    if (payment_type === 'main' && !['pending', 'revision_requested'].includes(order.status)) {
      return NextResponse.json({ error: 'الطلب غير قابل للدفع' }, { status: 400 })
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

    return NextResponse.json({
      publishable_key: process.env.MOYASAR_PUBLIC_KEY,
      amount_halalah:  toHalalah(order.client_amount),
      description:     `مشروع: ${order.project_title}`,
      callback_url:    `${BASE_URL}/payment/success?token=${preview_token}`,
      metadata:        { order_id: order.id, preview_token: order.preview_token, payment_type },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
