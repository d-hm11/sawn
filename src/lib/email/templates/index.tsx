import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Hr, Preview, Font,
} from '@react-email/components'
import * as React from 'react'

// ── Shared Styles ─────────────────────────────────────────────────
const s = {
  body:        { backgroundColor: '#f4f4f5', fontFamily: 'Arial, sans-serif', direction: 'rtl' as const },
  container:   { maxWidth: '560px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  header:      { backgroundColor: '#1e1b4b', padding: '24px 32px' },
  logo:        { color: '#fff', fontSize: '18px', margin: '0', fontWeight: 700 },
  content:     { padding: '32px' },
  h2:          { color: '#1a1a2e', fontSize: '22px', marginBottom: '16px' },
  text:        { color: '#4b5563', fontSize: '15px', lineHeight: '1.7', margin: '8px 0' },
  btn:         { backgroundColor: '#4f46e5', color: '#fff', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' },
  hr:          { borderColor: '#e5e7eb', margin: '24px 0' },
  details:     { backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px' },
  detailRow:   { color: '#374151', fontSize: '14px', margin: '6px 0' },
  code:        { backgroundColor: '#e5e7eb', borderRadius: '4px', padding: '2px 8px', fontFamily: 'monospace', fontSize: '13px' },
  warning:     { backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', color: '#92400e', fontSize: '13px' },
  amountCard:  { backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '20px', textAlign: 'center' as const, margin: '20px 0' },
  notesBox:    { backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '16px', margin: '16px 0 24px' },
  footer:      { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '16px 32px' },
  footerText:  { color: '#9ca3af', fontSize: '12px', textAlign: 'center' as const, margin: '0' },
}

// ── Client Payment Email ──────────────────────────────────────────
interface ClientPaymentProps {
  clientName?: string; projectTitle: string; designerName: string
  downloadUrl: string; orderId: string; amount: number
}

export function ClientPaymentEmail({ clientName, projectTitle, designerName, downloadUrl, orderId, amount }: ClientPaymentProps) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>تم استلام دفعتك — ملفاتك جاهزة للتحميل الآن ✅</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}><Heading style={s.logo}>🔐 منصة التصميم الآمنة</Heading></Section>
          <Section style={s.content}>
            <Heading as="h2" style={s.h2}>تم الدفع بنجاح! ✅</Heading>
            <Text style={s.text}>مرحباً {clientName ?? 'عزيزي العميل'}،</Text>
            <Text style={s.text}>
              تم استلام دفعتك للمشروع <strong>"{projectTitle}"</strong> بواسطة المصمم <strong>{designerName}</strong>.
              ملفاتك الأصلية جاهزة للتحميل الآن.
            </Text>
            <Section style={{ textAlign: 'center', margin: '28px 0' }}>
              <Button href={downloadUrl} style={s.btn}>⬇️ تحميل الملفات الأصلية</Button>
            </Section>
            <Text style={s.warning}>⚠️ رابط التحميل صالح لمدة 24 ساعة فقط.</Text>
            <Hr style={s.hr} />
            <Section style={s.details}>
              <Text style={s.detailRow}>📋 رقم الطلب: <code style={s.code}>{orderId.slice(0,8).toUpperCase()}</code></Text>
              <Text style={s.detailRow}>💰 المبلغ: <strong>{amount.toFixed(2)} ر.س</strong></Text>
              <Text style={s.detailRow}>🎨 المصمم: <strong>{designerName}</strong></Text>
            </Section>
          </Section>
          <Section style={s.footer}><Text style={s.footerText}>منصة التصميم الآمنة · حماية حقوق المصممين والعملاء</Text></Section>
        </Container>
      </Body>
    </Html>
  )
}

// ── Designer Paid Email ───────────────────────────────────────────
interface DesignerPaidProps {
  designerName: string; projectTitle: string; clientEmail: string
  designerAmount: number; orderId: string
}

export function DesignerPaidEmail({ designerName, projectTitle, clientEmail, designerAmount, orderId }: DesignerPaidProps) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>تم دفع مشروعك "{projectTitle}" 🎉</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}><Heading style={s.logo}>🔐 منصة التصميم الآمنة</Heading></Section>
          <Section style={s.content}>
            <Heading as="h2" style={s.h2}>🎉 تم دفع مشروعك!</Heading>
            <Text style={s.text}>مرحباً {designerName}،</Text>
            <Text style={s.text}>قام العميل (<strong>{clientEmail}</strong>) بالدفع لمشروع <strong>"{projectTitle}"</strong>.</Text>
            <Section style={s.amountCard}>
              <Text style={{ color: '#065f46', fontSize: '13px', margin: '0 0 4px' }}>ستستلم صافياً</Text>
              <Text style={{ color: '#059669', fontSize: '36px', fontWeight: 800, margin: '0' }}>{designerAmount.toFixed(2)} ر.س</Text>
              <Text style={{ color: '#6ee7b7', fontSize: '12px', margin: '8px 0 0' }}>سيتم التحويل خلال 1–3 أيام عمل</Text>
            </Section>
            <Hr style={s.hr} />
            <Text style={s.detailRow}>📋 رقم الطلب: <code style={s.code}>{orderId.slice(0,8).toUpperCase()}</code></Text>
          </Section>
          <Section style={s.footer}><Text style={s.footerText}>منصة التصميم الآمنة · حماية حقوق المصممين والعملاء</Text></Section>
        </Container>
      </Body>
    </Html>
  )
}

// ── Revision Request Email ────────────────────────────────────────
interface RevisionProps {
  designerName: string; projectTitle: string; clientNotes: string
  revisionNumber: number; isPaid: boolean; dashboardUrl: string
}

export function RevisionRequestEmail({ designerName, projectTitle, clientNotes, revisionNumber, isPaid, dashboardUrl }: RevisionProps) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{isPaid ? '💰 تعديل مدفوع جديد' : `طلب تعديل ${revisionNumber}`} على مشروع "{projectTitle}"</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}><Heading style={s.logo}>🔐 منصة التصميم الآمنة</Heading></Section>
          <Section style={s.content}>
            <Heading as="h2" style={s.h2}>{isPaid ? '💰 تعديل مدفوع جديد' : `📝 طلب تعديل ${revisionNumber}`}</Heading>
            <Text style={s.text}>مرحباً {designerName}،</Text>
            <Text style={s.text}>طلب العميل تعديلاً على مشروع <strong>"{projectTitle}"</strong>.{isPaid && ' تم دفع رسوم هذا التعديل.'}</Text>
            <Section style={s.notesBox}>
              <Text style={{ color: '#0369a1', fontSize: '13px', fontWeight: 700, margin: '0 0 8px' }}>ملاحظات العميل:</Text>
              <Text style={{ color: '#1e40af', fontSize: '14px', fontStyle: 'italic', margin: '0' }}>"{clientNotes}"</Text>
            </Section>
            <Button href={dashboardUrl} style={s.btn}>عرض الطلب ورفع النسخة الجديدة</Button>
          </Section>
          <Section style={s.footer}><Text style={s.footerText}>منصة التصميم الآمنة · حماية حقوق المصممين والعملاء</Text></Section>
        </Container>
      </Body>
    </Html>
  )
}
