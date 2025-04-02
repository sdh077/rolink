import { IDonationInfo } from '@/interface/user'
import { createClient } from '@/utils/supabase/server'
import React from 'react'
import EditForm from './edit-form'
const getInfo = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('donation_info')
    .select('*')
    .eq('user_id', user.user?.id)
    .single<IDonationInfo>()
}
const page = async () => {
  const { data: info } = await getInfo()
  if (!info) return <div>잘못된 접근입니다.</div>
  return (
    <div><EditForm info={info} /></div>
  )
}

export default page