import React, { useEffect, useMemo, useState } from "react";
import Day from "../date-time/day";

function StatisticsPage({ data }) {
  // หน้าสถิติ
  const [DataStudent, setDataStudent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const req_students = await fetch("/api/studentManagement");
      const data_student = await req_students.json();
      setDataStudent({ student: [data_student.message] });
      console.log("ข้อมูลที่ได้จาก API:", data_student.message); // 2
      console.log("result.message:", DataStudent.student); // 3
      const req_attendance = await fetch("/api/scanAttendance");
      if (req_attendance.status === 204) return;
      const data_attendance = await req_attendance.json();
      console.log("ข้อมูลที่ได้จาก API:", data_attendance.message);
      const attendance = {
        comeDays: 0,
        lateDays: 0,
        leaveDays: 0,
        absentDays: 0,
      };
      for (const value of data_attendance.message) {
        if (value.status === "มา") attendance.comeDays += 1;
        else if (value.status === "ลา") attendance.leaveDays += 1;
        else if (value.status === "สาย") attendance.lateDays += 1;
        else if (value.status === "ขาด") attendance.absentDays += 1;
      }
      setDataStudent((prev) => ({ ...prev, attendance }));
      console.log("result.message:", DataStudent.attendance); // 3
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(DataStudent);
  if (loading) return <p>กำลังโหลด...</p>;
  return (
    // หน้าสถิติ

    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            สถิติการเข้าร่วมกิจกรรมหน้าเสาธง
          </h2>
          <p className="text-blue-500">
            <Day />
          </p>
        </div>

        {/* สถิติรวม */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {DataStudent.attendance ? DataStudent.attendance.comeDays : "กำลังโหลด"}
            </div>
            <div className="text-blue-700 font-medium">นักเรียนทั้งหมด</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {loading ? "กำลังโหลด" : DataStudent.attendance.comeDays}
            </div>
            <div className="text-green-700 font-medium">มาเรียนวันนี้</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {loading ? "กำลังโหลด" : DataStudent.attendance.lateDays}
            </div>
            <div className="text-yellow-700 font-medium">มาสายวันนี้</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {loading ? "กำลังโหลด" : DataStudent.attendance.absentDays}
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
