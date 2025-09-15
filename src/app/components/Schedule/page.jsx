"use client";

import React, { useState } from "react";

// หน้าตารางเรียน
function SchedulePage() {
  const periods = [{ period: "คณิตศาสตร์", time: "8:40-9:30" }];
  const [subjects] = useState([
    "คณิตศาสตร์",
    "ภาษาไทย",
    "ภาษาอังกฤษ",
    "วิทยาศาสตร์",
    "สังคมศึกษา",
    "ประวัติศาสตร์",
  ]);
  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mr-8">ตารางเรียน</h2>
            <select name="scheduleClasses" className="outline-none cursor-pointer">
                <option value="">เลือกชั้นเรียน</option>
            </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3">คาบ/วัน</th>
                <th className="border border-gray-300 px-4 py-3">จันทร์</th>
                <th className="border border-gray-300 px-4 py-3">อังคาร</th>
                <th className="border border-gray-300 px-4 py-3">พุธ</th>
                <th className="border border-gray-300 px-4 py-3">พฤหัสบดี</th>
                <th className="border border-gray-300 px-4 py-3">ศุกร์</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.period}>
                  <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium">
                    คาบ {period.period}
                    <br />
                    <span className="text-sm text-gray-600">{period.time}</span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    คณิตศาสตร์
                  </td>
                  <td className="border border-gray-300 px-4 py-3">ภาษาไทย</td>
                  <td className="border border-gray-300 px-4 py-3">
                    ภาษาอังกฤษ
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    วิทยาศาสตร์
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    สังคมศึกษา
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ข้อมูลครู */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">ครูประจำวิชา</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.slice(0, 6).map((subject, index) => (
              <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">{subject}</div>
                <div className="text-sm text-gray-600">
                  อาจารย์สมศักดิ์ ใจใส
                </div>
                <div className="text-xs text-gray-500">somsak@school.ac.th</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SchedulePage;
