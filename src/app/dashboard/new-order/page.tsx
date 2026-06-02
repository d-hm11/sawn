'use client'

import { useState } from 'react'
import Link from 'next/link'

function ShieldIcon({ size = 20, color = 'currentColor', strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

const PLATFORM_FEE = 0.07

export default function NewOrderPage() {
  const [form, setForm] = useState({
    project_title: '',
    client_email: '',
    client_name: '',
    project_description: '',
    designer_amount: '',
    max_free_revisions: '2',
    extra_revision_price: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewToken, setPreviewToken] = useState('')

  const designerAmt = parseFloat(form.designer_amount) || 0
  const platformFee = Math.round(designerAmt * PLATFORM_FEE * 100) / 100
  const clientAmt   = Math.round((designerAmt + platformFee) * 100) / 100
  const extraRevClientAmt = form.extra_revision_price
    ? Math.round(parseFloat(form.extra_revision_price) * (1 + PLATFORM_FEE) * 100) / 100
    : 0

  const fmt = (n: number) => n > 0
    ? n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ر.س'
    : '—'

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.project_title || !form.client_email || !form.designer_amount) return
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designer_id: 'usr_demo', client_email: form.client_email,
          client_name: form.client_name || null, project_title: form.project_title,
          project_description: form.project_description || null, designer_amount: designerAmt,
          platform_fee_pct: 7, max_free_revisions: parseInt(form.max_free_revisions),
          extra_revision_price: form.extra_revision_price ? parseFloat(form.extra_revision_price) : null,
        }),
      })
      const data = await res.json()
      if (res.ok) { setPreviewToken(data.order?.preview_token ?? 'tok_demo'); setSubmitted(true) }
    } catch {}
    setLoading(false)
  }

  /* ── حالة النجاح ─────────────────────────────────── */
  if (submitted) {
    const previewUrl = typeof window !== 'undefined' ? `${window.location.origin}/preview/${previewToken}` : `/preview/${previewToken}`
    return (
      <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(26,106,64,0.08)', border: '1px solid rgba(26,106,64,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 28, color: '#1A6A40',
          }}>✓</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)', marginBottom: 8, fontFamily: 'var(--font-tajawal)' }}>
            تم إنشاء الطلب بنجاح
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
            رابط المعاينة الآمن جاهز. أرسله لعميلك ليتمكن من مشاهدة التصميم وطلب التعديلات قبل الدفع.
          </p>
          <div style={{
            background: 'var(--white)', border: '1px solid var(--gold-border)',
            borderRadius: 8, padding: '16px 20px', marginBottom: 24, textAlign: 'right',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, marginBottom: 8 }}>رابط المعاينة</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--off-white)', border: '1px solid var(--line)', borderRadius: 6, padding: '10px 14px' }}>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'ltr' }}>
                {previewUrl}
              </span>
              <button onClick={() => navigator.clipboard.writeText(previewUrl)} style={{
                padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                background: 'var(--gold-pale)', border: '1px solid var(--gold-border)',
                color: 'var(--gold)', cursor: 'pointer',
              }}>نسخ</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn-secondary" style={{ padding: '10px 24px', borderRadius: 6 }}>
              العودة للوحة التحكم
            </Link>
            <Link href="/order/ord_new" className="btn-primary" style={{ padding: '10px 24px', borderRadius: 6 }}>
              إدارة الطلب ←
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', direction: 'rtl' }}>

      {/* شريط علوي */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--line)', padding: '0 40px', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-2)', fontSize: 13, fontWeight: 500 }}>
          ← العودة للوحة التحكم
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldIcon size={18} color="var(--gold)" />
          <div className="badge" style={{ marginBottom: 0 }}>طلب جديد</div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>

        {/* النموذج */}
        <form onSubmit={handleSubmit}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-tajawal)' }}>
            إنشاء طلب جديد
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>
            أدخل تفاصيل المشروع وستحصل على رابط معاينة آمن ترسله لعميلك.
          </p>

          {/* مجموعة: المشروع */}
          <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
            <legend style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--gold)' }} />
              بيانات المشروع
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="عنوان المشروع" required>
                <input value={form.project_title} onChange={set('project_title')}
                  placeholder="مثال: هوية بصرية لمطعم لافييرا"
                  required className="input-field" />
              </Field>
              <Field label="وصف المشروع (اختياري)">
                <textarea value={form.project_description} onChange={set('project_description')}
                  placeholder="تفاصيل إضافية عن المشروع..."
                  rows={3} className="input-field" style={{ resize: 'vertical' }} />
              </Field>
            </div>
          </fieldset>

          {/* مجموعة: العميل */}
          <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
            <legend style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--gold)' }} />
              بيانات العميل
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="البريد الإلكتروني للعميل" required>
                <input type="email" value={form.client_email} onChange={set('client_email')}
                  placeholder="client@example.com" required
                  className="input-field" style={{ direction: 'ltr' }} />
              </Field>
              <Field label="اسم العميل (اختياري)">
                <input value={form.client_name} onChange={set('client_name')}
                  placeholder="أحمد الشمري" className="input-field" />
              </Field>
            </div>
          </fieldset>

          {/* مجموعة: التسعير */}
          <fieldset style={{ border: 'none', padding: 0, marginBottom: 36 }}>
            <legend style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: 'var(--gold)' }} />
              التسعير والتعديلات
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Field label="مبلغك الصافي (ر.س)" required>
                <input type="number" value={form.designer_amount} onChange={set('designer_amount')}
                  placeholder="0" min="50" step="1" required
                  className="input-field" style={{ direction: 'ltr', textAlign: 'left' }} />
              </Field>
              <Field label="التعديلات المجانية">
                <select value={form.max_free_revisions} onChange={set('max_free_revisions')} className="input-field">
                  {[0,1,2,3,5].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'لا تعديلات' : `${n} تعديل`}</option>
                  ))}
                </select>
              </Field>
              <Field label="سعر التعديل الإضافي (ر.س)">
                <input type="number" value={form.extra_revision_price} onChange={set('extra_revision_price')}
                  placeholder="اختياري" min="0" step="1"
                  className="input-field" style={{ direction: 'ltr', textAlign: 'left' }} />
              </Field>
            </div>
          </fieldset>

          <button type="submit"
            disabled={loading || !form.project_title || !form.client_email || !form.designer_amount}
            className="btn-primary" style={{
              padding: '13px 36px', borderRadius: 6, fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: (!form.project_title || !form.client_email || !form.designer_amount) ? 0.5 : 1,
              cursor: (!form.project_title || !form.client_email || !form.designer_amount) ? 'not-allowed' : 'pointer',
            }}>
            <ShieldIcon size={18} color="#fff" strokeWidth={2} />
            {loading ? 'جاري الإنشاء...' : 'إنشاء الطلب وتوليد الرابط الآمن ←'}
          </button>
        </form>

        {/* حاسبة الرسوم (Sticky) */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{
            background: 'var(--white)', border: '1px solid var(--line)',
            borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
          }}>
            {/* رأس الحاسبة */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'var(--green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldIcon size={16} color="rgba(176,144,80,0.8)" />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                  حاسبة الرسوم التفاعلية
                </span>
              </div>
            </div>

            {/* جسم الحاسبة */}
            <div style={{ padding: '20px' }}>
              {[
                { label: 'مبلغك الصافي',               value: fmt(designerAmt), big: false },
                { label: 'رسوم المنصة (٧٪ على العميل)', value: fmt(platformFee), big: false, muted: true },
                { label: 'إجمالي ما يدفعه العميل',      value: fmt(clientAmt),   big: true },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: `${i === 2 ? '14px 0 0' : '10px 0'}`,
                  borderTop: i === 2 ? '1px solid var(--line)' : 'none',
                  marginTop: i === 2 ? 8 : 0,
                }}>
                  <span style={{ fontSize: 12.5, color: (row as any).muted ? 'var(--text-3)' : 'var(--text-2)' }}>{row.label}</span>
                  <span style={{
                    fontSize: row.big ? 18 : 13, fontWeight: row.big ? 900 : 600,
                    color: row.big ? 'var(--gold)' : 'var(--text)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{row.value}</span>
                </div>
              ))}

              {extraRevClientAmt > 0 && (
                <div style={{
                  marginTop: 16, padding: '12px 14px',
                  background: 'rgba(42,90,154,0.04)', border: '1px solid rgba(42,90,154,0.12)', borderRadius: 6,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(42,90,154,0.7)', letterSpacing: 1, marginBottom: 8 }}>التعديل الإضافي</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>سعرك</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{fmt(parseFloat(form.extra_revision_price) || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>يدفعه العميل</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2A5A9A' }}>{fmt(extraRevClientAmt)}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', background: 'var(--gold-pale)' }}>
              <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                ◈ رسوم المنصة تُضاف فوق مبلغك ولا تُخصم منه. تستلم مبلغك كاملاً بعد تأكيد العميل.
              </p>
            </div>
          </div>

          {/* طبقات الحماية */}
          <div style={{
            marginTop: 14, padding: '16px 18px',
            background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
              طبقات الحماية المفعّلة
            </div>
            {['علامة مائية بـ IP العميل', 'معاينة بدقة 72dpi فقط', 'تسليم فوري بعد الدفع'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="#1A8C50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', letterSpacing: 0.3 }}>
        {label}{required && <span style={{ color: 'var(--gold)', marginRight: 3 }}>*</span>}
      </span>
      {children}
    </label>
  )
}
