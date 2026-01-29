"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";
import Link from "next/link";
import { Clock, Calendar, LogIn, LogOut, CircleUserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import Timer from "../date-time/timer";
import Day from "../date-time/day";
import Swal from 'sweetalert2';
import type { Route } from "next";
import { useRouter } from "next/navigation";


function NavBar({ session }: { session?: any }) {
  const [currentDate] = useState(Day());
  const [component, setComponent] = useState("");
  const router = useRouter();
  return (
    <header className="flex items-center bg-white w-auto max-h-50 border-b-2 border-[#009EA3]">
      <Image
        src={logo}
        width={40}
        height={40}
        alt="logo"
        className="m-1 sm:m-2"
      />
      <h2 className="text-sm sm:text-lg font-bold cursor-default">
        PKW SERVICE SYSTEM
      </h2>
      <div className="flex items-center justify-end ml-auto gap-2 ">
        <div className="relative flex items-center sm:mr-2">
          <Calendar
            className="sm:mr-2 cursor-pointer"
            width={12}
            height={12}
            onClick={() => {
              setComponent("date");
              setTimeout(() => {
                setComponent("");
              }, 3000);
            }}
          />
          <p className="hidden md:inline text-xs cursor-context-menu">
            {currentDate}
          </p>
          {component === "date" && (
            <span className="absolute left-1/2 transform -translate-x-1/2 px-2 py-1 z-50 bg-gray-500 text-white text-xs rounded text-nowrap">
              {currentDate}
            </span>
          )}
        </div>
        <div className="relative flex items-center sm:mr-2">
          <Clock
            className="sm:mr-2 cursor-pointer"
            width={12}
            height={12}
            onClick={() => {
              setComponent("time");
              setTimeout(() => {
                setComponent("");
              }, 3000);
            }}
          />
          <p className="hidden md:inline text-xs cursor-context-menu">
            <Timer />
          </p>
          {component === "time" && (
            <span className="absolute left-1/2 transform -translate-x-1/2 px-2 py-1 z-50 bg-gray-500 text-white text-xs rounded text-nowrap">
              <Timer />
            </span>
          )}
        </div>
        {!session ? (
          <Link
            href={"/login" as Route}
            className="flex items-center p-4 text-sm text-[#009EA3]  hover:text-[#188F6D] hover:transition-colors"
            title="เข้าสู่ระบบ"
          >
            <LogIn width={15} height={15} className="mr-1" />
            <p className="hidden sm:inline">เข้าสู่ระบบ</p>
          </Link>
        ) : (
          <div className="flex">
            <div className="flex items-center text-sm p-4" title="ชื่อผู้ใช้">
              <CircleUserRound className="text-blue-500" />
              <p>{session?.user?.name}</p>
            </div>
            <a
              onClick={async () => {
                await signOut();
                setTimeout(() => {
                  Swal.fire({
                    title: "ออกจากระบบเสร็จสิ้น",
                    icon: "success",
                    timer: 5000,
                  });
                }, 1000);
                router.push("/login" as Route);
              }}
              className="flex items-center text-sm text-red-500 hover:text-red-700 hover:transition-colors cursor-pointer mr-2"
              title="ออกจากระบบ"
            >
              <LogOut width={15} height={15} className="mr-1" />
              <p className="hidden sm:inline">ออกจากระบบ</p>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
