'use client'
import React from 'react';
import Image from 'next/image';
import Nav from './components/Navbar/page';
import Footer from './components/Footer/page';
import {
  CalendarCheck, Globe
} from 'lucide-react';
import Link from 'next/link';
function Index() {
  return (
    <main className='bg-white'>
      {/* Header */}
      <Nav />
      {/* Hero Section */}
      <section className='bg-white py-5 text-center'>
        <div className='flex justify-center items-center'>
          <CalendarCheck size={20} color='gray' />
          <h1 className='ml-2 font-bold text-2xl'>Prakeawasawittaya</h1>
        </div>
        <p>ยินดีต้อนรับเข้าสู่เว็บไซต์</p>
        <hr className='max-w-40 m-auto text-[#00CAD1]'/>
        <p className='text-[10px]'>โรงเรียนพระแก้วอาสาวิทยา</p>
      </section>
      {/* Content Section */}
      <section className='bg-white grid grid-cols-2'>
        <div className='m-4 p-2 ml-6 text-xs sm:text-sm border-r-1 border-gray-400'>
          <p>ข้อมูลการติดต่อ</p>
          <div className='flex items-center'><Globe size={10} color='blue'/><Link href='https://www.facebook.com/pkw754' className='text-[10px] ml-1 hover: text-blue-500 hover:transition-colors'>สำนักข่าวพระแก้วอาสาวิทยา.</Link></div>
        </div>
        <div className='m-4 py-10 text-xs sm:text-sm'>
          <p className='text-xs sm:text-lg'>ข้อมูลข่าวสาร</p>
          <p className='text-xs sm:text-md'>กำลังโหลด...</p>
        </div>
      </section>
      <section className="bg-white py-12 px-6 grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Fast</h3>
          <p className="text-gray-600 text-sm">
            Built with Next.js for blazing fast performance and optimized loading.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Responsive</h3>
          <p className="text-gray-600 text-sm">
            Works perfectly on desktop, tablet, and mobile devices.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Customizable</h3>
          <p className="text-gray-600 text-sm">
            Easily modify the design and layout using Tailwind classes.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Index