import React from "react";

function StatisticsPage() {
  // หน้าสถิติ
  const totalStudents = 18;
  const todayRecords = 10;
  const presentToday = 10;
  const lateToday = 10;
  const absentToday = 10;
  const classes = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  const date = new Date();
  const day = date.getDay();
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const year = date.getFullYear() + 543;

  return (
    // หน้าสถิติ

    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            สถิติการเข้าเรียน
          </h2>
          <p className="text-blue-500">
            วันที่ {day} {months[date.getMonth()]} พ.ศ. {year}
          </p>
        </div>

        {/* สถิติรวม */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalStudents}
            </div>
            <div className="text-blue-700 font-medium">นักเรียนทั้งหมด</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {presentToday}
            </div>
            <div className="text-green-700 font-medium">มาเรียนวันนี้</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {lateToday}
            </div>
            <div className="text-yellow-700 font-medium">มาสายวันนี้</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {absentToday}
            </div>
            <div className="text-red-700 font-medium">ขาดเรียนวันนี้</div>
          </div>
        </div>

        {/* อัตราการเข้าเรียนตามห้อง */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            อัตราการเข้าเรียนตามห้อง
          </h3>
          <div className="space-y-3"></div>
        </div>

        {/* นักเรียนที่มาสายบ่อย */}
        <div>
          <h3 className="text-lg font-semibold mb-4">นักเรียนที่ต้องติดตาม</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">รหัสนักเรียน</th>
                  <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 text-left">ห้องเรียน</th>
                  <th className="px-4 py-3 text-left">จำนวนครั้งที่มาสาย</th>
                  <th className="px-4 py-3 text-left">จำนวนครั้งที่ขาด</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
