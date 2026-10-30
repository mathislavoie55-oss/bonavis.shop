import { supabase } from './supabase'

export type Link = {
  id: string
  code: string
  google_review_url: string
  business_name: string | null
  is_active: boolean
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as Link
}

export async function logTap(code: string, userAgent: string) {
  await supabase.from('taps').insert({
    link_code: code,
    user_agent: userAgent,
  })
}
