import crypto from 'crypto'

const MOYASAR_BASE = 'https://api.moyasar.com/v1'
const SECRET_KEY   = process.env.MOYASAR_SECRET_KEY!

function authHeader() {
  return `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`
}

export function toHalalah(riyals: number): number {
  return Math.round(riyals * 100)
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function getMoyasarPayment(paymentId: string) {
  const res = await fetch(`${MOYASAR_BASE}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) throw new Error('فشل جلب بيانات الدفع')
  return res.json()
}
