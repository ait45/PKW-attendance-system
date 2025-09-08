import { useEffect, useState } from "react";
import QRScanning from "../QRScanning/page";
import { UserRoundCheck } from "lucide-react";

// หน้าเช็คชื่อ
function AttendanceCheckPage() {
  const [qrData, setQrdata] = useState("");
  const [selectedClass, setSelectedClass] = useState("ม.1");
  const [selectedSubject, setSelectedSubject] = useState("คณิตศาสตร์");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [classes] = useState(["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"]);
  const [subjects] = useState([
    "คณิตศาสตร์",
    "ภาษาไทย",
    "ภาษาอังกฤษ",
    "วิทยาศาสตร์",
    "สังคมศึกษา",
    "ประวัติศาสตร์",
  ]);
  
  const [periods] = useState([
    { period: 1, time: "08:40-09:30" },
    { period: 2, time: "09:30-10:20" },
    { period: 3, time: "10:20-11:10" },
    { period: 4, time: "11:10-12:00" },
    { period: 5, time: "13:00-13:50" },
    { period: 6, time: "13:50-14:40" },
    { period: 7, time: "14:40-15:30" },
  ]);
  useEffect(() => {
    if (qrData) {
      alert(qrData);
      setQrdata("");
    }
  },);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <UserRoundCheck width={30} height={30} />
          <h2 className="text-2xl font-bold text-gray-800 text-center ml-2">
            เช็คชื่อนักเรียน
          </h2>
        </div>

        {/* ตั้งค่าการเช็คชื่อ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องเรียน
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วิชา
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              คาบเรียน
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((p) => (
                <option key={p.period} value={p.period}>
                  คาบ {p.period} ({p.time})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <QRScanning QrCodeData={(value) => setQrdata(value)} />
        </div>
      </div>
    </div>
  );
}

export default AttendanceCheckPage;
