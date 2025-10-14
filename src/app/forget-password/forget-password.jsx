"use client";

import React, { useState } from "react";
import Nav from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import ShowAlert from "../components/Sweetalert";
import HCaptcha from "@hcaptcha/react-hcaptcha";

function forgetPassword() {
  const [id, setId] = useState({});
  const [empty, setEmpty] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(id).length === 0) setEmpty(true);
    if (!captchaToken) return ShowAlert({ title: "กรูณายืนยัน Captcha", icon: "warning" });

    const res = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaToken }),
    });
    const data = await res.json();

    if(!data.success) return ShowAlert({ title: "ยืนยัน captcha ไม่ผ่าน ", icon: "error" });
  };
  return (
    <main>
      <Nav />
      <div className="p-6 mb-10">
        <header className="mb-4">
          <h1 className="text-balance sm:text-xl text-blue-500">
            ลืมรหัสผ่าน ?
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            กรุณาป้อนรหัสนักเรียนเพื่อทำการขอรหัสในการเข้าสู่ระบบ
          </p>
        </header>
        <div className="flex justify-center mt-10">
          <form className="flex flex-col">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              รหัสนักเรียน
            </label>
            <input
              id="id"
              type="number"
              className={`border-2 border-gray-300  ${empty ? "border-red-500" : "hover:border-blue-500 focus:border-blue-500"} rounded-md outline-none px-1 py-2`}
              min={0}
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setEmpty(false);
              }}
            />
            {empty && (
              <p className="text-xs text-red-500">
                กรุณากรอกข้อมูลลงในช่องว่าง
              </p>
            )}
            <button
              onClick={(e) => handleSubmit(e)}
              className="mt-6 px-1 py-2 rounded-md bg-[#009EA3] hover:bg-[#0E6761] transition-colors text-white cursor-pointer"
            >
              ยืนยัน
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default forgetPassword;
