import type { Metadata } from 'next'
import { Tajawal, Playfair_Display } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'صون — منصة الوساطة الآمنة للمصممين والعملاء',
  description: 'منصة وساطة مالية آمنة تحمي المصممين من سرقة أعمالهم وتضمن للعملاء استلام ملفاتهم الأصلية فور الدفع',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: 'var(--font-tajawal), Tajawal, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
