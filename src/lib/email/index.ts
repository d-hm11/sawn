import { Resend } from 'resend'
import { render } from '@react-email/render'
import {
  ClientPaymentEmail,
  DesignerPaidEmail,
  RevisionRequestEmail,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM   = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`

export async function sendClientPaymentEmail(params: {
  to: string; clientName?: string; projectTitle: string
  designerName: string; downloadUrl: string; orderId: string; amount: number
}) {
  const html = await render(ClientPaymentEmail(params))
  return resend.emails.send({
    from: FROM, to: params.to,
    subject: `✅ ملفاتك جاهزة — ${params.projectTitle}`, html,
  })
}

export async function sendDesignerPaidEmail(params: {
  to: string; designerName: string; projectTitle: string
  clientEmail: string; designerAmount: number; orderId: string
}) {
  const html = await render(DesignerPaidEmail(params))
  return resend.emails.send({
    from: FROM, to: params.to,
    subject: `🎉 تم دفع مشروعك — ${params.projectTitle}`, html,
  })
}

export async function sendRevisionRequestEmail(params: {
  to: string; designerName: string; projectTitle: string
  clientNotes: string; revisionNumber: number; isPaid: boolean; orderId: string
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/${params.orderId}`
  const html = await render(RevisionRequestEmail({ ...params, dashboardUrl }))
  return resend.emails.send({
    from: FROM, to: params.to,
    subject: params.isPaid
      ? `💰 تعديل مدفوع جديد — ${params.projectTitle}`
      : `📝 طلب تعديل جديد — ${params.projectTitle}`,
    html,
  })
}
