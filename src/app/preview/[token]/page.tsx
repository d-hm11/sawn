'use client'

import { useState } from 'react'

function ShieldIcon({ size = 20, color = 'currentColor', strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

/* ─── بيانات تجريبية ─────────────────────────────────── */
const MOCK_DATA = {
  order: {
    id: 'ord_1', project_title: 'هوية بصرية لمطعم لافييرا',
    project_description: 'شعار + ستيشنري كامل + قائمة طعام',
    designer_amount: 2800, platform_fee_pct: 7, client_amount: 2996,
    max_free_revisions: 2, used_free_revisions: 1, extra_revision_price: 150,
    extra_revision_client_amount: 160.5, status: 'revision_requested',
  },
  designer: { full_name: 'محمد المصمم', email: 'designer@example.com' },
  hasPreviewFile: true,
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:                    { label: 'بانتظار رفع الملف من المصمم', color: '#9A7A20', bg: 'rgba(176,144,80,0.1)' },
  revision_requested:         { label: 'طلب تعديلك بانتظار المصمم',  color: '#B05520', bg: 'rgba(176,85,32,0.08)' },
  revision_in_progress:       { label: 'المصمم يعمل على التعديل',     color: '#2A5A9A', bg: 'rgba(42,90,154,0.08)' },
  extra_revision_pending_payment: { label: 'يتطلب دفع تعديل إضافي', color: '#B05520', bg: 'rgba(176,85,32,0.08)' },
  paid:                       { label: 'تم الدفع — الملفات الأصلية متاحة', color: '#1A6A40', bg: 'rgba(26,106,64,0.08)' },
  delivered:                  { label: 'مكتمل — تم التسليم',          color: '#1A6A40', bg: 'rgba(26,106,64,0.08)' },
  settled:                    { label: 'مكتمل',                        color: '#1A6A40', bg: 'rgba(26,106,64,0.08)' },
}

const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 0 }) + ' ر.س'

