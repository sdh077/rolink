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
    <div className='grid md:grid-cols-3 w-full gap-16'>
      {donations?.map(donation =>
        <div key={donation.id}>
          <div className='flex justify-between'>
            <div>
              날짜
            </div>
            <div>
              {donation.apply_bean.year}-{donation.apply_bean.month}
            </div>
          </div>
          <div className='flex justify-between'>
            <div>
              기부 대상
            </div>
            <div>
              {donation.apply_bean.user.name}
            </div>
          </div>

          <div className='flex justify-between'>
            <div>
              기부 커피
            </div>
            <div>
              {donation.bean}kg
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Donation