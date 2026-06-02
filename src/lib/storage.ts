import { adminClient } from '@/lib/supabase/admin'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export interface UploadResult {
  previewPath: string
  originalPath: string
  previewPublicUrl: string
}

export async function processAndUploadFiles(
  orderId: string,
  versionNumber: number,
  previewFile: Buffer,
  originalFile: Buffer,
  originalMimeType: string
): Promise<UploadResult> {
  const fileId = uuidv4()

  const lowResBuffer = await sharp(previewFile)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 65 })
    .withMetadata({ density: 72 })
    .toBuffer()

  const previewPath  = `orders/${orderId}/v${versionNumber}_preview_${fileId}.jpg`
  const originalExt  = getExtension(originalMimeType)
  const originalPath = `orders/${orderId}/v${versionNumber}_original_${fileId}.${originalExt}`

  const { error: previewError } = await adminClient.storage
    .from('previews')
    .upload(previewPath, lowResBuffer, { contentType: 'image/jpeg', upsert: false })

  if (previewError) throw new Error(`فشل رفع المعاينة: ${previewError.message}`)

  const { error: originalError } = await adminClient.storage
    .from('originals')
    .upload(originalPath, originalFile, { contentType: originalMimeType, upsert: false })

  if (originalError) {
    await adminClient.storage.from('previews').remove([previewPath])
    throw new Error(`فشل رفع الملف الأصلي: ${originalError.message}`)
  }

  const { data: urlData } = adminClient.storage.from('previews').getPublicUrl(previewPath)

  return { previewPath, originalPath, previewPublicUrl: urlData.publicUrl }
}

export async function generateDownloadSignedUrl(
  originalPath: string,
  expiresInSeconds = 300
): Promise<string> {
  const { data, error } = await adminClient.storage
    .from('originals')
    .createSignedUrl(originalPath, expiresInSeconds)

  if (error || !data) throw new Error('فشل توليد رابط التحميل')
  return data.signedUrl
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
    'application/pdf': 'pdf', 'application/zip': 'zip',
    'application/x-zip-compressed': 'zip', 'image/svg+xml': 'svg',
  }
  return map[mimeType] ?? 'bin'
}
