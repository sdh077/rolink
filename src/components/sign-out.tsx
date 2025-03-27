'use client'

import { createClient } from "@/utils/supabase/client"
import { Button } from "./ui/button"
import { redirect } from "next/navigation"

const SignOut = () => {
  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }
  return (
    <Button onClick={signOut}>로그아웃</Button>
  )
}

export default SignOut