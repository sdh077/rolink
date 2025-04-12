'use client'
import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { IApply } from '@/interface/apply'


export function AddApply({ disabled, year, month, apply }: { disabled: boolean; year: number, month: number, apply: IApply | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [on, setOn] = useState(false)
  const [bean, setBean] = useState<number | ''>(apply?.bean ?? 0)
  const [open, setOpen] = useState(false)
  const cancelBean = async () => {
    const { error } = await supabase.from('apply_bean')
      .delete()
      .eq('month', month)
      .eq('year', year)
    if (error) toast('취소에 실패하였습니다.', {
      description: error.message,
    })
    else toast('취소 되었습니다.',)
    setOn(false)
    setOpen(false)
    router.refresh()
  }
  const submit = async () => {
    if (on) return
    setOn(true)
    try {
      if (apply) {
        const { error } = await supabase.from('apply_bean')
          .update({ bean })
          .eq('id', apply.id)
        if (error) toast('수정에 실패하였습니다.', {
          description: error.message,
        })
        else toast('수정 완료했습니다.',)
      }
      const { data: user } = await supabase.auth.getUser()
      const { error } = await supabase.from('apply_bean')
        .insert({ year, month, bean, user_id: user.user?.id })
      if (error) toast('생성에 실패하였습니다.', {
        description: error.message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
      else toast('신청 완료했습니다.',)
    } finally {
      setOn(false)
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">{apply ? '수정하기' : '신청하기'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{year}년 {month}월 원두 신청</DialogTitle>
          <DialogDescription>
            필요한 원두의 양을 입력해주세요
          </DialogDescription>
          <Label htmlFor='bean' >기부 원두(KG)</Label>
          <Input id='bean' type='number' value={bean} onChange={e => setBean(e.target.value === '' ? '' : Number(e.target.value))} />

          {/* <Label htmlFor='bean' >원두 설명</Label>
          <Input id='bean' value={bean} onChange={e => setBean(e.target.value === '' ? '' : Number(e.target.value))} /> */}
        </DialogHeader>
        <DialogFooter>
          <Button disabled={on} onClick={submit}>신청하기</Button>
          {apply && <Button disabled={on} onClick={cancelBean}>신청취소하기</Button>}
          <Button variant="outline" onClick={() => setOpen(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}
