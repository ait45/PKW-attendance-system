"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BookUser } from "lucide-react";
import Swal from "sweetalert2";
function tableAttendance() {
  const currentDate = useState(new Date().toLocaleDateString("th-TH"));
  const [DataStudentAttendance, setDataStudentAttendance] = useState([]);
  const [DataStudent, setDataStudent] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [selectClasses, setSelectClasses] = useState("");
  const classes = [
    { label: "มัธยมศึกษาปีที่ 1", val: 0 },
    { label: "มัธยมศึกษาปีที่ 2", val: 1 },
    { label: "มัธยมศึกษาปีที่ 3", val: 2 },
    { label: "มัธยมศึกษาปีที่ 4", val: 3 },
    { label: "มัธยมศึกษาปีที่ 5", val: 4 },
    { label: "มัธยมศึกษาปีที่ 6", val: 5 },
    { label: "ทั้งหมด", val: 6 },
  ];
  const choiceAttendance = [
    { label: "ยังไม่เช็คชื่อ", val: "ยังไม่เช็คชื่อ" },
    { label: "มา", val: "มา" },
    { label: "ลา", val: "ลา" },
    { label: "สาย", val: "สาย" },
  ];

  useEffect(() => {
    const fetchDataStudent = async () => {
      try {
        const req = await fetch("/api/studentManagement");
        const data = await req.json();
        setDataStudent(data.message);
      } catch (error) {
        console.log(error);
        Swal.fire("เกิดข้อผิดพลาด", "", "error");
      }
    };
    const fetchDataAttendance = async () => {
      try {
        const req = await fetch("/api/scanAttendance");
        const data = await req.json();
        setDataStudentAttendance(data.message);
      } catch (error) {
        console.log(error);
        Swal.fire("เกิดข้อผิดพลาด", "", "error");
      }
    };
    fetchDataAttendance();
    fetchDataStudent();
  }, []);
  const Today = new Date().toLocaleDateString("th-TH");
  const convertToday = (date) => {
    return new Date(date);
  };
  const filteredStudentSelected = useMemo(() => {
    if (selectClasses === "ทั้งหมด") return DataStudent;
    return DataStudent.filter((s) => s.classes === selectClasses);
  }, [DataStudent, selectClasses]);

  const showDataAtttendanceToday = async () => {
    
  };
  const handleSubmitSelectClasses = () => {};
  return (
    <main className="bg-white h-auto max-w-5xl mx-auto p-4 rounded-md">
      <div className="bg-gary-50 rounded-lg p-4 shadow-md">
        <header className="">
          <div className="flex">
            <BookUser size={30} className="text-[#009EA3] mr-2" />
            <h1 className="text-2xl font-bold">ตารางแสดงการเช็คชื่อ</h1>
          </div>

          <div className="p-2 flex items-center">
            <p className="text-gray-700 p-2">กรุณาเลือกชั้นเรียน</p>
            <select
              id="classesSelect"
              className="px-5 outline-none border-b border-[#009EA3]"
              value={selectClasses}
              onChange={(e) => setSelectClasses(e.target.value)}
            >
              {classes.map((room) => (
                <option key={room.label} value={room.label}>
                  {room.label}
                </option>
              ))}
            </select>

            
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 w-[20%]">
                  เลขประจำตัวนักเรียน
                </th>
                <th className="border border-gray-300 px-4 py-3">ชื่อ-สกุล</th>
                <th className="border border-gray-300 px-4 py-3 w-[20%]">
                  ชั้นเรียน
                </th>
                <th className="border border-gray-300 px-4 py-3 w-[20%]">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudentSelected.length > 0 ? (
                filteredStudentSelected.map((value) => (
                  <tr className="bg-gray-50 text-center" key={value.studentId}>
                    <td className="border border-gray-300 px-4 py-3">
                      {value.studentId}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {value.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {value.classes}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <select className="px-2 border-b border-gray-500 outline-none">
                        {choiceAttendance.map((index) => (
                          <option value={index.val} key={index.val}>
                            {index.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-gray-50 text-center">
                  <td className="border border-gray-300 px-4 py-3" colSpan={4}>
                    ไม่มีข้อมูลนักเรียน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default tableAttendance;
