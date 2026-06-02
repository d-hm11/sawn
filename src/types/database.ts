export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'revision_requested'
  | 'extra_revision_pending_payment'
  | 'extra_revision_paid'
  | 'revision_in_progress'
  | 'paid'
  | 'delivered'
  | 'settled'
  | 'expired'

export interface Order {
  id: string
  designer_id: string
  client_email: string
  client_name: string | null
  project_title: string
  project_description: string | null
  designer_amount: number
  platform_fee_pct: number
  client_amount: number
  max_free_revisions: number
  used_free_revisions: number
  extra_revision_price: number | null
  extra_revision_client_amount: number | null
  status: OrderStatus
  preview_token: string
  download_token: string | null
  payment_id: string | null
  paid_at: string | null
  settled_at: string | null
  created_at: string
  updated_at: string
  expires_at: string
}

export interface OrderFile {
  id: string
  order_id: string
  version_number: number
  is_current: boolean
  preview_storage_path: string
  original_storage_path: string
  uploaded_by: string
  designer_note: string | null
  uploaded_at: string
}

export interface Revision {
  id: string
  order_id: string
  revision_number: number
  is_paid: boolean
  client_notes: string
  client_ip: string | null
  client_email: string | null
  response_file_id: string | null
  responded_at: string | null
  requested_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'designer' | 'client'
  bank_iban: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
}
