import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'مفقود' }, { status: 400 })

  const { data: order } = await adminClient
    .from('orders')
    .select('id, status, download_token')
    .eq('preview_token', token)
    .in('status', ['delivered', 'settled'])
    .single()

  if (!order?.download_token) return NextResponse.json({ download_token: null })
  return NextResponse.json({ download_token: order.download_token, order_id: order.id })
}
