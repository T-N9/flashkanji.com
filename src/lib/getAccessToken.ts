// lib/getAccessToken.ts
import { supabase } from './supabaseClient'

export const getAccessToken = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return null
  return data.session.access_token
}
