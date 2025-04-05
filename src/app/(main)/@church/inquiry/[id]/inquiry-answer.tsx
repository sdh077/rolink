'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { IInquiryCustom } from '@/interface/inquiry'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const InquiryAnswer = ({ inquiry }: { inquiry: IInquiryCustom }) => {
  const [content, setContent] = useState('')
  const router = useRouter()
  const writeAnswer = async () => {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    const { error } = await supabase.from('inquiry')
      .insert({
        content,
        church_id: user.user?.id,
        cafe_id: inquiry.cafe?.id,
        user_id: user.user?.id,
        parent: inquiry.id
      })
    if (error) toast('생성에 실패하였습니다.', {
      description: error.message,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    else {
      toast('신청 완료했습니다.',)
    }
    router.refresh()
  }
  return (
    <div>
      <Textarea value={content} onChange={e => setContent(e.target.value)} />
      <Button onClick={writeAnswer}>제출</Button>
    </div>
  )
}

export default InquiryAnswer