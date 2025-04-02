import { Button } from '@/components/ui/button'
import { IDonation } from '@/interface/apply'
import { IDonationInfo } from '@/interface/user'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import React from 'react'

const getInfo = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('donation_info')
    .select('*')
    .eq('user_id', user.user?.id)
    .single<IDonationInfo>()
}

const getDonations = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_donation')
    .select('*, apply_bean(*, user(*)), user(*)')
    .eq('cafe_id', user.user?.id)
    .overrideTypes<IDonation[]>()
}
const Setting = async () => {
  const { data: info } = await getInfo()
  const { data: donations } = await getDonations()
  const total = donations?.reduce((prev, donation) => prev + donation.apply_bean.bean, 0)
  return (
    <div>
      {info ?
        <div>
          <Link href={'/setting/edit'}>
            <Button>기부금 정보 수정</Button>
          </Link>
          <h2>기부금 영수증 정보</h2>
          <div className='grid grid-cols-2'>
            <div>이름</div>
            <div>{info.name}</div>
            <div>주민등록 번호</div>
            <div>{info.identity_number}</div>
            <div>주소</div>
            <div>{info.address.join(' ')}</div>
            <div>액수</div>
            <div>{total}kg</div>
          </div>
        </div>
        :
        <div>
          <Link href={'/setting/create'}>
            <Button>기부금 정보 생성</Button>
          </Link>
        </div>
      }
    </div>
  )
}

export default Setting