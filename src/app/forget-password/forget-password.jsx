"use client";

import React, { useState } from "react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer/page";
import Link from "next/link";
import { IdCard, LockKeyhole } from "lucide-react";

function forgetPassword() {
  const [id, setId] = useState({});
  const [empty, setEmpty] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(id).length === 0) setEmpty(true);
  };
  return (
    <main className="max-h-screen flex flex-col">
      <Nav />
      <div className="p-6 mb-[40vh]">
        <header className="mb-4">
          <h1 className="text-balance sm:text-xl text-blue-500 flex items-end">
            <LockKeyhole />
            <p className="ml-2">ขอรหัสผ่านเข้าใช้งาน</p>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            กรุณาป้อนรหัสนักเรียนเพื่อทำการขอรหัสในการเข้าสู่ระบบ
          </p>
        </header>
        <div className="m-auto mt-10 w-[60%]">
          <form className="flex flex-col">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700 mb-1 ml-2"
            >
              รหัสนักเรียน
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-2 top-2.5 z-20 text-gray-400 cursor-context-menu">
                <IdCard />
              </div>

              <input
                id="id"
                type="number"
                className={`pl-10 w-[100%] border-2 border-gray-300  ${
                  empty
                    ? "border-red-500"
                    : "hover:border-blue-500 focus:border-blue-500"
                } rounded-md outline-none px-1 py-2 placeholder:text-gray-300`}
                min={0}
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setEmpty(false);
                }}
                placeholder="1234"
              />
              {empty && (
                <p className="text-xs text-red-500">
                  กรุณากรอกข้อมูลลงในช่องว่าง
                </p>
              )}
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              className="mt-6 px-1 py-2 rounded-md bg-[#009EA3] hover:bg-[#0E6761] transition-colors text-white cursor-pointer"
            >
              ยืนยัน
            </button>
          </form>
          <Link
            href="/login"
            className="text-xs flex justify-end mr-1 text-blue-500 hover:text-blue-700 transition-colors mt-4 cursor-pointer"
          >
            ย้อนกลับ
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default forgetPassword;
