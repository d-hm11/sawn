import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyWebhookSignature, getMoyasarPayment } from '@/lib/moyasar'
import { generateDownloadSignedUrl } from '@/lib/storage'
import { sendClientPaymentEmail, sendDesignerPaidEmail, sendRevisionRequestEmail } from '@/lib/email'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const rawBody   = await req.text()
  const signature = req.headers.get('x-moyasar-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signature, process.env.MOYASAR_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  if (event.type !== 'payment_paid') return NextResponse.json({ received: true })

  const payment     = event.data
  const paymentId   = payment.id
  const metadata    = payment.metadata ?? {}
  const orderId     = metadata.order_id
  const paymentType = metadata.payment_type ?? 'main'

  if (!orderId) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })

  // التحقق المزدوج من Moyasar
  const verified = await getMoyasarPayment(paymentId)
  if (verified.status !== 'paid') return NextResponse.json({ received: true })

  const { data: order } = await adminClient
    .from('orders')
    .select('id, status, payment_id, designer_amount, order_files(original_storage_path, is_current)')
    .eq('id', orderId).single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // ── الدفعة الأساسية ──────────────────────────────────────────
  if (paymentType === 'main') {
    if (order.payment_id === paymentId) return NextResponse.json({ received: true }) // idempotency

    const downloadToken = uuidv4()
    const { error: updateError } = await adminClient.from('orders').update({
      status: 'delivered', payment_id: paymentId, payment_metadata: verified,
      paid_at: new Date().toISOString(), download_token: downloadToken,
    }).eq('id', orderId).eq('status', 'pending')

    if (updateError) return NextResponse.json({ received: true })

    // جلب بيانات الأطراف وإرسال البريد
    const { data: fullOrder } = await adminClient.from('orders')
      .select('id, client_email, client_name, client_amount, designer_amount, project_title, download_token, users!designer_id(email, full_name)')
      .eq('id', orderId).single()

    if (fullOrder) {
      const designer     = (fullOrder.users as any)
      const BASE_URL     = process.env.NEXT_PUBLIC_BASE_URL!
      const downloadPage = `${BASE_URL}/download/${fullOrder.download_token}`

      await Promise.allSettled([
        sendClientPaymentEmail({ to: fullOrder.client_email, clientName: fullOrder.client_name ?? undefined, projectTitle: fullOrder.project_title, designerName: designer.full_name, downloadUrl: downloadPage, orderId: fullOrder.id, amount: fullOrder.client_amount }),
        sendDesignerPaidEmail({ to: designer.email, designerName: designer.full_name, projectTitle: fullOrder.project_title, clientEmail: fullOrder.client_email, designerAmount: fullOrder.designer_amount, orderId: fullOrder.id }),
      ])
    }
  }

  // ── دفعة التعديل الإضافي ─────────────────────────────────────
  if (paymentType === 'extra_revision') {
    const revisionId = metadata.revision_id
    await adminClient.from('extra_revision_payments').update({
      status: 'paid', payment_id: paymentId, payment_metadata: verified, paid_at: new Date().toISOString(),
    }).eq('revision_id', revisionId)

    const { data: cur } = await adminClient.from('orders').select('used_free_revisions').eq('id', orderId).single()
    await adminClient.from('orders').update({ status: 'revision_requested', used_free_revisions: (cur?.used_free_revisions ?? 0) + 1 }).eq('id', orderId)

    // إشعار المصمم
    const { data: fullOrder } = await adminClient.from('orders')
      .select('project_title, users!designer_id(email, full_name)').eq('id', orderId).single()
    const { data: revision }  = await adminClient.from('revisions').select('client_notes, revision_number').eq('id', revisionId).single()
    if (fullOrder && revision) {
      const designer = (fullOrder.users as any)
      sendRevisionRequestEmail({ to: designer.email, designerName: designer.full_name, projectTitle: fullOrder.project_title, clientNotes: revision.client_notes, revisionNumber: revision.revision_number, isPaid: true, orderId })
        .catch(e => console.error('[Email] paid revision notify failed:', e))
    }
  }

  return NextResponse.json({ received: true })
}
