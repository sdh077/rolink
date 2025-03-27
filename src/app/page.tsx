import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AddApply } from './church'
import { IChurch, IUser } from '@/interface/user'
import { IApply } from '@/interface/apply'
import SignOut from '@/components/sign-out'
import CafeTable from './cafe'


const getChurches = async (month: string | undefined) => {
  const supabase = await createClient()
  const today = new Date()
  return await supabase.from('user')
    .select('*, apply_bean(*, apply_donation(*, user(*)))')
    .eq('type', 'church')
    .eq('apply_bean.month', month ?? today.getMonth() + 1)
    .overrideTypes<IChurch[]>()
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
          <div key={month}>
            <div className='flex flex-col justify-center text-center w-64 h-32 border-2'>
              <div>{`${month}월`} <AddApply year={2025} month={month} apply={obj[`${2025}-${month}`]} /></div>
              <div>
                {obj[`${2025}-${month}`]?.bean}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Cafe = async ({ month }: { month: string | undefined }) => {
  const { data: churches } = await getChurches(month)
  console.log(churches[0].apply_bean[0])
  if (!churches) return <></>
  return (
    <CafeTable churches={churches} />
  )
}