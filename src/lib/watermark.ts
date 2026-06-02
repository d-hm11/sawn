import sharp from 'sharp'

interface WatermarkOptions {
  ip: string
  email?: string
  timestamp: Date
  opacity?: number
}

function buildWatermarkSVG(opts: WatermarkOptions): Buffer {
  const { ip, email, timestamp, opacity = 0.18 } = opts
  const timeStr  = timestamp.toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })
  const emailStr = email ?? 'غير مسجل'
  const lines    = [`IP: ${ip}`, emailStr, timeStr]
  const groups: string[] = []

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const x = col * 300 - 100
      const y = row * 180 - 50
      groups.push(`
        <g transform="translate(${x},${y}) rotate(-30)">
          ${lines.map((line, i) => `
            <text x="0" y="${i * 28}"
              font-family="monospace" font-size="14"
              fill="white" fill-opacity="${opacity}"
              font-weight="600" letter-spacing="0.5"
            >${escapeXml(line)}</text>
          `).join('')}
        </g>`)
    }
  }

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1800">
      <rect width="1800" height="1800" fill="transparent"/>
      ${groups.join('')}
    </svg>`
  )
}

function escapeXml(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

export async function applyWatermark(imageBuffer: Buffer, opts: WatermarkOptions): Promise<Buffer> {
  const watermarkSvg = buildWatermarkSVG(opts)
  const meta = await sharp(imageBuffer).metadata()
  const w = meta.width  ?? 1200
  const h = meta.height ?? 800

  const resizedWatermark = await sharp(watermarkSvg)
    .resize(w, h, { fit: 'fill' })
    .png()
    .toBuffer()

  return sharp(imageBuffer)
    .composite([{ input: resizedWatermark, blend: 'over', gravity: 'northwest' }])
    .modulate({ brightness: 0.92 })
    .jpeg({ quality: 72 })
    .toBuffer()
}
