'use client'
import React from 'react'
import SignOut from './sign-out'
import { IUser } from '@/interface/user'
import { SidebarTrigger } from './ui/sidebar'
import { useMediaQuery } from '@/hooks/use-media-query'

const Nav = ({ user }: { user: IUser }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return (
    <div className='h-[70px] border-b-yellow-900 flex shadow-md w-full'>
      <div className='container mx-auto flex items-center justify-center'>
        <div className="flex container justify-between items-center">
          {!isDesktop && user.type === 'cafe' && <SidebarTrigger />}
          <div>
            <p className="text-2xl text-primary font-medium tracking-tight">원두 기부</p>
          </div>
          <div className='flex items-center gap-5'>
            <p className="text-primary"><span className="text-lg font-medium">{user.name}</span><span className="text-sm">님</span></p>
            <SignOut />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav