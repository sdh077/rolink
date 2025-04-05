import { IInquiryCustom } from '@/interface/inquiry'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import React from 'react'

const getInquiry = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('inquiry')
    .select('*, cafe:user!cafe_id(*), church:user!church_id(*)')
    .eq('church_id', user.user?.id)
    .is('parent', null)
    .overrideTypes<IInquiryCustom[]>()
}

const Page = async () => {
  const { data: inquiries } = await getInquiry()
  return (
    <div className='container'>
      <div className='flex flex-col'>
        {inquiries?.map(inquiry =>
          <Link href={`/inquiry/${inquiry.id}`} key={inquiry.id}>{inquiry.id} {inquiry.content} {inquiry.created_at.slice(0, 10)}</Link>
        )}
      </div>
    </div>
  )
}

export default Page