import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AddApply } from './church'
import { IUser } from '@/interface/user'
import { IApply, IDonation } from '@/interface/apply'
import SignOut from '@/components/sign-out'
import CafeTable from './cafe'


const getChurchApply = async (month: string | undefined) => {
  const supabase = await createClient()
  const today = new Date()
  return await supabase.from('apply_bean')
    .select('*, user(*), apply_donation(*, user(*))')
    .eq('month', month ?? today.getMonth() + 1)
    .overrideTypes<IApply[]>()
}

const getDonations = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_donation')
    .select('*, apply_bean(*, user(*)), user(*)')
    .eq('cafe_id', user.user?.id)
    .overrideTypes<IDonation[]>()
}

const getApply = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_bean')
    .select('*').eq('user_id', user.user?.id)
    .overrideTypes<IApply[]>()
}
export default async function PrivatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const month = (await searchParams).month as string

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  const { data: user } = await supabase.from('user').select('*').eq('id', data.user?.id).single<IUser>()
  if (!user) {
    redirect('/login')
  }
  return (
    <div className='mx-auto w-full container'>{user.name}
      <div>
        {user.type === 'church' && <Church />}
        {user.type === 'cafe' && <Cafe month={month} />}
      </div>
    </div>)
}
type ApplyObj = { [x: string]: IApply }
const Church = async () => {
  const { data: applys } = await getApply()
  const obj = applys?.reduce((pre, apply) => {
    pre[`${apply.year}-${apply.month}`] = apply;
    return pre;
  }, {} as ApplyObj) ?? {}

  return (
    <div>
      <div className='flex justify-between'>
        <div>2025년</div>
        <SignOut />
      </div>
      <div className='grid grid-cols-2 gap-4 '>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
          <div key={month} className='flex gap-4'>
            <div className='flex flex-col justify-center text-center w-64 h-32 border-2'>
              <div>{`${month}월`} <AddApply year={2025} month={month} apply={obj[`${2025}-${month}`]} /></div>
              <div>
                {obj[`${2025}-${month}`]?.bean}KG 신청
              </div>
            </div>
            <div>파브스 3키로</div>
            <div>링크트 3키로</div>
          </div>
        )}
      </div>
    </div>
  )
}

const Cafe = async ({ month }: { month: string | undefined }) => {
  const { data: applies } = await getChurchApply(month)
  const { data: donations } = await getDonations()
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!applies || !donations) return <></>
  return (
    <div>
      <SignOut />
      <CafeTable applies={applies} donations={donations} user={user.user!} />
    </div>
  )
}