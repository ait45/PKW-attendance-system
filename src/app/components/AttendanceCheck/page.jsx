import { useEffect, useState } from "react";
import QRScanning from "../QRScanning/page";
import { UserRoundCheck } from "lucide-react";
import Swal from "sweetalert2";



// หน้าเช็คชื่อ
function AttendanceCheckPage({ session }) {
  const [qrData, setQrdata] = useState("");

  const attendance = async (id) => {
    try {
      const req = await fetch("/api/scanAttendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const res = await req.json();
      if (res.success) {
        return Swal.fire({
          title: "เช็คชื่อสำเร็จ",
          timer: 2000,
          icon: "success",
          showConfirmButton: true,
        });
      }
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: res.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error,
        icon: "error",
        timer: 2000,
        showConfirmButton: true,
      });
    }
  };
  useEffect(() => {
    if (qrData) {
      attendance(qrData.id);
      setQrdata("");
    }
  });

  return (
  
      <main className="bg-white rounded-lg shadow-lg p-4 mb-7 max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <UserRoundCheck width={30} height={30} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-800 text-center ml-2">
            เช็คชื่อนักเรียน
          </h2>
        </div>
        <div className="text-center mb-4">
          <QRScanning onScan={(value) => setQrdata(value)} />
        </div>
      </main>
  );
}

export default AttendanceCheckPage;
