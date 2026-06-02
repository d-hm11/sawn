import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      designer_id, client_email, client_name, project_title,
      project_description, designer_amount, platform_fee_pct = 7,
      max_free_revisions = 2, extra_revision_price,
    } = body

    if (!designer_id || !client_email || !project_title || !designer_amount) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })
    }
    if (designer_amount < 50) {
      return NextResponse.json({ error: 'الحد الأدنى للمشروع 50 ريال' }, { status: 400 })
    }

    const { data: order, error } = await adminClient
      .from('orders')
      .insert({
        designer_id, client_email, client_name: client_name || null,
        project_title, project_description: project_description || null,
        designer_amount, platform_fee_pct, max_free_revisions,
        extra_revision_price: extra_revision_price || null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ order }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: err.message ?? 'خطأ في الخادم' }, { status: 500 })
  }
}
