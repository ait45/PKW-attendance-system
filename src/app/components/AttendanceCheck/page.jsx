import { useEffect, useState } from "react";
import QRScanning from "../QRScanning/page";
import { UserRoundCheck } from "lucide-react";
import ShowAlert from "../Sweetalert";

// หน้าเช็คชื่อ
function AttendanceCheckPage({ session }) {
  const [qrData, setQrdata] = useState("");

  const [showHoliday, setShowHoliday] = useState({});

  const getHoliday = async () => {
    if (Object.keys(showHoliday).length > 0) return;
    const req = await fetch("/api/holidays");
    const data = await req.json();
    setShowHoliday(data);
  };
  getHoliday();
  const attendance = async (id) => {
    document.body.classList.add("loading");
    try {
      const req = await fetch("/api/scanAttendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, handler: session?.user?.name }),
      });
      const res = await req.json();
      if (req.status === 400)
        return ShowAlert({ text: res.message, icon: "error" });
      if (res.success) {
        return ShowAlert({ title: "เช็คชื่อสำเร็จ", icon: "success" });
      }
      ShowAlert({ title: "เกิดข้อผิดพลาด", text: res.message, icon: "error" });
    } catch (error) {
      document.body.classList.remove("loading");
      console.log(error);
      ShowAlert({ title: "เกิดข้อผิดพลาด", text: error, icon: "error" });
    } finally {
      document.body.classList.remove("loading");
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
      <div className="mb-6">
        <div className="flex items-center justify-center mb-2">
          <UserRoundCheck width={30} height={30} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-800 text-center ml-2">
            เช็คชื่อนักเรียน
          </h2>
        </div>
        {showHoliday.isHoliday && (
          <p className="text-xs text-red-500 text-center mb-4">
            * {showHoliday.name} ไม่ต้องเช็คชื่อ *
          </p>
        )}
      </div>

      <div className="text-center mb-4">
        <QRScanning
          onScan={(value) => setQrdata(value)}
          holiday={showHoliday.isHoliday}
        />
      </div>
    </main>
  );
}

export default AttendanceCheckPage;