export default function PreviewPage() {
  const { order, designer, hasPreviewFile } = MOCK_DATA
  const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS['pending']

  const [tab, setTab] = useState<'preview' | 'revise' | 'pay'>('preview')
  const [revisionNote, setRevisionNote] = useState('')
  const [revisionEmail, setRevisionEmail] = useState('')
  const [revisionSent, setRevisionSent] = useState(false)
  const [payStep, setPayStep] = useState<'confirm' | 'processing' | 'done'>('confirm')

  const remainingRevisions = order.max_free_revisions - order.used_free_revisions
  const platformFee = order.client_amount - order.designer_amount

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', direction: 'rtl' }}>

      {/* شريط علوي */}
      <nav style={{
        background: 'var(--white)', borderBottom: '1px solid var(--line)',
        padding: '0 32px', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 30,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* الشعار */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldIcon size={22} color="var(--gold)" strokeWidth={1.8} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--green)', fontFamily: 'var(--font-tajawal)' }}>صون</span>
            <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>Sawn</span>
          </div>
        </div>

        {/* حالة الطلب */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700,
          color: statusInfo.color, background: statusInfo.bg,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.color, flexShrink: 0 }} />
          {statusInfo.label}
        </div>
      </nav>

      {/* ترويسة الطلب */}
      <div style={{ padding: '28px 40px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1.5, marginBottom: 8 }}>
              ◈ تصميم مقدَّم من {designer.full_name}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.4px', fontFamily: 'var(--font-tajawal)' }}>
              {order.project_title}
            </h1>
            {order.project_description && (
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{order.project_description}</p>
            )}
          </div>

          {/* المبلغ */}
          <div style={{
            background: 'var(--white)', border: '1px solid var(--line)',
            borderRadius: 8, padding: '16px 20px', minWidth: 200, textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>المبلغ الإجمالي</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.5px', marginBottom: 4 }}>
              {fmt(order.client_amount)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>شامل رسوم الحماية ({fmt(platformFee)})</div>
          </div>
        </div>

        {/* التبويبات */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
          {[
            { key: 'preview', label: 'المعاينة المحمية' },
            { key: 'revise',  label: `طلب تعديل${remainingRevisions > 0 ? ` (${remainingRevisions} متبقي)` : ''}` },
            { key: 'pay',     label: 'الموافقة والدفع' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
              padding: '12px 20px', fontSize: 13.5, fontWeight: 600,
              border: 'none', background: 'none', cursor: 'pointer',
              color: tab === t.key ? 'var(--green)' : 'var(--text-2)',
              borderBottom: `2px solid ${tab === t.key ? 'var(--gold)' : 'transparent'}`,
              transition: 'all 0.15s', fontFamily: 'var(--font-tajawal)',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* المحتوى */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px 64px' }}>

        {/* ══ المعاينة ══════════════════════════════════ */}
        {tab === 'preview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'start' }}>

            {/* مستعرض الصورة */}
            <div style={{
              background: 'var(--white)', border: '1px solid var(--line)',
              borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
            }}>
              {/* شريط الحماية */}
              <div style={{
                padding: '10px 16px', background: 'var(--gold-pale)',
                borderBottom: '1px solid var(--gold-border)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <ShieldIcon size={14} color="var(--gold)" strokeWidth={2} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9A7A20' }}>
                  معاينة محمية — جودة منخفضة + علامة مائية بـ IP الخاص بك
                </span>
              </div>

              {/* الصورة */}
              <div style={{
                position: 'relative', background: 'var(--green)',
                minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {hasPreviewFile ? (
                  <>
                    {/* درع خلفي */}
                    <div style={{ opacity: 0.06, position: 'absolute' }}>
                      <svg width="300" height="300" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
                      </svg>
                    </div>

                    {/* محتوى وهمي */}
                    <div style={{ textAlign: 'center', opacity: 0.4, position: 'relative', zIndex: 1 }}>
                      <div style={{
                        fontSize: 64, fontWeight: 900, color: 'var(--gold)',
                        fontFamily: 'var(--font-playfair)', letterSpacing: -4, marginBottom: 8,
                      }}>لافييرا</div>
                      <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 8, fontFamily: 'var(--font-playfair)' }}>
                        LA VIERA
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>FINE DINING</div>
                    </div>

                    {/* العلامة المائية */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          top: `${(i % 4) * 28 - 10}%`,
                          right: `${Math.floor(i / 4) * 38 - 10}%`,
                          transform: 'rotate(-30deg)',
                          fontSize: 10, color: 'rgba(255,255,255,0.12)',
                          fontFamily: 'monospace', whiteSpace: 'nowrap', lineHeight: 1.8,
                        }}>
                          <div>IP: 91.97.20.100</div>
                          <div>ahmed@example.com</div>
                          <div>{new Date().toLocaleDateString('ar-SA')}</div>
                        </div>
                      ))}
                    </div>

                    {/* شريط أسفل */}
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0, left: 0, padding: '10px 16px',
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>preview · 72dpi · watermarked</span>
                      <span style={{ fontSize: 9, color: 'rgba(176,144,80,0.6)', fontFamily: 'monospace' }}>صون ©</span>
                    </div>

                    {/* منع السحب */}
                    <div style={{ position: 'absolute', inset: 0, userSelect: 'none' }}
                      onContextMenu={e => e.preventDefault()}
                      onDragStart={e => e.preventDefault()} />
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
                    <div style={{ fontSize: 14 }}>المصمم لم يرفع ملف المعاينة بعد</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>ستصلك إشعار بالبريد حين تكون جاهزاً</div>
                  </div>
                )}
              </div>
            </div>

            {/* بطاقة التفاصيل */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* ضمانات العميل */}
              <div style={{
                background: 'var(--white)', border: '1px solid var(--line)',
                borderRadius: 8, padding: '16px 18px', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                  ضماناتك كعميل
                </div>
                {[
                  'الملفات الأصلية تُفتح فوراً بعد الدفع',
                  'التعديلات المجانية قبل أي التزام مالي',
                  'المال محفوظ في الضمان حتى استلامك',
                  'بريد تأكيدي فوري بالملفات',
                ].map(g => (
                  <div key={g} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M3 8l3.5 3.5L13 5" stroke="#1A8C50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{g}</span>
                  </div>
                ))}
              </div>

              {/* التعديلات */}
              <div style={{
                background: 'var(--white)', border: '1px solid var(--line)',
                borderRadius: 8, padding: '16px 18px', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                  التعديلات المجانية
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>متبقي</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: remainingRevisions > 0 ? 'var(--gold)' : '#CC4444' }}>
                    {remainingRevisions} / {order.max_free_revisions}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: order.max_free_revisions }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < order.used_free_revisions ? 'var(--gold)' : 'var(--line)',
                    }} />
                  ))}
                </div>
                {order.extra_revision_price && (
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>
                    التعديل الإضافي: {fmt(order.extra_revision_client_amount ?? 0)}
                  </div>
                )}
              </div>

              {/* أزرار */}
              <button onClick={() => setTab('revise')} className="btn-secondary"
                style={{ padding: '11px 0', borderRadius: 6, width: '100%', fontSize: 13 }}>
                طلب تعديل
              </button>
              <button onClick={() => setTab('pay')} className="btn-primary"
                style={{ padding: '12px 0', borderRadius: 6, width: '100%', fontSize: 13 }}>
                الموافقة والدفع ←
              </button>
            </div>
          </div>
        )}

        {/* ══ طلب التعديل ══════════════════════════════ */}
        {tab === 'revise' && (
          <div style={{ maxWidth: 640 }}>
            {revisionSent ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(26,106,64,0.08)', border: '1px solid rgba(26,106,64,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 24, color: '#1A6A40',
                }}>✓</div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: 8, fontFamily: 'var(--font-tajawal)' }}>
                  تم إرسال طلب التعديل
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 24px' }}>
                  سيتلقى المصمم ملاحظاتك ويرفع النسخة المعدّلة. ستصلك إشعار بالبريد.
                </p>
                <button onClick={() => { setRevisionSent(false); setRevisionNote(''); setTab('preview') }}
                  className="btn-secondary" style={{ padding: '10px 24px', borderRadius: 6 }}>
                  العودة للمعاينة
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: 6, fontFamily: 'var(--font-tajawal)' }}>
                  طلب تعديل
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                  {remainingRevisions > 0
                    ? `لديك ${remainingRevisions} تعديل مجاني متبقي.`
                    : `انتهت التعديلات المجانية. التعديل التالي سيكلف ${fmt(order.extra_revision_client_amount ?? 0)}.`}
                </p>

                {remainingRevisions === 0 && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 6, marginBottom: 20,
                    background: 'rgba(176,85,32,0.06)', border: '1px solid rgba(176,85,32,0.2)',
                  }}>
                    <span style={{ fontSize: 12, color: '#B05520' }}>
                      ⚠ سيُرسل رابط دفع إضافي بقيمة {fmt(order.extra_revision_client_amount ?? 0)} قبل البدء في التعديل.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>بريدك الإلكتروني</span>
                    <input type="email" value={revisionEmail} onChange={e => setRevisionEmail(e.target.value)}
                      placeholder="email@example.com" className="input-field" style={{ direction: 'ltr' }} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>
                      ملاحظات التعديل <span style={{ color: 'var(--gold)' }}>*</span>
                    </span>
                    <textarea value={revisionNote} onChange={e => setRevisionNote(e.target.value)}
                      placeholder="صِف بوضوح ما تريد تعديله: اللون، الحجم، الخط..." rows={5}
                      className="input-field" style={{ resize: 'vertical' }} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setRevisionSent(true)} disabled={!revisionNote.trim()}
                    className="btn-primary" style={{
                      padding: '11px 28px', borderRadius: 6, fontSize: 14,
                      opacity: revisionNote.trim() ? 1 : 0.5,
                      cursor: revisionNote.trim() ? 'pointer' : 'not-allowed',
                    }}>إرسال طلب التعديل</button>
                  <button onClick={() => setTab('preview')} className="btn-secondary"
                    style={{ padding: '11px 20px', borderRadius: 6 }}>إلغاء</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ الدفع ════════════════════════════════════ */}
        {tab === 'pay' && (
          <div style={{ maxWidth: 560 }}>
            {payStep === 'done' ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(26,106,64,0.08)', border: '1px solid rgba(26,106,64,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', fontSize: 28, color: '#1A6A40',
                }}>✓</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', marginBottom: 8, fontFamily: 'var(--font-tajawal)' }}>
                  تم الدفع بنجاح
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.75, maxWidth: 380, margin: '0 auto 28px' }}>
                  الملفات الأصلية عالية الجودة أُرسلت إلى بريدك الإلكتروني. شكراً لثقتك.
                </p>
                <div style={{
                  background: 'var(--white)', border: '1px solid rgba(26,106,64,0.15)',
                  borderRadius: 8, padding: '16px 20px', textAlign: 'right', maxWidth: 360, margin: '0 auto',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>تفاصيل الدفع</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-2)' }}>المبلغ المدفوع</span>
                    <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{fmt(order.client_amount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: 6, fontFamily: 'var(--font-tajawal)' }}>
                  الموافقة النهائية والدفع
                </h2>
                <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.75, marginBottom: 28 }}>
                  بالضغط على "تأكيد الدفع" أنت توافق على التصميم وتأذن بتحرير المبلغ للمصمم لحظة استلام ملفاتك.
                </p>

                {/* ملخص الدفع */}
                <div style={{
                  background: 'var(--white)', border: '1px solid var(--line)',
                  borderRadius: 8, overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', background: 'var(--green)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>ملخص الدفع</span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    {[
                      { label: 'قيمة التصميم',           value: fmt(order.designer_amount) },
                      { label: 'رسوم حماية المشتري (٧٪)', value: fmt(platformFee) },
                    ].map((row, i) => (
                      <div key={row.label} style={{
                        display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                        borderBottom: '1px solid var(--line)', fontSize: 13,
                      }}>
                        <span style={{ color: 'var(--text-2)' }}>{row.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>الإجمالي</span>
                      <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.5px' }}>
                        {fmt(order.client_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* طرق الدفع */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                    طرق الدفع المتاحة
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['mada', 'Apple Pay', 'STC Pay', 'Visa / Mastercard'].map(m => (
                      <div key={m} style={{
                        padding: '8px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                        border: '1px solid var(--line)', color: 'var(--text-2)', background: 'var(--white)',
                      }}>{m}</div>
                    ))}
                  </div>
                </div>

                {/* تنبيه */}
                <div style={{
                  padding: '12px 16px', borderRadius: 6, marginBottom: 20,
                  background: 'var(--gold-pale)', border: '1px solid var(--gold-border)',
                }}>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
                    ◈ الدفع يُمثّل موافقتك النهائية على التصميم. ستصل الملفات الأصلية عالية الجودة فوراً لبريدك.
                  </p>
                </div>

                <button
                  onClick={() => { setPayStep('processing'); setTimeout(() => setPayStep('done'), 2000) }}
                  disabled={payStep === 'processing'}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px 0', borderRadius: 6, fontSize: 15, fontWeight: 800 }}>
                  {payStep === 'processing' ? 'جاري المعالجة...' : `تأكيد الدفع — ${fmt(order.client_amount)}`}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
