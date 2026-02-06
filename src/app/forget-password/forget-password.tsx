"use client";

import React, { useState, SyntheticEvent } from "react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer/page";
import Link from "next/link";
import { IdCard, LockKeyhole, CheckCircle, User, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Route } from "next";
import Swal from "sweetalert2";

interface FormData {
  studentId: string;
  studentName: string;
  classes: string;
  reason: string;
}

function ForgetPassword() {
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    studentName: "",
    classes: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    if (!formData.studentId) {
      setErrors({ studentId: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        Swal.fire("เกิดข้อผิดพลาด", data.message || "กรุณาลองใหม่อีกครั้ง", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col">
        <Nav session={session} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ส่งคำขอสำเร็จ!</h2>
            <p className="text-slate-500 mb-6">
              คำขอของคุณถูกส่งไปยังผู้ดูแลระบบแล้ว<br />
              กรุณารอการติดต่อกลับจากครูประจำชั้น
            </p>
            <Link
              href={"/login" as Route}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Nav session={session} />
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl text-blue-600 flex items-center gap-2 font-bold">
              <LockKeyhole className="w-6 h-6" />
              ขอรหัสผ่านใหม่
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              กรุณากรอกข้อมูลเพื่อส่งคำขอไปยังผู้ดูแลระบบ
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form className="space-y-4">
              {/* Student ID */}
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-1">
                  รหัสนักเรียน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="studentId"
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => {
                      setFormData({ ...formData, studentId: e.target.value });
                      setErrors({ ...errors, studentId: false });
                    }}
                    className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg outline-none transition-colors ${
                      errors.studentId
                        ? "border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    } placeholder:text-xs sm:placeholder:text-sm`}
                    placeholder="เช่น 1234"
                  />
                </div>
                {errors.studentId && (
                  <p className="text-xs text-red-500 mt-1">กรุณากรอกรหัสนักเรียน</p>
                )}
              </div>

              {/* Student Name */}
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="studentName"
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors placeholder:text-xs sm:placeholder:text-sm"
                    placeholder="ชื่อจริง นามสกุล (ไม่บังคับ)"
                  />
                </div>
              </div>

              {/* Classes */}
              <div>
                <label htmlFor="classes" className="block text-sm font-medium text-slate-700 mb-1">
                  ชั้นเรียน
                </label>
                <select
                  id="classes"
                  value={formData.classes}
                  onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors "
                >
                  <option value="">เลือกชั้นเรียน</option>
                  <option value="ม.1">มัธยมศึกษาปีที่ 1</option>
                  <option value="ม.2">มัธยมศึกษาปีที่ 2</option>
                  <option value="ม.3">มัธยมศึกษาปีที่ 3</option>
                  <option value="ม.4">มัธยมศึกษาปีที่ 4</option>
                  <option value="ม.5">มัธยมศึกษาปีที่ 5</option>
                  <option value="ม.6">มัธยมศึกษาปีที่ 6</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                  เหตุผล
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="reason"
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors placeholder:text-xs sm:placeholder:text-sm"
                    placeholder="เช่น ลืมรหัสผ่าน (ไม่บังคับ)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-[#009EA3] text-white rounded-xl font-medium hover:bg-[#0E6761] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <><svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>กำลังส่ง...</>: "ส่งคำขอ"}
              </button>
            </form>

            <Link
              href={"/login" as Route}
              className="block text-center text-sm text-blue-500 hover:text-blue-700 transition-colors mt-4"
            >
              ย้อนกลับ
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default ForgetPassword;
