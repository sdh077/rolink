import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { IUser } from '@/interface/user'
import { IApply } from '@/interface/apply'
import CafeTable from './cafe'


const getChurchApply = async (month: string | undefined) => {
  const supabase = await createClient()
  const today = new Date()
  return await supabase.from('apply_bean')
    .select('*, user(*), apply_donation(*, user(*))')
    .eq('month', month ?? today.getMonth() + 1)
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
  const { data: applies } = await getChurchApply(month)
  if (!applies) return <></>
  return (
    <div>
      <CafeTable applies={applies} user={user} />
    </div>
  )
}
