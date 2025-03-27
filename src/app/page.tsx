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
    <div className='mx-auto w-screen'>
      <div>
        {user.type === 'church' && <Church username={user.name} />}
        {user.type === 'cafe' && <Cafe month={month} />}
      </div>
    </div>)
}
type ApplyObj = { [x: string]: IApply }
const Church = async ({ username }: { username: string | undefined }) => {
  const { data: applys } = await getApply()
  const obj = applys?.reduce((pre, apply) => {
    pre[`${apply.year}-${apply.month}`] = apply;
    return pre;
  }, {} as ApplyObj) ?? {}
  const theadClass='py-3 px-4 text-center text-gray-500 text-normal'
  const tbodyClass='py-4 px-4 text-center text-gray-800 text-normal'
  const currentMonth=3
  const sampleDonation= [
    {
      cafe: '파브스',
      value: 3
    },
    {
      cafe: '링크트',
      value: 4
    }
  ] 

  return (
    <div className='bg-slate-100 min-h-screen h-full'>
      {/* top nav bar design */}
      <div className='h-[70px] bg-yellow-900 flex'>
        <div className='container mx-auto flex items-center justify-center'>
          <div className="flex container justify-between items-center">
            <div>
              <p className="text-2xl text-gray-100 font-medium tracking-tight">신대호의 커피가게(임시)</p>
            </div>
            <div className='flex items-center gap-5'>
              <p className='text-gray-100 text-lg'>2025년</p>
              <p className="text-gray-100"><span className="text-lg font-medium">{username}</span><span className="text-sm">님</span></p>
              <SignOut />
            </div>
          </div>
        </div>
      </div>

    <div className='py-10'>
    <div className="container mx-auto p-5 bg-white rounded-xl">
        <table className='w-full'>
          <thead className='border-b'>
            <tr>
              <td className={theadClass}>월</td>
              <td className={theadClass}>원두 신청/수정</td>
              <td className={theadClass}>신청 중량 (kg)</td>
              <td className={theadClass}>달성률</td>
              <td className={theadClass}>기부 카페</td>
            </tr>
          </thead>
          <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => 
            <tr className={ month < currentMonth ? 'bg-gray-300' : 'hover:bg-yellow-100' }>
              <td className={tbodyClass+' w-32'}>{month}월</td>
              <td className={tbodyClass+' w-60'}><AddApply year={2025} month={month} apply={obj[`${2025}-${month}`]} /></td>
              <td className={tbodyClass+' w-40'}>{obj[`${2025}-${month}`]?.bean}</td>
              <td className={tbodyClass+' w-40'}>-</td>
              <td className={tbodyClass+' flex gap-5 items-center'}>
                {sampleDonation.map(e => 
                  <div className="bg-yellow-900 rounded-xl px-2.5 py-1 tracking-tight text-normal text-white">{e.cafe} {e.value}kg</div>
                )}
              </td>
            </tr>
          )}
          </tbody>
        </table>
        {/* <div className='grid grid-cols-2 gap-4 '>
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
        </div> */}
      </div>
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