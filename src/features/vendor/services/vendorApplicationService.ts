
import { supabase } from '../../../lib/supabase'
import type {
  VendorApplication,
  VendorApplicationFormData,
} from '../types/vendorApplication'


export async function getVendorApplicationData(userId: string) {
  const profileResult = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (profileResult.error) {
    console.error('PROFILE QUERY ERROR:', profileResult.error)
    throw new Error(
      `Profile query failed: ${profileResult.error.message}`,
    )
  }

  const applicationResult = await supabase
    .from('vendor_applications')
    .select('*')
    .eq('applicant_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (applicationResult.error) {
    console.error('APPLICATION QUERY ERROR:', applicationResult.error)
    throw new Error(
      `Application query failed: ${applicationResult.error.message}`,
    )
  }

  return {
    role: profileResult.data.role as string,
    application: applicationResult.data as VendorApplication | null,
  }
}


export async function submitVendorApplication(
  userId: string,
  formData: VendorApplicationFormData,
) {
  const { data, error } = await supabase
    .from('vendor_applications')
    .insert({
      applicant_id: userId,
      business_name: formData.business_name.trim(),
      contact_phone: formData.contact_phone.trim(),
      business_address: formData.business_address.trim(),
      business_description:
        formData.business_description.trim() || null,
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error(
        'You already have a pending vendor application.',
      )
    }

    throw error
  }

  return data as VendorApplication
}
