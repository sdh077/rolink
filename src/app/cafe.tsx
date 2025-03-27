'use client'
import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IChurch } from '@/interface/user'
import { Button } from '@/components/ui/button'
import { useRouterPush } from '@/hooks/use-create-query-string'

const CafeTable = ({ churches }: { churches: IChurch[] }) => {
  const pushPathname = useRouterPush()
  return (
    <div className=''>
      <div className='flex gap-8 justify-center'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
          <Button variant={'outline'} key={month}
            className='w-12 h-12'
            onClick={() => pushPathname('month', month.toString())}
          >{month}월</Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">신청</TableHead>
            <TableHead className="text-right">남은양</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {churches?.filter(church => church.apply_bean.length).map((church) => (
            <TableRow key={church.id}>
              <TableCell className="font-medium">{church.name}</TableCell>
              <TableCell>{church.tel}</TableCell>
              <TableCell>{church.address}</TableCell>
              <TableCell>{church.apply_bean[0].bean}</TableCell>
              <TableCell>{church.apply_bean[0].bean - church.apply_bean[0].apply_donation.reduce((prev, donation) => prev + donation.bean, 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CafeTable