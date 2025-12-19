"use client";

import React, { useEffect, useMemo, useState } from "react";
import Day from "../date-time/day";
import {
  ChartColumnBig,
  BookOpen,
  Clock,
  Calendar,
  Users,
  CircleCheck,
  XCircle,
  CircleAlert,
} from "lucide-react";

function Dashboard() {
  // หน้าสถิติ
  const [DataStudent, setDataStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [student_danger, setStudent_danger] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const req_students = await fetch("/api/studentManagement", {
        method: "GET",
      });
      const data_student = await req_students.json();
      setDataStudent({ student: data_student.payload });
      const array_data_student = data_student.payload || [];
      console.log(array_data_student);
      const data_student_danger = array_data_student.filter(
        (i) => i.BEHAVIOR_SCORE < 65
      );
      setStudent_danger(data_student_danger);
      const req_attendance = await fetch("/api/scanAttendance", {
        method: "GET",
        credentials: "include",
      });
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
    <main className="w-full p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mt-8">
        <div className="mb-6">
          <header className="flex items-start sm:items-center mr-2">
            <div className="p-3 bg-[#009EA3] text-white rounded-md mb-2 mr-2">
              <ChartColumnBig size={32} />
            </div>
            <div>
              <h2 className="text-md sm:text-2xl font-bold text-slate-800 text-wrep">
                กิจกรรมหน้าเสาธง
              </h2>
              <p className="flex items-center text-slate-500 text-xs sm:text-sm text-nowrap">
                <Calendar size={14} className="mr-1" />
                <Day />
              </p>
            </div>
          </header>
        </div>

        {/* สถิติรวม */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="relative bg-blue-50 p-6 rounded-lg text-center">
            <div className="absolute overflow-hidden z-10">
              <Users
                size={84}
                className="transform translate-x-[-25px] text-blue-200/50"
              />
            </div>
            <div className="relative z-50">
              <div className=" text-3xl font-bold text-blue-600 mb-2 ">
                {DataStudent
                  ? Object.keys(DataStudent.student).length
                  : "กำลังโหลด"}
              </div>
              <div className="text-blue-700 font-medium">นักเรียนทั้งหมด</div>
            </div>
          </div>
          <div className="relative bg-emerald-50 p-6 rounded-lg text-center">
            <div className="absolute  z-10 overflow-hidden">
              <CircleCheck
                size={84}
                className="transform translate-x-[-25px] text-emerald-200/50"
              />
            </div>
            <div className="relative z-50">
              <div className=" text-3xl font-bold text-emerald-600 mb-2">
                {DataStudent?.attendance?.comeDays
                  ? DataStudent.attendance.comeDays
                  : 0}
              </div>
              <p className="text-green-700 font-medium">เข้าร่วม</p>
            </div>
          </div>

          <div className="relative bg-amber-50 p-6 rounded-lg text-center">
            <div className="absolute overflow-hidden z-10">
              <Clock
                size={84}
                className=" transform translate-x-[-25px] text-amber-200/50"
              />
            </div>

            <div className="relative z-10">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {DataStudent?.attendance?.lateDays
                  ? DataStudent.attendnce.lateDays
                  : 0}
              </div>
              <p className="text-yellow-700 font-medium">สาย</p>
            </div>
          </div>
          <div className="relative bg-rose-50 p-6 rounded-lg text-center">
            <div className="absolute overflow-hidden z-50">
              <XCircle
                size={84}
                className="transform translate-x-[-25px] text-rose-200/50"
              />
            </div>
            <div className="relative z-50">
              <div className="text-3xl font-bold text-rose-600 mb-2">
                {DataStudent?.attendance?.absentDays
                  ? DataStudent.attendance.absentDays
                  : 0}
              </div>
              <p className="text-red-700 font-medium">ไม่เข้าร่วม</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        {/* นักเรียนที่มาสายบ่อย */}
        <div>
          <h3 className="flex items-center text-md sm:text-lg font-semibold mb-4">
            <div className="bg-rose-500 text-white p-2 rounded w-fit">
              <CircleAlert size={32} />
            </div>
            <div className="ml-2">
              <p>รายชื่อนักเรียนที่ต้องติดตาม </p>
              <p className="text-rose-600 text-xs">*คนที่มีคะแนนต่ำกว่า 60</p>
            </div>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm sm:text-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 text-left text-nowrap bg-slate-300">
                    รหัสนักเรียน
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-slate-300">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-slate-300">
                    ห้องเรียน
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-yellow-300">
                    จำนวนครั้งที่มาสาย
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-red-300">
                    จำนวนครั้งที่ขาด
                  </th>
                  <th className="px-4 py-3 text-left text-nowrap bg-indigo-400">
                    คะแนนคงเหลือ
                  </th>
                </tr>
              </thead>
              <tbody>
                {student_danger.length > 0 ? (
                  student_danger.map((value, index) => (
                    <tr className={`bg-slate-50 m-2`} key={index}>
                      <td className="px-4 py-3 text-center text-sm text-[#009EA3]">
                        {value.studentId}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-nowrap">
                        {value.name}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-nowrap">
                        {value.classes}
                      </td>
                      <td className="px-4 py-3 text-right text-md bg-amber-100">
                        {value.lateDays}
                      </td>
                      <td className="px-4 py-3 text-right text-md bg-rose-100">
                        {value.absentDays}
                      </td>
                      <td
                        className={`px-4 py-3 text-right text-md bg-indigo-200 ${
                          value.behaviorScore < 0 ? "text-rose-600" : ""
                        }`}
                      >
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
