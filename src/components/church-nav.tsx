'use client'
import React from 'react'
import { IUser } from '@/interface/user'
import { SidebarTrigger } from './ui/sidebar'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/utils/supabase/client'
import { redirect, useRouter } from 'next/navigation'

export function Profile({ user }: { user: IUser }) {
  const router = useRouter()
  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className=''>{user.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/')}>
            기부 신청
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/donation')}>
            기부 내역 리스트
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/inquiry')}>문의 내역</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Nav = ({ user }: { user: IUser }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return (
    <div className='h-[70px] border-b-yellow-900 flex shadow-md w-full'>
      <div className='container mx-auto flex items-center justify-center'>
        <div className="flex container justify-between items-center">
          {!isDesktop && user.type === 'cafe' && <SidebarTrigger />}
          <div>
            <p className="text-2xl text-primary-500 font-medium tracking-tight">원두 기부</p>
          </div>
          <div className='flex items-center gap-5'>
            <Profile user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav