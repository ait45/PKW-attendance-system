"use client";

import React, { useEffect, useState } from "react";
import Nav from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import { Bell, CalendarCheck, Globe } from "lucide-react";
import Link from "next/link";
import Marquee from "./components/Marquee";

function Index() {
  const [holidays, setHolidays] = useState({});
  const fn_fetchHoliday = async () => {
    try {
      const holidayResponse = await fetch("/api/holidays", {
        method: "GET",
      });
      if (holidayResponse.ok) {
        const holidayData = await holidayResponse.json();
        setHolidays(holidayData);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fn_fetchHoliday();
  }, []);

  return (
    <main className="bg-white">
      {/* Header */}
      <Nav />
      {/* Hero Section */}
      <section className="bg-white py-5 text-center">
        <div className="flex justify-center items-center">
          <CalendarCheck size={20} className="text-[#009EA3]" />
          <h1 className="ml-2 font-bold text-2xl">Prakeawasawittaya</h1>
        </div>
        <p>ยินดีต้อนรับเข้าสู่เว็บไซต์</p>
        <hr className="max-w-40 m-auto text-[#00CAD1]" />
        <p className="text-[10px]">โรงเรียนพระแก้วอาสาวิทยา</p>
      </section>
      {/* Content Section */}
      <section className="bg-white grid grid-cols-2">
        <div className="m-4 p-2 ml-6 text-xs sm:text-sm border-r-1 border-slate-400">
          <p>ข้อมูลการติดต่อ</p>
          <div className="flex items-center">
            <Globe size={10} color="blue" />
            <Link
              href="https://www.facebook.com/pkw754"
              className="text-[10px] ml-1 text-blue-500 hover:text-blue-600 hover:transition-colors cursor-pointer"
            >
              สำนักข่าวพระแก้วอาสาวิทยา.
            </Link>
          </div>
        </div>
        <div className="m-4 py-10 text-xs sm:text-sm">
          <p className="text-xs sm:text-lg">ข้อมูลข่าวสาร</p>
          <p className="text-xs sm:text-md">กำลังโหลด...</p>
        </div>
      </section>
      <section className="bg-white py-12 px-6 grid md:grid-cols-3 gap-6"></section>
      <Footer />
    </main>
  );
}

export default Index;
