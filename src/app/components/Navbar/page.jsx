'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import Link from 'next/link';
import { Clock, Calendar, LogIn, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Timer from '../Clock/page';


function navBar({ session }) {
  const [currentDate] = useState(new Date().toLocaleDateString('th-TH'));
  return (
    <header className='flex items-center bg-white w-auto max-h-50 border-b-2 border-[#AFFDFF]'>
      <Image
        src={logo}
        width={40}
        height={40}
        alt='logo'
        className='m-2'
      />
      <h2 className='text-sm sm:text-lg font-bold'>PKW SERVICE TH</h2>
      <div className='flex items-center justify-end ml-auto gap-2 '>
        <Calendar width={12} height={12} />
        <p className='text-xs font-bold cursor-context-menu'>{currentDate}</p>
        <Clock width={12} height={12} />
        <p className='text-xs font-bold cursor-context-menu'><Timer/></p>
        {!session ? (
          <Link
            href='/login'
            className='flex items-center text-sm text-[#AFFDFF]  hover:text-[#8AFBFF] hover:transition-colors'
          >
            <LogIn width={15} height={15} className='mr-1' />
            <p className='hidden sm:inline'>เข้าสู่ระบบ</p>
          </Link>
        ) : (
          <a
            onClick={() => signOut()}
            className='flex items-center text-sm text-red-500 hover:text-red-700 hover:transition-colors cursor-pointer'
          >
            <LogOut width={15} height={15} className='mr-1' />
            <p className='hidden sm:inline'>ออกจากระบบ</p>
          </a>
        )}


      </div>

    </header>

  )
}

export default navBar