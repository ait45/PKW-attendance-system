"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Nav from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import ShowAlert from "../components/Sweetalert";
import Swal from "sweetalert2";

function Setting() {
  const { data: session, status } = useSession();
  const [admin, setAdmin] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataSetting, setDataSetting] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [error, setError] = useState({});
  const fetchSetting = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/setting");
      if (res.status !== 200) return;
      const data = await res.json();
      if (data) {
        setDataSetting(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSetting();
  }, []);
  useEffect(() => {
    const {
      AttendanceStart,
      lateThreshold,
      absentThreshold,
      timerStartEditAttendance,
      timerEndEditAttendance,
    } = dataSetting;
    if (
      !AttendanceStart ||
      !lateThreshold ||
      !absentThreshold ||
      !timerStartEditAttendance ||
      !timerEndEditAttendance
    ) {
      setError({});
      return;
    }
    const start = new Date(`1970-01-01T${AttendanceStart}:00`);
    const late = new Date(`1970-01-01T${lateThreshold}:00`);
    const absent = new Date(`1970-01-01T${absentThreshold}:00`);
    const edit_Start = new Date(`1970-01-01T${timerStartEditAttendance}:00`);
    const edit_end = new Date(`1970-01-01T${timerEndEditAttendance}:00`);

    if (start >= late) {
      setError({ AttendanceStart: "เวลาเริ่มเช็คต้องเร็วกว่าเวลาสาย" });
    } else if (late >= absent) {
      setError({ lateThreshold: "เวลาสายต้องเร็วกว่าเวลาขาด" });
    } else if (edit_Start >= edit_end) {
      setError({
        timerStartEditAttendance: "เวลาเริ่มแก้ไขต้องเร็วกว่าเวลาสิ้นสุด",
      });
    } else {
      setError({});
    }
  }, [dataSetting]);
  const validateForm = () => {
    const newError = {};
    if (!dataSetting.AttendanceStart)
      newError.AttendanceStart = "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.lateThreshold)
      newError.lateThreshold = "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.absentThreshold)
      newError.absentThresholed = "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.timerStartEditAttendance)
      newError.timerStartEditAttendance =
        "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.timerEndEditAttendance)
      newError.timerEndEditAttendance =
        "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.Scorededucted_lateAttendance)
      newError.Scorededucted_lateAttendance =
        "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    if (!dataSetting.Scorededucted_absentAttendance)
      newError.Scorededucted_absentAttendance =
        "ช่องนี้ไม่สามารถเว้นว่าง กรุณาป้อนเวลา";
    return newError;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataSetting((prev) => ({ ...prev, [name]: value }));
    setIsChange(true);
    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    console.log(error);
    if (Object.keys(error).length > 0) {
      setError(error);
      return;
    }
    setIsChange(false);
    await Swal.fire({
      title: "ยืนยันการบันทึกตั้งค่า",
      showConfirmButton: true,
      confirmButtonText: "บันทึก",
      width: "60%",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const req = await fetch("/api/setting", {
          method: "POST",
          body: JSON.stringify(dataSetting),
        });
        if (!req.ok)
          return ShowAlert({
            title: "บันทึกการตั้งค่าไม่สำเร็จสำเร็จ",
            text: "กรุณาลองอีกครั้ง",
            icon: "error",
          });
        await ShowAlert({ title: "บันทึกการตั้งค่าสำเร็จ", icon: "success" });
        fetchSetting();
      }
    });
  };
  if (!session?.user?.role === "teacher" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "student" && !session?.user?.isAdmin)
    return redirect(`/student/${session?.id}`);
  if (session?.user?.role === "student" && session?.user?.isAdmin)
    return redirect(`/student/admin/${session?.id}`);
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  if (loading) return null;

  return (
    <main className="min-w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Nav session={session} />
      <div className="flex justify-center pt-2 mb-10">
        <div className="bg-white rounded-xl shadow-2xl w-[90%] sm:w-[70%] p-6 ">
          <Link
            href="#"
            onClick={async (e) => {
              if (isChange) {
                await handleSubmit(e);
              }
              router.back();
            }}
            title="ย้อนกลับ"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <p className="text-sm hidden sm:inline">ย้อนกลับ</p>
          </Link>
          <header className="pt-3 mb-2 flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl">ตั้งค่าระบบ</h1>
              {isChange && (
                <p className="text-xs text-red-500">* ข้อมูลมีการเปลี่ยนแปลง</p>
              )}
            </div>
            <div className="">
              <button className="mr-2 px-3 py-2 outline-2 outline-blue-500 text-blue-500  hover:bg-blue-700 hover:text-white  transition-colors rounded-md cursor-pointer">
                ส่งออก
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-2 outline-2 outline-green-500 text-green-500 hover:bg-green-700 hover:text-white transition-colors rounded-md cursor-pointer"
              >
                บันทึก
              </button>
            </div>
          </header>
          <div className="bg-white rounded-xl shadow-xl p-4 m-2">
            <h1 className="text-lg text-blue-500 font-semibold">
              คะแนนความประพฤติ
            </h1>
            <div className="ml-2 mb-4">
              <h1>การหักคะแนน</h1>
              <div className="flex items-center my-2 justify-between">
                <p>สาย</p>
                <div className="flex items-center">
                  หัก
                  <input
                    type="number"
                    className={`mx-2 px-3 py-1 w-[60px] border-b-2 border-gray-500 hover:border-blue-500 focus:border-blue-500 ${
                      error.Scorededucted_lateAttendance && "border-red-500"
                    } transition-all outline-none`}
                    maxLength={1}
                    min={0}
                    name="Scorededucted_lateAttendance"
                    value={dataSetting.Scorededucted_lateAttendance}
                    onChange={handleInputChange}
                  />
                  คะแนน
                </div>
              </div>
              {error.Scorededucted_lateAttendance && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.Scorededucted_lateAttendance}
                </p>
              )}
              <hr className="text-[#009EA7]" />
              <div className="flex items-center my-2 justify-between">
                <p>ขาด</p>
                <div>
                  หัก
                  <input
                    type="number"
                    className={`mx-2 px-3 py-1 w-[60px] border-b-2 border-gray-500 hover:border-blue-500 focus:border-blue-500 ${
                      error.Scorededucted_absentAttendance && "border-red-500"
                    } transition-all outline-none`}
                    min={0}
                    maxLength={1}
                    name="Scorededucted_absentAttendance"
                    value={dataSetting.Scorededucted_absentAttendance}
                    onChange={handleInputChange}
                  />
                  คะแนน
                </div>
              </div>
              {error.Scorededucted_absentAttendance && (
                <p className="flex justify-end mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.Scorededucted_absentAttendance}
                </p>
              )}
              <hr className="text-[#009AE3]" />
            </div>
            <h1 className="text-lg text-blue-500 font-semibold">
              การตั้งค่าเวลาต่างๆ
            </h1>
            <div className="ml-2 mb-2 ">
              <h1 className="font-bold mb-2">กิจกรรมหน้าเสาธง</h1>
              <div className="flex justify-between items-center px-2 mb-2">
                <p>เริ่มเช็คชื่อ</p>
                <div>
                  <input
                    type="time"
                    name="AttendanceStart"
                    value={dataSetting.AttendanceStart}
                    onChange={handleInputChange}
                    className={`border-b-2 border-gray-500 focus:border-blue-500 ${
                      error.AttendanceStart && "border-red-500"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              {error.AttendanceStart && (
                <p className="text-[12px] sm:text-sm text-red-600 ml-2">
                  {error.AttendanceStart}
                </p>
              )}
              <div className="flex justify-between items-center px-2 mb-2">
                <p>สาย</p>
                <div>
                  <input
                    type="time"
                    name="lateThreshold"
                    value={dataSetting.lateThreshold}
                    onChange={handleInputChange}
                    className={`border-b-2 border-gray-500 focus:border-blue-500 ${
                      error.lateThreshold && "border-red-500"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              {error.lateThreshold && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.lateThreshold}
                </p>
              )}
              <div className="flex justify-between items-center px-2 mb-2">
                <p>หมดเวลา</p>
                <div>
                  <input
                    type="time"
                    name="absentThreshold"
                    value={dataSetting.absentThreshold}
                    onChange={handleInputChange}
                    className={`border-b-2 border-gray-500 focus:border-blue-500 ${
                      error.absentThreshold && "border-red-500"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              {error.absentThreshold && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.absentThreshold}
                </p>
              )}
              <div className="flex justify-between items-center px-2 mb-2">
                <p>เวลาเริ่มแก้ไข</p>
                <div>
                  <input
                    type="time"
                    name="timerStartEditAttendance"
                    value={dataSetting.timerStartEditAttendance}
                    onChange={handleInputChange}
                    className={`border-b-2 border-gray-500 focus:border-blue-500 ${
                      error.timerStartEditAttendance && "border-red-500"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              {error.timerStartEditAttendance && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.timerStartEditAttendance}
                </p>
              )}
              <div className="flex justify-between items-center px-2 mb-2">
                <p>หมดเวลาแก้ไข</p>
                <div>
                  <input
                    type="time"
                    name="timerEndEditAttendance"
                    value={dataSetting.timerEndEditAttendance}
                    onChange={handleInputChange}
                    className={`border-b-2 border-gray-500 focus:border-blue-500 ${
                      error.timerEndEditAttendance && "border-red-500"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              {error.timerEndEditAttendance && (
                <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                  {error.timerEndEditAttendance}
                </p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-4 m-2">
            <h1 className="font-bold text-blue-500">รีเซ็ตระบบ</h1>
            <div className="ml-2 my-2">
              <button
                type="button"
                className="mb-2 cursor-pointer px-3 py-2 bg-[#009E7A] hover:bg-[#008264] transition-all rounded-md text-white"
              >
                รีเซ็ตคะแนนความประพฤติ
              </button>
              <br />
              <button
                type="button"
                className="my-2 cursor-pointer px-3 py-2 bg-blue-500 hover:bg-blue-700 transition-all rounded-md text-white"
              >
                รีเซ็ตข้อมูลนักเรียน
              </button>
              <br />
              <button
                type="button"
                className="my-2 cursor-pointer px-3 py-2 bg-blue-500 hover:bg-blue-700 transition-all rounded-md text-white"
              >
                รีเซ็ตข้อมูลการเช็คชื่อ
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Setting;
