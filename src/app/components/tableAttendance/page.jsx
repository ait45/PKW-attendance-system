"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BookUser, RefreshCcw } from "lucide-react";
import Swal from "sweetalert2";
import CurrentDay from '../date-time/day';

function tableAttendance({ session }) {
  const now = new Date();
  const [DataStudentAttendance, setDataStudentAttendance] = useState([]);
  const [DataStudent, setDataStudent] = useState([]);
  const [stateSelectDisable, setStateSelectDisable] = useState(false);
  const [selectClasses, setSelectClasses] = useState("ทั้งหมด");
  const [overTimeEditState, setOverTimeEditState] = useState(false);

  const classes = [
    { label: "มัธยมศึกษาปีที่ 1", val: 0 },
    { label: "มัธยมศึกษาปีที่ 2", val: 1 },
    { label: "มัธยมศึกษาปีที่ 3", val: 2 },
    { label: "มัธยมศึกษาปีที่ 4", val: 3 },
    { label: "มัธยมศึกษาปีที่ 5", val: 4 },
    { label: "มัธยมศึกษาปีที่ 6", val: 5 },
    { label: "ทั้งหมด", val: 6 },
  ];

  const fetchDataAttendance = async () => {
    try {
      const req = await fetch("/api/scanAttendance");
      if (req.status === 204) return null;
      const data = await req.json();
      setDataStudentAttendance(data.message);
      //console.log(DataStudentAttendance);
    } catch (error) {
      console.log(error);
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    }
  };
  const fetchDataSetting = async () => {
    try {
      const req = await fetch("/api/setting");
      if (req.status === 204) return null;
      const data = await req.json();
      return data.data;
    } catch (error) {
      console.log(error);
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    }
  };
  useEffect(() => {
    const fetchDataStudent = async () => {
      try {
        const req = await fetch("/api/studentManagement");
        const data = await req.json();
        setDataStudent(data.message);
        //console.log(DataStudent);
      } catch (error) {
        console.log(error);
        Swal.fire("เกิดข้อผิดพลาด", "", "error");
      }
    };
    fetchDataAttendance();
    fetchDataStudent();
    fetchDataSetting();
    checkTimeOut_Edit();
    if (session?.user?.role !== "teacher" && session?.user?.isAdmin === false)
      setStateSelectDisable(true);
  }, []);
  const checkTimeOut_Edit = async () => {
    const setting = await fetchDataSetting();
    const [h, m] = setting.absentThreshold.split(":").map(Number);
    const timeCutoff = new Date();
    timeCutoff.setHours(h, m, 0, 0);
    if (now > timeCutoff) {
      if (session?.user?.role === "teacher" && session?.user?.isAdmin === true)
        return;
      setStateSelectDisable(true);
      setOverTimeEditState(true);
    }
  };
  const filteredStudentSelected = useMemo(() => {
    const students =
      selectClasses === "ทั้งหมด"
        ? DataStudent
        : DataStudent.filter((s) => s.classes === selectClasses);

    if (DataStudentAttendance.length < 1) {
      setStateSelectDisable(true);
      return students.map((student) => {
        const { studentId, name, classes } = student;
        return {
          studentId: studentId,
          name: name,
          classes: classes,
          status: "ยังไม่เช็คชื่อ",
        };
      });
    } else {
      setStateSelectDisable(false);
      return students.map((student) => {
        const attendance = DataStudentAttendance.find(
          (a) => a.studentId === student.studentId
        );

        return {
          ...student,
          status: attendance ? attendance.status : "ยังไม่เช็คชื่อ",
        };
      });
    }
  }, [DataStudent, selectClasses, DataStudentAttendance]);
  const [dataUpdate, setDataUpdate] = useState([]);

  function handleStatusChange(inputId, newStatus) {
    setDataUpdate((prev) => {
      const data = DataStudentAttendance.find((d) => d.studentId === inputId);
      return [...prev, { _id: data._id, status: newStatus }];
    });
    setDataStudentAttendance((prev) => {
      const exists = prev.find((d) => d.studentId === inputId);
      if (exists) {
        return prev.map((d) =>
          d.studentId === inputId ? { ...d, status: newStatus } : d
        );
      }
    });
  }
  const handleUpdate = async () => {
    if (dataUpdate.length === 0) return;
    try {
      const req = await fetch("/api/scanAttendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUpdate),
      });
      if (req.ok) {
        Swal.fire({
          title: "อัพเดตข้อมูลสำเร็จ",
          icon: "success",
          timer: 2000,
        });
        setDataUpdate([]);
        fetchDataAttendance();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", error, "error");
    }
  };
  return (
    <main className="bg-white h-auto  max-w-7xl mx-auto p-4 rounded-md">
      <div className="bg-gary-50 rounded-lg p-4 shadow-md">
        <header>
          <div className="flex">
            <BookUser size={30} className="text-[#009EA3] mr-2" />
            <h1 className="text-2xl font-bold">ตารางแสดงการเช็คชื่อgเข้ารวมกิจกรรมหน้าเสาธง</h1>
            {overTimeEditState && (
              <span className="text-red-500 text-sm flex items-end p-2 ">
                * หมดเวลาการแก้ไขข้อมูล กรุณาผู้ดูแลเพื่อดำเนินการ
              </span>
            )}
          </div>
          <div className="date flex m-4 text-[#009EA3]">
            <p>ประจำวันที่ <CurrentDay /></p>
          </div>

          <div className="p-2 grid grid-cols-1 md:grid-cols-2">
            <div className="flex">
              <p className="text-gray-700 p-2 ">ชั้นเรียน</p>
              <select
                className="px-5 outline-none border-b border-[#009EA3] cursor-pointer w-[40%]"
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
            <div className="m-2 flex">
              <button
                className="bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg px-2 py-1 cursor-pointer disabled:cursor-not-allowed"
                onClick={handleUpdate}
                disabled={dataUpdate.length === 0 || overTimeEditState}
              >
                บันทึกการเปลี่ยนแปลง
              </button>

              <button
                className="flex items-center ml-5 cursor-pointer"
                onClick={() => fetchDataAttendance()}
              >
                <RefreshCcw size={20} className="mr-1" />
                refresh
              </button>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-nowrap">
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
                  <tr
                    className="bg-gray-50 text-center text-nowrap"
                    key={value.studentId}
                  >
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
                      <select
                        className="px-2 border-b border-gray-500 outline-none cursor-pointer disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                        value={value.status}
                        onChange={(e) =>
                          handleStatusChange(value.studentId, e.target.value)
                        }
                        disabled={stateSelectDisable || session?.user?.role === "teacher" && session?.user?.isAdmin === false}
                      >
                        <option value="มา">มา</option>
                        <option value="ลา">ลา</option>
                        <option value="สาย">สาย</option>
                        <option value="ขาด">ขาด</option>
                        <option value="ยังไม่เช็คชื่อ" defaultValue>
                          ยังไม่เช็คชื่อ
                        </option>
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
