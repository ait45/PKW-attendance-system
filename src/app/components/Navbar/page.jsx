'use client'
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import Link from 'next/link';
import { Clock, Calendar, LogIn, LogOut, CircleUserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Timer from '../date-time/timer';
import Day from '../date-time/day';



function navBar({ session }) {
  const [currentDate] = useState(Day());
  return (
    <header className='flex items-center bg-white w-auto max-h-50 border-b-2 border-[#009EA3]'>
      <Image
        src={logo}
        width={40}
        height={40}
        alt='logo'
        className='m-2'
      />
      <h2 className='text-sm sm:text-lg font-bold cursor-default'>PKW SERVICE TH</h2>
      <div className='flex items-center justify-end ml-auto gap-2 '>
        <Calendar width={12} height={12} />
        <p className='text-xs font-bold cursor-context-menu'>{currentDate}</p>
        <Clock width={12} height={12} />
        <p className='text-xs font-bold cursor-context-menu'><Timer /></p>
        {!session ? (
          <Link
            href='/login'
            className='flex items-center text-sm text-[#009EA3]  hover:text-[#8AFBFF] hover:transition-colors'
          >
            <LogIn width={15} height={15} className='mr-1' />
            <p className='hidden sm:inline'>เข้าสู่ระบบ</p>
          </Link>
        ) : (
          <div className='flex'>
            <div className='flex items-center text-sm p-2' title='ชื่อผู้ใช้'>
              <CircleUserRound className='text-blue-500'/>
              <p>{session.user.name}</p>
              </div>   
          <a
            onClick={() => signOut()}
            className='flex items-center text-sm text-red-500 hover:text-red-700 hover:transition-colors cursor-pointer'
            title='ออกจากระบบ'
          >
            <LogOut width={15} height={15} className='mr-1' />
            <p className='hidden sm:inline'>ออกจากระบบ</p>
          </a>
          </div>
        )}


      </div>

    </header>

  )
}

export default navBar