import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { sendRevisionRequestEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { preview_token, client_notes, client_email } = await req.json()

    if (!preview_token || !client_notes?.trim()) {
      return NextResponse.json({ error: 'البيانات ناقصة' }, { status: 400 })
    }

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, status, used_free_revisions, max_free_revisions, extra_revision_price, extra_revision_client_amount, expires_at')
      .eq('preview_token', preview_token)
      .single()

    if (orderError || !order) return NextResponse.json({ error: 'طلب غير موجود' }, { status: 404 })
    if (['paid','delivered','settled'].includes(order.status)) return NextResponse.json({ error: 'تم الدفع، لا يمكن طلب تعديل' }, { status: 400 })
    if (new Date(order.expires_at) < new Date()) return NextResponse.json({ error: 'انتهت صلاحية الرابط' }, { status: 410 })
    if (order.status === 'extra_revision_pending_payment') return NextResponse.json({ error: 'ينتظر دفع رسوم التعديل السابق' }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
    const isFreeRevision = order.used_free_revisions < order.max_free_revisions

    const { count: revCount } = await adminClient
      .from('revisions').select('*', { count: 'exact', head: true }).eq('order_id', order.id)

    const revisionNumber = (revCount ?? 0) + 1

    const { data: revision, error: revError } = await adminClient
      .from('revisions')
      .insert({ order_id: order.id, revision_number: revisionNumber, is_paid: !isFreeRevision, client_notes: client_notes.trim(), client_ip: ip, client_email: client_email ?? null })
      .select().single()

    if (revError) throw revError

    if (isFreeRevision) {
      await adminClient.from('orders').update({ status: 'revision_requested', used_free_revisions: order.used_free_revisions + 1 }).eq('id', order.id)

      // إشعار المصمم
      const { data: fullOrder } = await adminClient.from('orders')
        .select('project_title, users!designer_id(email, full_name)').eq('id', order.id).single()
      if (fullOrder) {
        const designer = (fullOrder.users as any)
        sendRevisionRequestEmail({ to: designer.email, designerName: designer.full_name, projectTitle: fullOrder.project_title, clientNotes: client_notes, revisionNumber, isPaid: false, orderId: order.id })
          .catch(e => console.error('[Email] revision notify failed:', e))
      }

      return NextResponse.json({ type: 'free', message: 'تم إرسال طلب التعديل', revision_id: revision.id })
    } else {
      await adminClient.from('extra_revision_payments').insert({
        order_id: order.id, revision_id: revision.id,
        amount: order.extra_revision_client_amount, designer_share: order.extra_revision_price, status: 'pending',
      })
      await adminClient.from('orders').update({ status: 'extra_revision_pending_payment' }).eq('id', order.id)

      return NextResponse.json({ type: 'paid', message: 'هذا التعديل يتطلب دفعاً إضافياً', amount: order.extra_revision_client_amount, revision_id: revision.id })
    }
  } catch (err: any) {
    console.error('[POST /api/revisions]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
