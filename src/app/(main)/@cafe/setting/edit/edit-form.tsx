'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

import { donationInfoSchema } from '@/utils/validations'
import DaumPostcode from '@/components/daum-postcode'
import { AddressData, IDonationInfo } from '@/interface/user'

function EditForm({ info }: { info: IDonationInfo }) {
  const router = useRouter()
  const [address, setAddress] = useState(info.address[1]);
  const [zonecode, setZonecode] = useState(info.address[0]);

  const handleComplete = (data: AddressData) => {
    setAddress(data.address);
    setZonecode(data.zonecode);
  };

  const form = useForm<z.infer<typeof donationInfoSchema>>({
    resolver: zodResolver(donationInfoSchema),
    defaultValues: {
      name: info.name,
      identity_number: info.identity_number,
      address: info.address[2]
    }
  })

  const onSubmit = async (values: z.infer<typeof donationInfoSchema>) => {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('donation_info')
      .update({
        name: values.name,
        identity_number: values.identity_number,
        address: [zonecode, address, values.address],
      })
      .eq('user_id', user.user?.id)
      .select()
    if (!error) router.push('/setting')
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>
                  기부금 영수증 받을 대상 성명
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder='홍길동'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name={"identity_number"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>
                  주민등록번호
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder='1234567-1111222'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="p-4">
            <DaumPostcode onComplete={handleComplete} />
            <div className="mt-4">
              <p>우편번호: {zonecode}</p>
              <p>주소: {address}</p>
            </div>
          </div>
          <FormField
            control={form.control}
            name={"address"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>
                  상세주소
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder='상세주소 입력해주세요'
                    {...field}
                    className='book-form_input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='book-form_btn text-white'>
            저장
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditForm