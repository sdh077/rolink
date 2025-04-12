import { IDonation } from '@/interface/apply'
import { createClient } from '@/utils/supabase/server'
import React from 'react'

const getDonations = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('apply_donation')
    .select('*, apply_bean(*, church:user!user_id(*)), cafe:user!church_id(*)')
    .eq('cafe_id', user.user?.id)
    .overrideTypes<IDonation[]>()
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Donation = async () => {
  const { data: donations } = await getDonations()
  return (
    <div className='w-full gap-16'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">날짜</TableHead>
            <TableHead>기부 대상</TableHead>
            <TableHead>기부 커피</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations?.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="font-medium">{donation.apply_bean.year}-{donation.apply_bean.month}</TableCell>
              <TableCell>{donation.apply_bean.church?.name}</TableCell>
              <TableCell>{donation.bean}kg</TableCell>
              <TableCell className="text-right">{donation.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Donation