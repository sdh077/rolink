'use client'
import { createClient } from '@/utils/supabase/client'

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/auth/signin'
}

