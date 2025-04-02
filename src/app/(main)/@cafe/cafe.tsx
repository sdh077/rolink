'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useRouterPush } from '@/hooks/use-create-query-string'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { useRouter, useSearchParams } from 'next/navigation'
import { IApply, IDonation } from "@/interface/apply"
import { IUser } from "@/interface/user"

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
        <Button variant="outline">취소하기</Button>
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
  const [open, setOpen] = useState(false)
  const submit = async () => {
    if (on) return
    setOn(true)
    try {
      const { data: user } = await supabase.auth.getUser()
      const { error } = await supabase.from('apply_donation')
        .insert({ cafe_id: user.user?.id, apply_bean_id: apply.id, bean, })
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
        <Button variant="outline">원두 기부하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>원두 기부하기</DialogTitle>
          <DialogDescription>
            필요한 원두의 양을 입력해주세요
          </DialogDescription>
          <Label htmlFor='bean' >필요 원두(KG)</Label>
          <Input id='bean' type='number' value={bean} onChange={e => setBean(e.target.value === '' ? '' : Number(e.target.value))} />
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
  const searchParams = useSearchParams();
  const today = new Date()
  const month = searchParams.get('month') ?? (today.getMonth() + 1).toString()

  return (
    <div className="w-full container my-3 md:py-5 bg-white rounded-xl">
      <div className='flex gap-8 justify-left'>
        <Select value={month} onValueChange={(month) => pushPathname('month', month)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="월 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>월 선택</SelectLabel>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
                <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>카페명</TableHead>
            <TableHead>연락처</TableHead>
            {/* <TableHead>주소</TableHead> */}
            <TableHead>남은양 / 신청</TableHead>
            <TableHead>기부하기</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applies?.map((apply) => {
            const donation = apply.apply_donation.find(donation => donation.cafe_id === user.id)
            return (
              <TableRow key={apply.id}>
                <TableCell className="font-medium">{apply.user.name}</TableCell>
                <TableCell>{apply.user.tel}</TableCell>
                {/* <TableCell>{apply.user.address}</TableCell> */}
                <TableCell>{apply.bean - apply.apply_donation.reduce((prev, donation) => prev + donation.bean, 0)} / {apply.bean}</TableCell>
                <TableCell>{!donation ? <DoDonation apply={apply} /> : <CancelDonation donation={donation} />}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default CafeTable