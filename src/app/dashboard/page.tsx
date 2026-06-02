'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/types/database'

function ShieldIcon({ size = 20, color = 'currentColor', strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_1', designer_id: 'usr_1', client_email: 'ahmed@example.com',
    client_name: 'أحمد الشمري', project_title: 'هوية بصرية لمطعم لافييرا',
    project_description: 'تصميم شعار + ستيشنري كامل', designer_amount: 2800,
    platform_fee_pct: 7, client_amount: 2996, max_free_revisions: 2,
    used_free_revisions: 1, extra_revision_price: 150,
    extra_revision_client_amount: 160.5, status: 'revision_requested',
    preview_token: 'tok_1', download_token: null, payment_id: null,
    paid_at: null, settled_at: null,
    created_at: '2026-05-28T09:00:00Z', updated_at: '2026-05-30T14:20:00Z',
    expires_at: '2026-06-28T09:00:00Z',
  },
  {
    id: 'ord_2', designer_id: 'usr_1', client_email: 'sara@example.com',
    client_name: 'سارة العتيبي', project_title: 'تصميم UI لتطبيق توصيل',
    project_description: 'شاشات رئيسية + نظام ألوان', designer_amount: 4500,
    platform_fee_pct: 7, client_amount: 4815, max_free_revisions: 3,
    used_free_revisions: 0, extra_revision_price: 200,
    extra_revision_client_amount: 214, status: 'paid',
    preview_token: 'tok_2', download_token: 'dl_tok_2', payment_id: 'pay_123',
    paid_at: '2026-05-25T11:00:00Z', settled_at: null,
    created_at: '2026-05-20T10:00:00Z', updated_at: '2026-05-25T11:05:00Z',
    expires_at: '2026-06-20T10:00:00Z',
  },
  {
    id: 'ord_3', designer_id: 'usr_1', client_email: 'khalid@example.com',
    client_name: 'خالد المنصور', project_title: 'موشن جرافيك إعلان منتج',
    project_description: 'فيديو 30 ثانية للسوشيال ميديا', designer_amount: 1200,
    platform_fee_pct: 7, client_amount: 1284, max_free_revisions: 1,
    used_free_revisions: 1, extra_revision_price: 300,
    extra_revision_client_amount: 321, status: 'settled',
    preview_token: 'tok_3', download_token: 'dl_tok_3', payment_id: 'pay_456',
    paid_at: '2026-05-15T08:30:00Z', settled_at: '2026-05-16T08:30:00Z',
    created_at: '2026-05-10T07:00:00Z', updated_at: '2026-05-16T08:30:00Z',
    expires_at: '2026-06-10T07:00:00Z',
  },
  {
    id: 'ord_4', designer_id: 'usr_1', client_email: 'noura@example.com',
    client_name: 'نورة القحطاني', project_title: 'تصميم بروشور فعالية',
    project_description: null, designer_amount: 650,
    platform_fee_pct: 7, client_amount: 695.5, max_free_revisions: 2,
    used_free_revisions: 0, extra_revision_price: null,
    extra_revision_client_amount: null, status: 'pending',
    preview_token: 'tok_4', download_token: null, payment_id: null,
    paid_at: null, settled_at: null,
    created_at: '2026-06-01T12:00:00Z', updated_at: '2026-06-01T12:00:00Z',
    expires_at: '2026-07-01T12:00:00Z',
  },
  {
    id: 'ord_5', designer_id: 'usr_1', client_email: 'faisal@example.com',
    client_name: 'فيصل الدوسري', project_title: 'تصميم واجهة لوحة تحكم SaaS',
    project_description: 'تصميم شاشة 12+ مع مكتبة مكونات', designer_amount: 7500,
    platform_fee_pct: 7, client_amount: 8025, max_free_revisions: 3,
    used_free_revisions: 2, extra_revision_price: 400,
    extra_revision_client_amount: 428, status: 'revision_in_progress',
    preview_token: 'tok_5', download_token: null, payment_id: null,
    paid_at: null, settled_at: null,
    created_at: '2026-05-18T08:00:00Z', updated_at: '2026-06-01T16:00:00Z',
    expires_at: '2026-06-18T08:00:00Z',
  },
]

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  draft:                { label: 'مسودة',              color: '#888',    bg: 'rgba(136,136,136,0.08)', dot: '#888' },
  pending:              { label: 'بانتظار رفع الملف',  color: '#9A7A20', bg: 'rgba(176,144,80,0.1)',   dot: 'var(--gold)' },
  revision_requested:   { label: 'طلب تعديل',          color: '#B05520', bg: 'rgba(176,85,32,0.08)',   dot: '#B05520' },
  extra_revision_pending_payment: { label: 'انتظار دفع تعديل', color: '#B05520', bg: 'rgba(176,85,32,0.08)', dot: '#B05520' },
  extra_revision_paid:  { label: 'تعديل إضافي مدفوع', color: '#2A5A9A', bg: 'rgba(42,90,154,0.08)',   dot: '#2A5A9A' },
  revision_in_progress: { label: 'قيد التعديل',         color: '#2A5A9A', bg: 'rgba(42,90,154,0.08)',   dot: '#2A5A9A' },
  paid:                 { label: 'مدفوع',               color: '#1A6A40', bg: 'rgba(26,106,64,0.08)',   dot: '#1A6A40' },
  delivered:            { label: 'تم التسليم',           color: '#1A6A40', bg: 'rgba(26,106,64,0.08)',   dot: '#1A6A40' },
  settled:              { label: 'مكتمل',                color: '#1A6A40', bg: 'rgba(26,106,64,0.08)',   dot: '#1A6A40' },
  expired:              { label: 'منتهي',                color: '#9A2020', bg: 'rgba(154,32,32,0.08)',   dot: '#9A2020' },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
