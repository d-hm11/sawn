'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Order, Revision } from '@/types/database'

function ShieldIcon({ size = 20, color = 'currentColor', strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

const MOCK_ORDER: Order = {
  id: 'ord_1', designer_id: 'usr_1', client_email: 'ahmed@example.com',
  client_name: 'أحمد الشمري', project_title: 'هوية بصرية لمطعم لافييرا',
  project_description: 'تصميم شعار + ستيشنري كامل + قائمة الطعام',
  designer_amount: 2800, platform_fee_pct: 7, client_amount: 2996,
  max_free_revisions: 2, used_free_revisions: 1, extra_revision_price: 150,
  extra_revision_client_amount: 160.5, status: 'revision_requested',
  preview_token: 'tok_demo', download_token: null, payment_id: null,
  paid_at: null, settled_at: null,
  created_at: '2026-05-28T09:00:00Z', updated_at: '2026-05-30T14:20:00Z',
  expires_at: '2026-06-28T09:00:00Z',
}

const MOCK_REVISIONS: Revision[] = [
  {
    id: 'rev_1', order_id: 'ord_1', revision_number: 1, is_paid: false,
    client_notes: 'الشعار رائع لكن أريد تغيير لون الخلفية إلى الأبيض الكريمي، وزيادة حجم الخط قليلاً في الاسم الإنجليزي.',
    client_ip: '91.97.20.100', client_email: 'ahmed@example.com',
    response_file_id: null, responded_at: null,
    requested_at: '2026-05-30T14:20:00Z',
  },
]

const TIMELINE_STEPS = [
  { key: 'draft',    label: 'إنشاء الطلب',    desc: 'تم إنشاء الطلب وتوليد رابط المعاينة' },
  { key: 'pending',  label: 'رفع الملف',        desc: 'المصمم يرفع ملف المعاينة والأصلي' },
  { key: 'review',   label: 'مراجعة العميل',    desc: 'العميل يشاهد التصميم ويطلب التعديلات' },
  { key: 'payment',  label: 'الدفع',            desc: 'العميل يوافق ويسدّد المبلغ' },
  { key: 'delivery', label: 'التسليم',          desc: 'تُفتح الملفات الأصلية فوراً' },
  { key: 'settled',  label: 'التحصيل',          desc: 'يُحوَّل المبلغ الصافي للمصمم' },
]

function getTimelineIndex(status: string): number {
  const map: Record<string, number> = {
    draft: 0, pending: 1, revision_requested: 2, revision_in_progress: 2,
    extra_revision_pending_payment: 2, extra_revision_paid: 2,
    paid: 3, delivered: 4, settled: 5, expired: -1,
  }
  return map[status] ?? 0
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  draft:                { label: 'مسودة',             color: '#888',    bg: 'rgba(136,136,136,0.08)' },
  pending:              { label: 'بانتظار الملف',      color: '#9A7A20', bg: 'rgba(176,144,80,0.1)'   },
  revision_requested:   { label: 'طلب تعديل',          color: '#B05520', bg: 'rgba(176,85,32,0.08)'   },
  revision_in_progress: { label: 'قيد التعديل',         color: '#2A5A9A', bg: 'rgba(42,90,154,0.08)'   },
  paid:                 { label: 'مدفوع',               color: '#1A6A40', bg: 'rgba(26,106,64,0.08)'   },
  delivered:            { label: 'تم التسليم',           color: '#1A6A40', bg: 'rgba(26,106,64,0.08)'   },
  settled:              { label: 'مكتمل',                color: '#1A6A40', bg: 'rgba(26,106,64,0.08)'   },
  expired:              { label: 'منتهي',                color: '#9A2020', bg: 'rgba(154,32,32,0.08)'   },
}

const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 0 }) + ' ر.س'
const fmtDate = (iso: string) => new Date(iso).toLocaleString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function OrderPage() {
  const order = MOCK_ORDER
  const revisions = MOCK_REVISIONS
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)

  const timelineIdx = getTimelineIndex(order.status)
  const statusMeta = STATUS_META[order.status] ?? STATUS_META['draft']
  const previewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/preview/${order.preview_token}`
    : `/preview/${order.preview_token}`

  function copyLink() {
    navigator.clipboard.writeText(previewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) simulateUpload(file.name)
  }

  function simulateUpload(name: string) {
    setUploading(true)
    setTimeout(() => { setUploadedFile(name); setUploading(false) }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', direction: 'rtl' }}>

      {/* شريط علوي */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--line)',
        padding: '0 40px', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 20, boxShadow: 'var(--shadow-sm)',
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-2)', fontSize: 13, fontWeight: 500 }}>
          ← الطلبات
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700,
            color: statusMeta.color, background: statusMeta.bg,
          }}>{statusMeta.label}</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>#{order.id.slice(-6)}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '40px 40px' }}>

        {/* ترويسة الطلب */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.5px', marginBottom: 8, fontFamily: 'var(--font-tajawal)' }}>
            {order.project_title}
          </h1>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>👤 {order.client_name ?? order.client_email}</span>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>◈ {order.client_email}</span>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>أُنشئ {fmtDate(order.created_at)}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28 }}>

          {/* العمود الرئيسي */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* الخط الزمني */}
            <section style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldIcon size={14} color="var(--gold)" />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-2)', textTransform: 'uppercase' }}>مسار الصفقة</span>
              </div>
              <div style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                  {/* خط الربط الكامل */}
                  <div style={{ position: 'absolute', top: 14, right: 14, left: 14, height: 1, background: 'var(--line)', zIndex: 0 }} />
                  {/* التقدم الذهبي */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14, height: 1,
                    width: `${Math.max(0, timelineIdx / (TIMELINE_STEPS.length - 1)) * 100}%`,
                    background: 'var(--gold)', zIndex: 1, transition: 'width 0.6s ease',
                  }} />

                  {TIMELINE_STEPS.map((step, i) => {
                    const done   = i < timelineIdx
                    const active = i === timelineIdx
                    return (
                      <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', border: '2px solid',
                          borderColor: done || active ? 'var(--gold)' : 'var(--line)',
                          background: done ? 'var(--gold)' : active ? 'var(--gold-pale)' : 'var(--white)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: done ? 11 : 10, fontWeight: 700,
                          color: done ? '#fff' : active ? 'var(--gold)' : 'var(--text-3)',
                          transition: 'all 0.3s', flexShrink: 0,
                        }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10.5, fontWeight: active ? 800 : 600, color: active ? 'var(--green)' : done ? 'var(--text-2)' : 'var(--text-3)', marginBottom: 2 }}>
                            {step.label}
                          </div>
                          {active && (
                            <div style={{ fontSize: 9.5, color: 'var(--text-3)', lineHeight: 1.4, maxWidth: 72 }}>
                              {step.desc}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* رابط المعاينة */}
            <section style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-2)', textTransform: 'uppercase' }}>رابط المعاينة الآمن</span>
              </div>
              <div style={{ padding: '18px 24px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  flex: 1, background: 'var(--off-white)', border: '1px solid var(--line)',
                  borderRadius: 6, padding: '10px 14px', fontSize: 12,
                  color: 'var(--text-2)', fontFamily: 'monospace', direction: 'ltr',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{previewUrl}</div>
                <button onClick={copyLink} style={{
                  padding: '10px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                  border: '1px solid', cursor: 'pointer',
                  borderColor: copied ? 'rgba(26,106,64,0.3)' : 'var(--gold-border)',
                  background: copied ? 'rgba(26,106,64,0.06)' : 'var(--gold-pale)',
                  color: copied ? '#1A6A40' : 'var(--gold)',
                  transition: 'all 0.2s',
                }}>{copied ? '✓ تم النسخ' : 'نسخ'}</button>
              </div>
            </section>

            {/* رفع الملف */}
            <section style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-2)', textTransform: 'uppercase' }}>رفع الملفات</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>نسخة المعاينة + الملف الأصلي</span>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {uploadedFile ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    background: 'rgba(26,106,64,0.05)', border: '1px solid rgba(26,106,64,0.15)', borderRadius: 6,
                  }}>
                    <span style={{ fontSize: 18, color: '#1A6A40' }}>✓</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A6A40' }}>تم الرفع بنجاح</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{uploadedFile}</div>
                    </div>
                    <button onClick={() => setUploadedFile(null)} style={{
                      marginRight: 'auto', fontSize: 11, color: 'var(--text-3)',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}>إعادة الرفع</button>
                  </div>
                ) : (
                  <label
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '36px 24px', borderRadius: 6, cursor: 'pointer', gap: 10,
                      border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--line)'}`,
                      background: dragOver ? 'var(--gold-pale)' : 'var(--off-white)',
                      transition: 'all 0.2s',
                    }}>
                    <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) simulateUpload(f.name) }}
                      accept=".zip,.pdf,.png,.jpg,.ai,.psd,.fig" />
                    {uploading ? (
                      <div style={{ fontSize: 13, color: 'var(--text-2)' }}>جاري الرفع...</div>
                    ) : (
                      <>
                        <div style={{ color: 'var(--text-3)' }}>
                          <ShieldIcon size={28} color="var(--gold-border)" strokeWidth={1.5} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>اسحب الملف هنا أو اضغط للاختيار</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>ZIP, PDF, PNG, AI, PSD, FIG</div>
                      </>
                    )}
                  </label>
                )}
              </div>
            </section>

            {/* طلبات التعديل */}
            {revisions.length > 0 && (
              <section style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-2)', textTransform: 'uppercase' }}>طلبات التعديل</span>
                  <span style={{ padding: '3px 10px', borderRadius: 3, fontSize: 11, fontWeight: 700, background: 'rgba(176,85,32,0.08)', color: '#B05520' }}>
                    {revisions.length} طلب
                  </span>
                </div>
                {revisions.map((rev, i) => (
                  <div key={rev.id} style={{ padding: '20px 24px', borderBottom: i < revisions.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: 'rgba(176,85,32,0.08)', color: '#B05520' }}>
                          تعديل #{rev.revision_number}
                        </span>
                        {!rev.is_paid && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>مجاني</span>}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDate(rev.requested_at)}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.75, marginBottom: 10 }}>
                      {rev.client_notes}
                    </p>
                    {rev.client_ip && (
                      <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 16 }}>
                        <span>IP: {rev.client_ip}</span>
                        {rev.client_email && <span>◈ {rev.client_email}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ملخص مالي */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', background: 'var(--green)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>الملخص المالي</span>
              </div>
              <div style={{ padding: '16px 18px' }}>
                {[
                  { label: 'مبلغك الصافي',   value: fmt(order.designer_amount), big: true },
                  { label: 'رسوم المنصة ٧٪', value: fmt(order.client_amount - order.designer_amount) },
                  { label: 'يدفعه العميل',   value: fmt(order.client_amount) },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: `${i === 0 ? '0 0 10px' : '8px 0'}`,
                    borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.label}</span>
                    <span style={{
                      fontSize: row.big ? 18 : 13, fontWeight: row.big ? 900 : 600,
                      color: row.big ? 'var(--gold)' : 'var(--text)', fontVariantNumeric: 'tabular-nums',
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* التعديلات */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 12 }}>التعديلات</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>مجانية</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {order.used_free_revisions} / {order.max_free_revisions}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {Array.from({ length: order.max_free_revisions }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i < order.used_free_revisions ? 'var(--gold)' : 'var(--line)',
                  }} />
                ))}
              </div>
              {order.extra_revision_price && (
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  التعديل الإضافي: <span style={{ color: 'var(--text)' }}>{fmt(order.extra_revision_price)}</span>
                </div>
              )}
            </div>

            {/* إجراءات */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 8, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 14 }}>إجراءات</div>
              <Link href={`/preview/${order.preview_token}`} style={{
                display: 'block', textAlign: 'center', padding: '10px 0',
                background: 'var(--gold-pale)', border: '1px solid var(--gold-border)',
                borderRadius: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)',
                textDecoration: 'none', marginBottom: 8, transition: 'background 0.15s',
              }}>
                مشاهدة كما يراها العميل ←
              </Link>
              <button style={{
                display: 'block', width: '100%', padding: '10px 0',
                background: 'transparent', border: '1px solid var(--line)',
                borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
              }}>إلغاء الطلب</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
