"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
// import { useRouter } from "next/navigation"
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function SigninForm() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const FormSchema = z.object({
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "password must be at least 2 characters.",
    }),

  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email + "@rolink.com",
        password: data.password
      })
      if (error) {
        toast('로그인에 실패 했습니다')
        return
      } else {
        toast(
          '로그인에 성공했습니다'
        )
        window.location.href = '/'
      }
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    supabase.auth.getUser()
      .then(res => {
        if (res.data.user) redirect('/')
      })
  }, [])
  return (
    <Form {...form} >
      <form className='flex justify-center items-center w-full h-screen ' onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-[500px] h-[500px] rounded-2xl md:rounded-none py-8 px-12 bg-white flex flex-col gap-8 items-center justify-center">
          <div className='text-center text-3xl font-medium pb-16'>커피링크</div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel >ID</FormLabel>
                <FormControl>
                  <Input placeholder="아이디를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel >비밀번호</FormLabel>
                <FormControl>
                  <Input className="shadow-sm peer w-full rounded-md border border-gray-200 px-3 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-hidden" type="password" placeholder="비밀번호을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="shadow-sm bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-md py-2.5 text-white transition-all hover:text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? '로그인 중' : '로그인'} &rarr;
            <BottomGradient />
          </button>

          {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}

        </div>
      </form>
    </Form>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
