'use client'

import { Button } from '@/components/ui/button'
import { useRouterPush } from '@/hooks/use-create-query-string'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { useRouter, useSearchParams } from 'next/navigation'
import { IApply, IDonation } from "@/interface/apply"
import { IUser } from "@/interface/user"
import dayjs from 'dayjs'

export function CancelDonation({ donation }: { donation: IDonation }) {
  const [on, setOn] = useState(false)
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const cancel = async () => {
    if (on) return
    setOn(true)
    try {
      const { error } = await supabase.from('apply_donation')
        .delete()
        .eq('id', donation.id)
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
        <Button variant="outline" className='bg-primary-600 hover:bg-primary-900 w-full cursor-pointer rounded-md py-1.5 transition-all text-white hover:text-white'>취소하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>원두 기부하기</DialogTitle>
          <DialogDescription>
            필요한 원두의 양을 입력해주세요
          </DialogDescription>
          <Label htmlFor='bean' >필요 원두(KG)</Label>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={on} onClick={cancel}>취소하기</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DoDonation({ apply }: { apply: IApply; }) {
  const supabase = createClient()
  const router = useRouter()
  const [on, setOn] = useState(false)
  const [bean, setBean] = useState<number | ''>(0)
  const [memo, setMemo] = useState<string>('')
  const [open, setOpen] = useState(false)
  const submit = async () => {
    if (on) return
    setOn(true)
    try {
      const { data: user } = await supabase.auth.getUser()
      const { error } = await supabase.from('apply_donation')
        .insert({ cafe_id: user.user?.id, apply_bean_id: apply.id, bean, church_id: apply.church.id })
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
        <Button variant="outline" className='bg-primary-200 hover:bg-primary-900 w-full cursor-pointer rounded-md py-1.5 text-black transition-all hover:text-white'>원두 기부하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>원두 기부하기</DialogTitle>
          <DialogDescription>
            필요한 원두의 양을 입력해주세요
          </DialogDescription>
          <Label htmlFor='bean' >필요 원두(KG)</Label>
          <Input id='bean' type='number' value={bean} onChange={e => setBean(e.target.value === '' ? '' : Number(e.target.value))} />
          <Label htmlFor='bean' >원두 설명</Label>
          <Input id='bean' value={memo} onChange={e => setMemo(e.target.value)} />
        </DialogHeader>
        <DialogFooter>
          <Button disabled={on} onClick={submit}>신청하기</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}

const CafeTable = ({ applies, user }: { applies: IApply[]; user: IUser }) => {
  const pushPathname = useRouterPush()
  const searchParams = useSearchParams()
  const month = searchParams.get('month') ?? 'now'
  const monthNow = month === 'now'
  const thisMonth = dayjs().format('M')
  const nextMonth = dayjs().add(1, 'month').format('M')
  const danations = applies.map(apply =>
    ({ ...apply, current: apply.apply_donation.reduce((prev, donation) => prev + donation.bean, 0) }))
    .sort((a, b) => (b.bean - b.current) - (a.bean - a.current))

  return (
    <div className="w-full container bg-white rounded-xl">
      <div className="pb-5 flex justify-between items-center">
        <span className="text-2xl font-semibold">원두 기부하기</span>
        <div>
          <p className="text-right text-xs text-gray-500">접속일시</p>
          <span>{dayjs().format('YYYY년 M월 D일 HH:mm')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-5">
        <button className={monthNow ? 'p-2 text-primary-600 border-b cursor-pointer border-primary-600' : 'p-2 text-gray-500 border-b cursor-pointer border-gray-300 hover:text-primary-500 hover:border-b hover:border-primary-500'} onClick={() => pushPathname('month', 'now')}>{thisMonth}월</button>
        <button className={!monthNow ? 'p-2 text-primary-600 border-b cursor-pointer border-primary-600' : 'p-2 text-gray-500 border-b cursor-pointer border-gray-300 hover:text-primary-500 hover:border-b hover:border-primary-500'} onClick={() => pushPathname('month', 'next')}>{nextMonth}월</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {danations.map(donation => {
          const findDoonation = donation.apply_donation.find(d => d.cafe_id === user.id)
          return (
            <div key={donation.id} className="flex flex-col justify-center h-[250px] border border-primary-400 rounded-xl p-4">
              <div className="py-3 text-2xl text-center tracking-tight ">{donation.church.name}</div>
              <div className="my-2">
                <Progress value={Number((donation.current / donation.bean * 100).toFixed(1))} />
                <div className="flex px-2 mt-2 py-1 text-sm justify-between">
                  <div>{thisMonth}월 총 신청량</div>
                  <div>{donation.bean}kg</div>
                </div>
                <div className="flex px-2 mb-2 py-1 text-sm justify-between">
                  <div>{thisMonth}월 남은 신청량</div>
                  <div>{donation.bean - donation.current}kg</div>
                </div>
              </div>
              {!findDoonation ? <DoDonation apply={donation} /> : <CancelDonation donation={findDoonation} />}
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}

export default CafeTable