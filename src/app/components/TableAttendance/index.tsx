"use client";
import React, { useEffect, useState, useMemo } from "react";
import { LoaderCircle, Calendar, RefreshCw, SquarePen, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Swal from "sweetalert2";
import CurrentDay from "../date-time/day";
import { SkeletonTable } from "../Skeleton";

interface holiday {
  isHoliday: boolean;
  name?: string;
}
interface DataStudent {
  _id: string;
  studentId: string;
  name: string;
  classes: string;
  phone: string;
  parentPhone: string;
  Number: number;
  plantData: string;
  joinDays: number;
  lateDays: number;
  leaveDays: number;
  adsentDays: number;
  behaviorScore: number;
  event_absent_periods: number;

}

interface DataAttendance {
  HANDLER: string;
  STUDENT_ID: string;
  NAME: string;
  CLASSES: string;
  STATUS: string;
  CREATED_AT: Date;
}
const getStatusColor = (status: string) => {
    switch (status) {
      case "เข้าร่วมกิจกรรม":
        return "bg-emerald-500 text-white";
      case "ลา":
        return "bg-yellow-500 text-white";
      case "สาย":
        return "bg-orange-500 text-white";
      case "ขาด":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };


function TableAttendance({ session }: { session: any }) {
  const now = new Date();
  const [DataStudentAttendance, setDataStudentAttendance] = useState<DataAttendance[]>([]);
  const [DataStudent, setDataStudent] = useState<DataStudent[]>([]);
  const [stateSelectDisable, setStateSelectDisable] = useState<boolean>(false);
  const [selectClasses, setSelectClasses] = useState<string>("ทั้งหมด");
  const [overTimeEditState, setOverTimeEditState] = useState<boolean>(false);
  const [dataHoliday, setDataHolidays] = useState<holiday>({ isHoliday: false, name: "" });
  const [loading, setLoading] = useState<boolean>(false);
  
  // Sorting states
  const [sortBy, setSortBy] = useState<"studentId" | "name" | "classes" | "status">("studentId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
    setLoading(true);
    try {
      const req = await fetch("/api/scanAttendance");
      // กรณีไม่พบข้อมูล (404 หรือ 204) ให้ set เป็น empty array
      if (req.status === 404 || req.status === 204) {
        setDataStudentAttendance([]);
        return;
      }
      const data = await req.json();
      // ตรวจสอบว่า data.message เป็น array ก่อน set
      if (Array.isArray(data.message)) {
        setDataStudentAttendance(data.message);
      } else {
        setDataStudentAttendance([]);
      }
    } catch (error) {
      console.error(error);
      setDataStudentAttendance([]);
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchDataSetting = async () => {
    try {
      const req = await fetch("/api/setting");
      if (req.status === 204) return;
      const data = await req.json();
      return data.data;
    } catch (error: any) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", error, "error");
    }
  };
  const holiday = async () => {
    try {
      const res = await fetch("/api/holidays");
      const data = await res.json();
      setDataHolidays(data);
    } catch (error) {
      console.error(error);
      return;
    }
  };
  const fetchDataStudent = async () => {
      try {
        const req = await fetch("/api/studentManagement");
        const data = await req.json();
        if (data.payload.lenght < 1) return;
        setDataStudent(data.payload);
        //console.log(DataStudent);
      } catch (error: any) {
        console.log(error);
        Swal.fire("เกิดข้อผิดพลาด", error, "error");
      }
    };
  useEffect(() => {
    
    fetchDataAttendance();
    fetchDataStudent();
    fetchDataSetting();
    checkTimeOut_Edit();
    holiday();

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
  // Handle sorting
  const handleSort = (column: "studentId" | "name" | "classes" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown size={14} className="ml-1 text-slate-400" />;
    return sortOrder === "asc" 
      ? <ArrowUp size={14} className="ml-1 text-blue-600" />
      : <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  const filteredStudentSelected = useMemo(() => {
    const students =
      selectClasses === "ทั้งหมด"
        ? DataStudent
        : DataStudent.filter((s: any) => s.classes === selectClasses);
    if (!DataStudentAttendance) {
      //setStateSelectDisable(true);

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
      if (students.length === 0) return null;
      const mappedStudents = students.map((student: any) => {
        const attendance: any = DataStudentAttendance.find(
          (a: any) => a.studentId === student.studentId
        );

        return {
          ...student,
          status: attendance ? attendance.status : "ยังไม่เช็คชื่อ",
        };
      });

      // Apply sorting
      return [...mappedStudents].sort((a, b) => {
        const aValue = String(a[sortBy] ?? "");
        const bValue = String(b[sortBy] ?? "");
        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue, "th");
        }
        return bValue.localeCompare(aValue, "th");
      });
    }
  }, [DataStudent, selectClasses, DataStudentAttendance, sortBy, sortOrder]);
  const [dataUpdate, setDataUpdate] = useState<any[]>([]);
  const [statusUpdate, setStatusUpdate] = useState<boolean>(false);

  /**
   * The function `handleStatusChange` updates the status of a student in the DataStudentAttendance
   * array based on the input student ID and new status.
   */
  function handleStatusChange(inputId: string, newStatus: string) {
    setDataUpdate((prev: any) => {
      // ลบรายการเก่าของ studentId นี้ออกก่อน
      const filtered = prev.filter((item: any) => item.studentId !== inputId);
      
      const data: any = DataStudentAttendance.find((d: any) => d.studentId === inputId);
      if (data) {
        return [
          ...filtered,
          {
            update: true,
            studentId: inputId,
            status: newStatus,
          },
        ];
      }
      const student: any = DataStudent.find((d: any) => d.studentId === inputId);
      return [
        ...filtered,
        {
          update: false,
          studentId: inputId,
          status: newStatus,
          name: student.name,
          classes: student.classes,
        },
      ];
    });
    setDataStudentAttendance((prev: any) => {
      // Ensure prev is always an array
      const currentData = prev ?? [];
      const exists = currentData.find((d: any) => d.studentId === inputId);
      if (exists) {
        return currentData.map((d: any) =>
          d.studentId === inputId ? { ...d, status: newStatus } : d
        );
      }
      // Add new student to attendance array if they don't exist
      const student = DataStudent.find((s: any) => s.studentId === inputId);
      if (student) {
        return [
          ...currentData,
          {
            studentId: inputId,
            name: student.name,
            classes: student.classes,
            status: newStatus,
          },
        ];
      }
      return currentData;
    });
  }
  /**
   * The `handleUpdate` function is an asynchronous function that sends a PUT request to update
   * attendance data, shows a success alert if the request is successful, and handles errors by
   * displaying an error message.
   * @returns If the `dataUpdate` array has a length of 0, the function `handleUpdate` will return
   * early and not execute the rest of the code block.
   */
  const handleUpdate = async () => {
    if (dataUpdate.length === 0) return;
    Swal.fire({
      text: "ยืนยันการบันทึกข้อมูล...",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      icon: "question",
      iconColor: "#009EA3",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setStatusUpdate(true);
        setLoading(true);
        try {
          const req = await fetch("/api/scanAttendance", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataUpdate),
          });
          if (req.ok) {
            Swal.fire({
              text: "อัพเดตข้อมูลสำเร็จ",
              icon: "success",
              timer: 2000,
            });
            setDataUpdate([]);
            fetchDataAttendance();
          }
        } catch (error: any) {
          setStatusUpdate(false);
          setLoading(false);
          Swal.fire("เกิดข้อผิดพลาด", error, "error");

          throw error;
    
        } finally {
          setLoading(false);
          setStatusUpdate(false);
        }
      }
    });
  };

  // Pagination -----------------------------------
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [NumberPager, setNumberPager] = useState(1);

  const totalPages = Math.ceil(
    (filteredStudentSelected?.length ?? 0) / rowsPerPage
  );
  //
  // slice data หน้าปัจจุบัน

  const currentData =
    filteredStudentSelected?.slice(
      (NumberPager - 1) * rowsPerPage,
      NumberPager * rowsPerPage
    ) || [];
  // เปลี่ยนจำนวน row
  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setNumberPager(1);
  };

  return (
    <main className=" h-auto  max-w-7xl mx-auto p-2 rounded-md">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <header>
          <div className="block">
            <div className="flex items-center">
              <div className="bg-[#009EA3] text-slate-50 p-2 rounded-md">
                <SquarePen size={35} />
              </div>
              <div className="ml-1">
                <h1 className="text-lg sm:text-2xl font-bold text-wrap">
                  ตารางแก้ไข
                </h1>
                <h1 className="text-sm">การเช็คชื่อเข้ารวมกิจกรรมหน้าเสาธง</h1>
              </div>
            </div>
            <hr className="text-[#009EA3] my-2" />
            <div className="flex text-xs md:text-sm text-[#009EA3]">
              <Calendar size={16} className="mr-1" />
              <CurrentDay />
            </div>
            {overTimeEditState && (
              <div className="bg-rose-500 border-l-4 border-rose-500 rounded-md mt-2">
                <div className="bg-white p-2 flex flex-col">
                  <span className="text-rose-500 text-xs sm:text-sm">
                    * หมดเวลาการแก้ไขข้อมูล
                  </span>
                  <span className="text-rose-500 text-xs sm:text-sm ml-2">
                    กรุณาติดต่อผู้ดูแลเพื่อดำเนินการ
                  </span>
                </div>
              </div>
            )}
          </div>

          {dataHoliday.isHoliday && (
            <span className="bg-rose-500 border-l-4 border-rose-500 rounded-sm mt-2 flex w-fit">
              <div className="bg-white p-2">
                <p className="text-xs text-red-500 ml-2">
                  * {dataHoliday.name} ไม่ต้องเช็คชื่อ *
                </p>
              </div>
            </span>
          )}

          <div className="p-1/2 mt-4">
            <div className="flex justify-between">
              <div className="flex flex-col mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm text-slate-700">ชั้นเรียน</p>
                <select
                  className="px-2/3 py-1 sm:px-3 sm:py-2 outline-none border border-[#009EA3] rounded-md cursor-pointer text-sm sm:text-base mt-1"
                  value={selectClasses}
                  onChange={(e) => {
                    setSelectClasses(e.target.value);
                    setNumberPager(1);
                  }}
                >
                  {classes.map((room) => (
                    <option key={room.label} value={room.label}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Pagination */}
              <div className="">
                <p className="text-xs">จำนวนแถว</p>
                <select
                  value={rowsPerPage}
                  onChange={handleRowChange}
                  className="px-2 py-1 border border-[#009EA3] rounded-md cursor-pointer text-sm mt-1"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                </select>
              </div>
            </div>
            <div className="m-2 flex justify-between py-4">
              <button
                className={`bg-green-600 hover:bg-green-700 disabled:bg-green-700 transition-colors text-white rounded-md px-3 py-2 ${
                  loading ? "cursor-wait" : "cursor-pointer"
                } disabled:cursor-not-allowed `}
                onClick={handleUpdate}
                disabled={dataUpdate.length === 0 || overTimeEditState}
              >
                <p className="flex items-center">{ statusUpdate && <LoaderCircle className="animate-spin mr-1"/>}บันทึกการเปลี่ยนแปลง</p>
              </button>

              <button
                className={`p-2 cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors rounded-md`}
                onClick={fetchDataAttendance}
              >
                <RefreshCw size={20} className={`${loading && "animate-spin"}`} />
              </button>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-collapse border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-100 text-nowrap">
                <th 
                  className="border border-gray-300 px-4 py-3 w-[20%] cursor-pointer hover:bg-blue-200 transition-colors select-none"
                  onClick={() => handleSort("studentId")}
                >
                  <div className="flex items-center justify-center">
                    เลขประจำตัวนักเรียน
                    {getSortIcon("studentId")}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-3 cursor-pointer hover:bg-blue-200 transition-colors select-none"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center justify-center">
                    ชื่อ-สกุล
                    {getSortIcon("name")}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-3 w-[20%] cursor-pointer hover:bg-blue-200 transition-colors select-none"
                  onClick={() => handleSort("classes")}
                >
                  <div className="flex items-center justify-center">
                    ชั้นเรียน
                    {getSortIcon("classes")}
                  </div>
                </th>
                <th 
                  className="border border-gray-300 px-4 py-3 w-[20%] cursor-pointer hover:bg-blue-200 transition-colors select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-center">
                    สถานะ
                    {getSortIcon("status")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((value) => (
                  <tr
                    className="bg-slate-50 text-center text-nowrap"
                    key={value.studentId}
                  >
                    <td className="border border-slate-300 text-[#009EA3] px-4 py-3">
                      {value.studentId}
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      {value.name}
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      {value.classes}
                    </td>
                    <td className="border border-slate-300 px-4 py-3">
                      <select
                        className={`px-2 py-1 border border-slate-500 focus:border-blue-500 transition-colors rounded-md outline-none cursor-pointer disabled:text-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed ${getStatusColor(value.status)}`}
                        value={value.status}
                        onChange={(e) =>
                          handleStatusChange(value.studentId, e.target.value)
                        }
                        disabled={
                          stateSelectDisable ||
                          (session?.user?.role === "teacher" &&
                            session?.user?.isAdmin === false) ||
                          dataHoliday.isHoliday
                        }
                      >
                        <option value="เข้าร่วมกิจกรรม" className="text-black bg-white">เข้าร่วมกิจกรรม</option>
                        <option value="ลา" className="text-black bg-white">ลา</option>
                        <option value="สาย" className="text-black bg-white">สาย</option>
                        <option value="ขาด" className="text-black bg-white">ขาด</option>
                        <option 
                          value="ยังไม่เช็คชื่อ" 
                          className="text-black bg-white"
                          disabled={value.status !== "ยังไม่เช็คชื่อ"}
                         >
                          ยังไม่เช็คชื่อ
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-slate-50 text-center">
                  <td className="border border-slate-300 px-4 py-3" colSpan={4}>
                    ไม่มีข้อมูลนักเรียน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center text-sm mt-4 mb-4">
            <button
              onClick={() => setNumberPager(NumberPager - 1)}
              disabled={NumberPager === 1}
              className="mr-2 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setNumberPager(page)}
                className={` mr-2 ${
                  page === NumberPager && "bg-blue-400 text-white"
                } outline outline-blue-400 px-2 py-1/2 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors rounded-sm`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setNumberPager(NumberPager + 1)}
              disabled={NumberPager === totalPages}
              className="ml-2 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              ต่อไป
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TableAttendance;
