import { IDonation } from '@/interface/apply'
import { createClient } from '@/utils/supabase/server'
import React from 'react'

const getDonations = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_donation')
    .select('*, apply_bean(*, user(*)), user(*)')
    .eq('cafe_id', user.user?.id)
    .overrideTypes<IDonation[]>()
}
const Donation = async () => {
  const { data: donations } = await getDonations()
  return (
    <div>
      {donations?.map(donation =>
        <div key={donation.id}>{donation.user.name} {donation.bean} {donation.apply_bean.user.name}</div>
      )}
    </div>
  )
}

export default Donation