const formatAmount = (n: number) =>
  n.toLocaleString('ar-SA', { minimumFractionDigits: 0 }) + ' ر.س'

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>('all')
  const orders = MOCK_ORDERS
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const totalEarned  = orders.filter(o => o.status === 'settled').reduce((s, o) => s + o.designer_amount, 0)
  const activeCount  = orders.filter(o => !['settled', 'expired', 'draft'].includes(o.status)).length
  const pendingPay   = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.designer_amount, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', direction: 'rtl' }}>

      {/* ══ الشريط الجانبي ══════════════════════════════ */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--white)', borderLeft: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* الشعار */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--line)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldIcon size={22} color="var(--gold)" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--green)' }}>صون</span>
              <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>Sawn</span>
            </div>
          </Link>
        </div>

        {/* التنقل */}
        <nav style={{ padding: '14px 10px', flex: 1 }}>
          {[
            { icon: '◈', label: 'الطلبات',    href: '/dashboard',           active: true },
            { icon: '◇', label: 'طلب جديد',   href: '/dashboard/new-order', active: false },
            { icon: '◉', label: 'الأرباح',     href: '/dashboard/earnings',  active: false },
            { icon: '○', label: 'الإعدادات',  href: '/dashboard/settings',  active: false },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6, marginBottom: 2,
              textDecoration: 'none', fontSize: 13.5, fontWeight: item.active ? 700 : 500,
              color: item.active ? 'var(--green)' : 'var(--text-2)',
              background: item.active ? 'var(--gold-pale)' : 'transparent',
              borderRight: item.active ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ color: item.active ? 'var(--gold)' : 'var(--text-3)', fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* بيانات المصمم */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--gold-pale)', border: '1px solid var(--gold-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: 'var(--gold)',
            }}>م</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>محمد المصمم</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>designer@example.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══ المحتوى الرئيسي ═════════════════════════════ */}
      <main style={{ flex: 1, overflow: 'auto' }}>

        {/* ترويسة الصفحة */}
        <div style={{
          padding: '28px 40px 24px', background: 'var(--white)',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div className="badge" style={{ marginBottom: 8 }}>لوحة التحكم</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.5px', fontFamily: 'var(--font-tajawal)' }}>
              طلباتك المالية
            </h1>
          </div>
          <Link href="/dashboard/new-order" className="btn-primary"
            style={{ padding: '10px 24px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            طلب جديد
          </Link>
        </div>

        {/* الإحصائيات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'var(--white)', borderBottom: '1px solid var(--line)' }}>
          {[
            { label: 'إجمالي الأرباح المحصّلة', value: formatAmount(totalEarned), sub: 'من الطلبات المكتملة',      color: '#1A6A40' },
            { label: 'طلبات نشطة الآن',         value: String(activeCount),       sub: 'قيد التنفيذ أو المراجعة',  color: 'var(--gold)' },
            { label: 'بانتظار التحصيل',          value: formatAmount(pendingPay),  sub: 'طلبات مدفوعة غير محوّلة', color: '#2A5A9A' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '28px 36px', borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text-3)', marginBottom: 12, textTransform: 'uppercase' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, letterSpacing: '-1px', marginBottom: 4, fontFamily: 'var(--font-tajawal)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* فلاتر */}
        <div style={{ padding: '20px 40px', background: 'var(--white)', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, marginLeft: 8 }}>تصفية:</span>
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: 'بانتظار الملف' },
            { key: 'revision_requested', label: 'طلبات تعديل' },
            { key: 'paid', label: 'مدفوعة' },
            { key: 'settled', label: 'مكتملة' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              borderColor: filter === f.key ? 'var(--gold-border)' : 'var(--line)',
              background: filter === f.key ? 'var(--gold-pale)' : 'transparent',
              color: filter === f.key ? 'var(--gold)' : 'var(--text-2)',
              transition: 'all 0.15s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* جدول الطلبات */}
        <div style={{ padding: '0 40px 48px' }}>
          {/* رأس الجدول */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 160px 120px 130px 110px 100px',
            padding: '12px 16px', borderBottom: '1px solid var(--line)', marginTop: 24,
          }}>
            {['المشروع', 'العميل', 'المبلغ', 'الحالة', 'التاريخ', ''].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>
                <ShieldIcon size={32} color="var(--gold-border)" />
              </div>
              لا توجد طلبات في هذا التصنيف
            </div>
          ) : (
            filtered.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META['draft']
              return (
                <div key={order.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 160px 120px 130px 110px 100px',
                  padding: '16px 16px', alignItems: 'center',
                  borderBottom: '1px solid var(--line)', transition: 'background 0.15s', cursor: 'pointer',
                  background: 'var(--white)', marginTop: 2, borderRadius: 4,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-pale)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>{order.project_title}</div>
                    {order.project_description && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
                        {order.project_description}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{order.client_name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{order.client_email}</div>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatAmount(order.designer_amount)}
                  </div>

                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                      color: meta.color, background: meta.bg,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />
                      {meta.label}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{formatDate(order.created_at)}</div>

                  <div>
                    <Link href={`/order/${order.id}`} style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--green)',
                      textDecoration: 'none', border: '1px solid var(--green-border)',
                      padding: '5px 12px', borderRadius: 4, display: 'inline-block',
                      transition: 'all 0.15s', background: 'transparent',
                    }}>
                      إدارة ←
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
