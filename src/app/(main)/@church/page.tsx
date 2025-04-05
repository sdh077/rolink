import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { AddApply } from './church'
import { IUser } from '@/interface/user'
import { IApply } from '@/interface/apply'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { InquiryPop } from './inquiry-pop'
type ApplyObj = { [x: string]: IApply }

const getApply = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_bean')
    .select('*, apply_donation(*, user(*))')
    .eq('user_id', user.user?.id)
    .overrideTypes<IApply[]>()
}
export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  const { data: user } = await supabase.from('user').select('*').eq('id', data.user?.id).single<IUser>()
  if (!user) {
    redirect('/login')
  }
  const today = new Date()
  const { data: applys } = await getApply()
  const obj = applys?.reduce((pre, apply) => {
    pre[`${apply.year}-${apply.month}`] = apply;
    return pre;
  }, {} as ApplyObj) ?? {}
  const theadClass = 'p-1 md:py-3 md:px-4 text-center text-gray-500 text-normal'
  const tbodyClass = 'p-1 md:py-4 md:px-4 text-center text-gray-800 text-normal'
  const currentMonth = today.getMonth() + 1

  return (
    <div className="container mx-auto my-3 md:py-5 bg-white rounded-xl">
      <p className='text-primary text-lg'>2025년</p>
      <Table className='w-full'>
        <TableHeader className='border-b'>
          <TableRow>
            <TableHead className={theadClass}>월</TableHead>
            <TableHead className={theadClass}>원두 신청/수정</TableHead>
            <TableHead className={theadClass}>신청 중량 (kg)</TableHead>
            <TableHead className={theadClass}>기부 카페</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
            <TableRow key={month} className={month < currentMonth ? 'bg-gray-300' : 'hover:bg-yellow-100'}>
              <TableCell className={tbodyClass + ' w-32'}>{month}월</TableCell>
              <TableCell className={tbodyClass + ' w-80'}><AddApply disabled={month < currentMonth} year={2025} month={month} apply={obj[`${2025}-${month}`]} /></TableCell>
              <TableCell className={tbodyClass + ' w-60'}>{obj[`${2025}-${month}`]?.bean}</TableCell>
              <TableCell className={tbodyClass + ' flex flex-col md:flex-row gap-5 items-center'}>
                {obj[`${2025}-${month}`]?.apply_donation.map(e =>
                  <InquiryPop key={`${month}=${e.id}`} cafeId={e.cafe_id} cafeName={e.user.name}>
                    <button className="bg-yellow-800 rounded-sm px-2.5 py-1 tracking-tight text-normal text-white">{e.user.name} {e.bean}kg</button>
                  </InquiryPop>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
