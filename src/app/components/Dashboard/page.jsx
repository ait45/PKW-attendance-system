import React, { useEffect, useMemo, useState } from "react";
import Day from "../date-time/day";
import { ChartColumnBig, BookOpen } from "lucide-react";

function Dashboard({ session }) {
  // หน้าสถิติ
  const [DataStudent, setDataStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [student_danger, setStudent_danger] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const req_students = await fetch("/api/studentManagement");
      const data_student = await req_students.json();
      setDataStudent({ student: data_student.message });
      const array_data_student = data_student.message;
      const data_student_danger = array_data_student.filter(
        (i) => i.behaviorScore < 65
      );
      setStudent_danger(data_student_danger);
      const req_attendance = await fetch("/api/scanAttendance");
      if (req_attendance.status === 204) return;
      const data_attendance = await req_attendance.json();
      const attendance = {
        comeDays: 0,
        lateDays: 0,
        leaveDays: 0,
        absentDays: 0,
      };
      for (const value of data_attendance.message) {
        if (value.status === "เข้าร่วมกิจกรรม") attendance.comeDays += 1;
        else if (value.status === "ลา") attendance.leaveDays += 1;
        else if (value.status === "สาย") attendance.lateDays += 1;
        else if (value.status === "ขาด") attendance.absentDays += 1;
      }

      setDataStudent((prev) => ({ ...prev, attendance }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading)
    return (
      <p className="flex justify-center items-center text-gray-500 ">
        กำลังโหลด....
      </p>
    );
  return (
    // หน้าสถิติ

    <main className="max-w-7xl p-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <header className="flex items-start sm:items-center mr-2">
            <ChartColumnBig className="mr-2"/>
            <h2 className="text-md sm:text-2xl font-bold text-gray-800 text-wrep">
              กิจกรรมหน้าเสาธง
            </h2>
          </header>

          <p className="text-blue-500 text-xs sm:text-base">
            <Day />
          </p>
        </div>

        {/* สถิติรวม */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Object.keys(DataStudent.student).length}
            </div>
            <div className="text-blue-700 font-medium">นักเรียนทั้งหมด</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {DataStudent?.attendance?.comeDays
                ? DataStudent.attendance.comeDays
                : 0}
            </div>
            <div className="text-green-700 font-medium">เข้าร่วม</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {DataStudent?.attendance?.lateDays
                ? DataStudent.attendance.lateDays
                : 0}
            </div>
            <div className="text-yellow-700 font-medium">สาย</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {DataStudent?.attendance?.absentDays
                ? DataStudent.attendance.absentDays
                : 0}
            </div>
            <div className="text-red-700 font-medium">ไม่เข้าร่วม</div>
          </div>
        </div>

        {/* นักเรียนที่มาสายบ่อย */}
        <div>
          <h3 className="block sm:flex sm:items-center text-md sm:text-lg font-semibold mb-4">
            นักเรียนที่ต้องติดตาม{" "}
            <p className="text-red-600 text-xs m-2">*คนที่มีคะแนนต่ำกว่า 60</p>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm sm:text-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 text-left text-nowrap">
                    รหัสนักเรียน
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap">ห้องเรียน</th>
                  <th className="px-4 py-3 text-left text-nowrap bg-yellow-300">
                    จำนวนครั้งที่มาสาย
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-red-300">
                    จำนวนครั้งที่ขาด
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-gray-300">
                    คะแนนคงเหลือ
                  </th>
                </tr>
              </thead>
              <tbody>
                {student_danger.length > 0 ? (
                  student_danger.map((value, index) => (
                    <tr className={`bg-gray-50 m-2`} key={index}>
                      <td className="px-4 py-3 text-center text-sm">
                        {value.studentId}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-nowrap">
                        {value.name}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-nowrap">
                        {value.classes}
                      </td>
                      <td className="px-4 py-3 text-right text-md bg-yellow-100">
                        {value.lateDays}
                      </td>
                      <td className="px-4 py-3 text-right text-md bg-red-100">
                        {value.absentDays}
                      </td>
                      <td className="px-4 py-3 text-right text-md bg-gray-200">
                        {value.behaviorScore}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={5}>
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </main>
  );
}

export default Dashboard;
