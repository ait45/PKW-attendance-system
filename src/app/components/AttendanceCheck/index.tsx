"use client";

import { useEffect, useState } from "react";
import QRScanning from "../QRScanning";
import { IdCard, UserRoundCheck } from "lucide-react";
import Swal from "sweetalert2";

// หน้าเช็คชื่อ
function AttendanceCheckPage({ session }: { session: any }) {
  const [qrData, setQrdata] = useState<Record<string, string>>({});
  const [showHoliday, setShowHoliday] = useState({ isHoliday: false, name: "" });

  const [manualIdCheckIn, setManualIdCheckIn] = useState("");
  const [emptyField, setEmptyField] = useState(false);

  const getHoliday = async () => {
    const req = await fetch("/api/holidays");
    const data = await req.json();
    setShowHoliday(data);
  };

  const attendance = async (id: string) => {
    document.body.classList.add("loading");
    try {
      const req = await fetch("/api/scanAttendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, handler: session?.user?.name }),
      });
      const res = await req.json();
      if (req.status === 400)
        return Swal.fire({ text: res.message, icon: "error" });
      if (res.success) {
        return Swal.fire({ title: "เช็คชื่อสำเร็จ", icon: "success" });
      }
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: res.message, icon: "error" });
    } catch (error: any) {
      document.body.classList.remove("loading");
      console.log(error);
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: error, icon: "error" });
    } finally {
      document.body.classList.remove("loading");
    }
  };
  useEffect(() => {
    if (Object.keys(qrData).length > 0) {
      attendance(qrData.id);
      setQrdata({});
    }
  }, [qrData]);
  useEffect(() => {
    getHoliday();
  });

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualIdCheckIn.trim() === "") {
      Swal.fire({
        text: "กรุณากรอกเลขประจำตัวนักเรียน",
        icon: "warning",
        width: 300,
        timer: 2000,
      });
      setEmptyField(true);
      return;
    } else {
      Swal.fire({
        title: "ยืนยันการเช็คชื่อ?",
        text: `เลขประจำตัวนักเรียน: ${manualIdCheckIn}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          attendance(manualIdCheckIn);
          setManualIdCheckIn("");
          setEmptyField(false);
        }
      });
    }
  };

  return (
    <main className="bg-white rounded-lg shadow-lg p-4 mb-7 max-w-5xl mx-auto">
      <div className="">
        <div className="flex items-center justify-center mb-1">
          <div className="bg-emerald-500 text-white rounded-md p-2">
            <UserRoundCheck width={30} height={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center ml-2">
            เช็คชื่อนักเรียน
          </h2>
        </div>
        {showHoliday ? (
          showHoliday.isHoliday && (
              <p className="text-xs text-red-500 text-center mb-4">
            * {showHoliday.name} ไม่ต้องเช็คชื่อ *
          </p>
          )
          
        ): null}
      </div>

      <div className="text-center">
        <QRScanning
          onScan={(value: any) => setQrdata(value)}
          holiday={showHoliday?.isHoliday}
        />
      </div>
      <div className="bg-linear-to-br from-blue-50 to-indigo-100 mt-4 p-4 rounded-md shadow-md">
        <h1 className="text-[#009EA3] text-xl font-semibold">ID Check</h1>
        <div className="flex items-center">
          <div>
            <label className="text-xs">เลขประจำตัวนักเรียน</label>
            <div className="relative">
              <IdCard
                className={`absolute z-10 left-2 top-1/2 transform -translate-y-1/2 text-blue-500 ${
                  emptyField && "text-rose-500"
                }`}
              />
              <input
                type="number"
                className={`relative outline-none bg-white px-3 py-2 ring-2 ring-blue-200 focus:ring-blue-400 rounded-md pl-10 w-30 sm:w-fit mt-3/2 ${
                  emptyField && "ring-rose-500"
                } placeholder:text-slate-300`}
                value={manualIdCheckIn}
                onChange={(e) => {
                  setManualIdCheckIn(e.target.value);
                  setEmptyField(false);
                }}
                placeholder="1234"
              />
            </div>
          </div>
          <button
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors mt-5.5 ml-4 disabled:cursor-not-allowed"
            onClick={handleManualCheckIn}
            disabled={showHoliday?.isHoliday}
          >
            ส่งข้อมูล
          </button>
        </div>
      </div>
    </main>
  );
}

export default AttendanceCheckPage;
