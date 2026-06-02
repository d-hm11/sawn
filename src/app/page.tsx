import Link from 'next/link'

/* ══ أيقونة الدرع SVG ══════════════════════════════════ */
function ShieldIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', color: 'var(--text)', direction: 'rtl' }}>

      {/* ══════════════════════════════════════════════════
          شريط التنقل
      ══════════════════════════════════════════════════ */}
      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '0 40px',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* الشعار */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldIcon size={28} color="var(--gold)" strokeWidth={1.8} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-tajawal)', fontWeight: 900, fontSize: 20, color: 'var(--green)', letterSpacing: '-0.3px' }}>صون</span>
              <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 600, fontSize: 15, color: 'var(--gold)', letterSpacing: '1px', fontStyle: 'italic' }}>Sawn</span>
            </div>
          </Link>

          {/* روابط */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {[{ label: 'كيف يعمل', href: '#how' }, { label: 'الحماية', href: '#protection' }, { label: 'التسعير', href: '#pricing' }].map(link => (
              <Link key={link.href} href={link.href} style={{ color: 'var(--text-2)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* أزرار */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/dashboard" className="btn-secondary" style={{ padding: '9px 22px', borderRadius: 6 }}>دخول</Link>
            <Link href="/dashboard/new-order" className="btn-primary" style={{ padding: '9px 22px', borderRadius: 6 }}>ابدأ الآن</Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          Hero
      ══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '96px 40px 80px', overflow: 'hidden' }}>
        {/* درع ضخم في الخلفية */}
        <div style={{ position: 'absolute', left: -60, top: -60, opacity: 0.025, pointerEvents: 'none' }}>
          <svg width="600" height="600" viewBox="0 0 24 24" fill="var(--green)">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
          </svg>
        </div>

        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: 760 }}>
            <div className="badge reveal d1" style={{ marginBottom: 28 }}>منصة الوساطة المالية الآمنة للمصممين</div>

            <h1 className="reveal d2" style={{
              fontSize: 'clamp(38px, 5.5vw, 64px)', fontWeight: 900, lineHeight: 1.18,
              letterSpacing: '-1.5px', color: 'var(--green)', marginBottom: 24,
              fontFamily: 'var(--font-tajawal)',
            }}>
              حقوق المصمم مصونة
              <br />
              <span style={{ color: 'var(--gold)' }}>وأمان العميل</span> مضمون
            </h1>

            <p className="reveal d3" style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.9, maxWidth: 560, marginBottom: 44, fontWeight: 400 }}>
              نظام وساطة يحتجز مدفوعات العملاء حتى تسليم الملفات الأصلية، ويحمي التصاميم من السرقة قبل الدفع بطبقتين من الحماية التقنية.
            </p>

            <div className="reveal d4" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard/new-order" className="btn-primary"
                style={{ padding: '14px 36px', borderRadius: 6, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldIcon size={18} color="#fff" strokeWidth={2} />
                إنشاء رابط معاينة آمن
              </Link>
              <Link href="#how" className="btn-secondary" style={{ padding: '14px 30px', borderRadius: 6, fontSize: 15 }}>
                تعرّف على الآلية
              </Link>
            </div>

            {/* إحصائيات */}
            <div className="reveal d4" style={{
              display: 'flex', gap: 0, marginTop: 72, paddingTop: 40,
              borderTop: '1px solid var(--line)', flexWrap: 'wrap',
            }}>
              {[
                { value: '٧٪ فقط', label: 'رسوم المنصة من كل صفقة ناجحة' },
                { value: 'فوري',    label: 'تسليم الملفات لحظة تأكيد الدفع' },
                { value: 'صفر',     label: 'نزاعات بفضل نظام المعاينة المسبقة' },
              ].map((s, i) => (
                <div key={s.label} style={{ paddingLeft: i > 0 ? 48 : 0, marginLeft: i > 0 ? 48 : 0, borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--gold)', marginBottom: 6, letterSpacing: '-0.5px' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 180 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ══════════════════════════════════════════════════
          كيف يعمل
      ══════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: '96px 40px', background: 'var(--off-white)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="badge" style={{ marginBottom: 16 }}>الآلية</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.8px', fontFamily: 'var(--font-tajawal)' }}>
                كيف تسير الصفقة؟
              </h2>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 360, lineHeight: 1.85, paddingTop: 10 }}>
              ثلاث مراحل مضبوطة تضمن حقوق الطرفين بالكامل دون الحاجة للوثوق العشوائي.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                num: '١', icon: '🎨', title: 'إعداد الطلب',
                items: ['المصمم يحدد سعره الصافي', 'يحدد عدد التعديلات المجانية', 'يرفع ملف المعاينة والأصلي', 'يُولَّد رابط معاينة آمن'],
                accent: 'var(--gold)',
              },
              {
                num: '٢', icon: '◉', title: 'المعاينة والتعديل',
                items: ['العميل يفتح الرابط المحمي', 'يرى التصميم بدقة منخفضة + علامة مائية', 'يطلب تعديلاته قبل الدفع', 'المصمم يرفع النسخة المعدّلة'],
                accent: 'var(--green-2)',
              },
              {
                num: '٣', icon: '✓', title: 'الدفع والتسليم',
                items: ['العميل يوافق ويدفع المبلغ', 'المنصة تحتجز المبلغ مؤقتاً', 'الملفات الأصلية تُفتح فوراً', 'المصمم يستلم حقه كاملاً'],
                accent: 'var(--green)',
              },
            ].map((step) => (
              <div key={step.num} className="card" style={{
                borderRadius: 10, padding: '36px 32px',
                borderTop: `3px solid ${step.accent}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: -10, left: 20, fontSize: 120, fontWeight: 900,
                  color: 'var(--green)', opacity: 0.03, lineHeight: 1,
                  fontFamily: 'var(--font-playfair)', pointerEvents: 'none',
                }}>{step.num}</div>

                <div style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: 'var(--gold-pale)', border: '1px solid var(--gold-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 20,
                }}>{step.icon}</div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', marginBottom: 20, letterSpacing: '-0.3px', fontFamily: 'var(--font-tajawal)' }}>
                  {step.title}
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {step.items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                      <span style={{ marginTop: 1, flexShrink: 0 }}><CheckIcon /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════════════════════════════════════════
          الحماية
      ══════════════════════════════════════════════════ */}
      <section id="protection" style={{ padding: '96px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* النص */}
            <div>
              <div className="badge" style={{ marginBottom: 20 }}>الحماية التقنية</div>
              <h2 style={{
                fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, color: 'var(--green)',
                letterSpacing: '-0.8px', marginBottom: 20, fontFamily: 'var(--font-tajawal)', lineHeight: 1.3,
              }}>
                التصميم محمي<br />
                <span style={{ color: 'var(--gold)' }}>قبل الدفع بطبقتين</span>
              </h2>
              <p style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.9, marginBottom: 36 }}>
                نجمع بين الحماية البصرية والقانونية لضمان أن تصميمك لن يُستخدم دون إذن، وأن العميل لن يخسر مالاً مقابل شيء لم يقبله.
              </p>

              {[
                { title: 'علامة مائية ديناميكية', desc: 'كل مشاهدة تولّد علامة مائية بـ IP وبريد الزائر — رادع قانوني وتقني.', tag: 'ردع' },
                { title: 'جودة 72dpi فقط',        desc: 'الملف المعروض غير صالح للاستخدام التجاري. الأصلي يُسلَّم بعد الدفع.',  tag: 'تقني' },
                { title: 'تعديل قبل الدفع',        desc: 'العميل يراجع ويطلب تعديلاته قبل أي التزام. الدفع = موافقة نهائية.',   tag: 'صفر نزاعات' },
              ].map(f => (
                <div key={f.title} style={{
                  display: 'flex', gap: 16, marginBottom: 16, padding: '16px 20px',
                  background: 'var(--off-white)', borderRadius: 8, border: '1px solid var(--line)',
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <ShieldIcon size={20} color="var(--gold)" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>{f.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'var(--gold)', border: '1px solid var(--gold-border)', padding: '2px 8px', borderRadius: 3 }}>{f.tag}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* بطاقة بصرية */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'var(--green)', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,48,32,0.2)', aspectRatio: '4/3',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* درع خلفي */}
                <div style={{ opacity: 0.06, position: 'absolute' }}>
                  <svg width="300" height="300" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
                  </svg>
                </div>

                {/* نص المعاينة */}
                <div style={{ textAlign: 'center', opacity: 0.4, position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: 'var(--gold)', fontFamily: 'var(--font-playfair)', letterSpacing: -2, marginBottom: 8 }}>صون</div>
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: 8, fontFamily: 'var(--font-playfair)' }}>S A W N</div>
                </div>

                {/* علامة مائية */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute', top: `${(i % 3) * 36}%`, right: `${Math.floor(i / 3) * 36}%`,
                      transform: 'rotate(-30deg)', fontSize: 9,
                      color: 'rgba(255,255,255,0.10)', fontFamily: 'monospace', whiteSpace: 'nowrap', lineHeight: 1.9,
                    }}>
                      <div>IP: 91.97.20.100</div>
                      <div>ahmed@client.com</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  position: 'absolute', bottom: 0, right: 0, left: 0, padding: '10px 16px',
                  background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>preview · 72dpi · watermarked</span>
                  <span style={{ fontSize: 9, color: 'rgba(176,144,80,0.6)', fontFamily: 'monospace' }}>صون ©</span>
                </div>
              </div>

              {/* بطاقة طافية */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'var(--white)', borderRadius: 10, border: '1px solid var(--line)',
                padding: '14px 18px', boxShadow: '0 8px 24px rgba(0,48,32,0.1)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(26,140,80,0.1)', border: '1px solid rgba(26,140,80,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: '#1A8C50',
                }}>✓</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>تم الدفع بنجاح</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>الملفات الأصلية متاحة الآن</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ══════════════════════════════════════════════════
          التسعير
      ══════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '96px 40px', background: 'var(--off-white)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ justifyContent: 'center', marginBottom: 16 }}>التسعير</div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 900, color: 'var(--green)', letterSpacing: '-0.8px', fontFamily: 'var(--font-tajawal)' }}>
              رسوم واضحة، بلا مفاجآت
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>
              لا رسوم تسجيل، لا اشتراك شهري. تُدفع الرسوم فقط عند إتمام صفقة ناجحة.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* مثال توضيحي */}
            <div className="card" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ padding: '20px 28px', background: 'var(--green)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>مثال توضيحي</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--white)' }}>صفقة بقيمة ١٬٠٠٠ ر.س</div>
              </div>
              <div style={{ padding: '8px 28px 24px' }}>
                {[
                  { label: 'المبلغ المتفق عليه مع العميل', value: '١٬٠٠٠ ر.س', muted: false },
                  { label: 'رسوم المنصة (٧٪ على العميل)',  value: '+٧٠ ر.س',    muted: true },
                  { label: 'إجمالي ما يدفعه العميل',       value: '١٬٠٧٠ ر.س',  muted: false },
                  { label: 'ما تستلمه صافياً',              value: '١٬٠٠٠ ر.س',  highlight: true },
                ].map((row) => (
                  <div key={row.label} className="pricing-row" style={{ color: (row as any).highlight ? 'var(--green)' : (row as any).muted ? 'var(--text-3)' : 'var(--text)' }}>
                    <span style={{ fontSize: 13.5 }}>{row.label}</span>
                    <span style={{ fontWeight: (row as any).highlight ? 900 : 600, fontSize: (row as any).highlight ? 18 : 14, color: (row as any).highlight ? 'var(--gold)' : 'inherit', fontVariantNumeric: 'tabular-nums' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <Link href="/dashboard/new-order" className="btn-primary"
                  style={{ display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 6, marginTop: 20, fontSize: 14 }}>
                  ابدأ أول مشروع مجاناً
                </Link>
              </div>
            </div>

            {/* ما تحصل عليه */}
            <div className="card" style={{ borderRadius: 12, padding: '28px', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-3)', marginBottom: 20, textTransform: 'uppercase' }}>ما تحصل عليه</div>
              {[
                { text: 'علامة مائية ديناميكية بـ IP', included: true },
                { text: 'معاينة بدقة منخفضة (72dpi)', included: true },
                { text: 'تعديلات مجانية قبل الدفع', included: true },
                { text: 'دفع عبر Moyasar (mada، Apple Pay، STC)', included: true },
                { text: 'تسليم فوري بعد الدفع', included: true },
                { text: 'بريد إلكتروني تأكيدي للطرفين', included: true },
                { text: 'سجل وصول وتدقيق كامل', included: true },
                { text: 'رسوم تسجيل أو اشتراك شهري', included: false },
              ].map((row, i) => (
                <div key={row.text} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: i < 7 ? '1px solid var(--line)' : 'none',
                }}>
                  <span style={{ fontSize: 13.5, color: row.included ? 'var(--text)' : 'var(--text-3)' }}>{row.text}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: row.included ? '#1A8C50' : '#CC4444' }}>
                    {row.included ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══════════════════════════════════════════════════
          اقتباس
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <ShieldIcon size={40} color="var(--gold)" strokeWidth={1.2} />
          </div>
          <blockquote style={{
            fontFamily: 'var(--font-playfair)', fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontStyle: 'italic', color: 'var(--green)', lineHeight: 1.8, fontWeight: 400, marginBottom: 24,
          }}>
            "الهيبة والرسمية في تعاملات التصميم لا تأتي من الكلام، بل تأتي من نظام واضح يحمي الطرفين ويُسلِّم الحقوق في وقتها."
          </blockquote>
          <div style={{ width: 40, height: 1, background: 'var(--gold-border)', margin: '0 auto' }} />
        </div>
      </section>

      <div className="divider-gold" />

      {/* ══════════════════════════════════════════════════
          CTA نهائي
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 40px', background: 'var(--green)' }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32,
        }}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <ShieldIcon size={32} color="rgba(176,144,80,0.8)" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: 10, fontFamily: 'var(--font-tajawal)' }}>
              جاهز لتأمين مشروعك القادم؟
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>أنشئ رابط معاينة آمن في أقل من دقيقتين.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/dashboard/new-order" className="btn-primary"
              style={{ padding: '14px 36px', borderRadius: 6, fontSize: 15, fontWeight: 800 }}>
              إنشاء طلب جديد ←
            </Link>
            <Link href="#how" style={{
              padding: '14px 28px', borderRadius: 6, fontSize: 15, fontWeight: 600,
              border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
            }}>
              مزيد من التفاصيل
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          الفوتر
      ══════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 40px', background: 'var(--white)' }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldIcon size={22} color="var(--gold)" strokeWidth={1.8} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--green)' }}>صون</span>
              <span style={{ fontFamily: 'var(--font-playfair)', fontWeight: 600, fontSize: 13, color: 'var(--gold)', fontStyle: 'italic' }}>Sawn</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-3)', marginRight: 8 }}>منصة الوساطة المالية للمصممين</span>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['سياسة الخصوصية', 'الشروط والأحكام'].map(l => (
              <span key={l} style={{ color: 'var(--text-3)', fontSize: 12, cursor: 'pointer' }}>{l}</span>
            ))}
            <span style={{ color: 'var(--text-3)', fontSize: 12 }}>© ٢٠٢٦ صون</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
