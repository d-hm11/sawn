import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const { data: order, error } = await adminClient
    .from('orders')
    .select(`
      id, status, project_title, project_description,
      client_amount, max_free_revisions, used_free_revisions,
      extra_revision_price, extra_revision_client_amount,
      expires_at, created_at,
      users!designer_id(full_name, avatar_url),
      order_files(version_number, is_current, designer_note, uploaded_at),
      revisions(id, revision_number, is_paid, client_notes, responded_at, requested_at)
    `)
    .eq('preview_token', token)
    .single()

  if (error || !order) return NextResponse.json({ error: 'رابط غير صالح' }, { status: 404 })
  if (new Date(order.expires_at) < new Date()) return NextResponse.json({ error: 'انتهت صلاحية الرابط' }, { status: 410 })

  return NextResponse.json({ order })
}
