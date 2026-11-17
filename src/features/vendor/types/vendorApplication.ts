
export type VendorApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export interface VendorApplication {
  id: string
  applicant_id: string
  business_name: string
  contact_phone: string
  business_address: string
  business_description: string | null
  status: VendorApplicationStatus
  rejection_reason: string | null
  created_at: string
}

export interface VendorApplicationFormData {
  business_name: string
  contact_phone: string
  business_address: string
  business_description: string
}
