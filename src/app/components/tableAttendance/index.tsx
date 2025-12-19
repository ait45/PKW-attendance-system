"use client";
import React, { useEffect, useState, useMemo } from "react";
import { BookUser, Calendar, RefreshCcw, SquarePen } from "lucide-react";
import Swal from "sweetalert2";
import CurrentDay from "../date-time/day";

interface holiday {
  isHoliday: boolean;
  name?: string;
}
function TableAttendance({ session }) {
  const now = new Date();
  const [DataStudentAttendance, setDataStudentAttendance] = useState([]);
  const [DataStudent, setDataStudent] = useState([]);
  const [stateSelectDisable, setStateSelectDisable] = useState<Partial<boolean>>(false);
  const [selectClasses, setSelectClasses] = useState<Partial<string>>("ทั้งหมด");
  const [overTimeEditState, setOverTimeEditState] = useState(false);
  const [dataHoliday, setDataHolidays] = useState<Partial<holiday>>({});
  const [loading, setLoading] = useState(false);

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
      if (req.status === 204) return;
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
      if (req.status === 204) return;
      const data = await req.json();
      return data.data;
    } catch (error) {
      console.log(error);
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
  useEffect(() => {
    const fetchDataStudent = async () => {
      try {
        const req = await fetch("/api/studentManagement");
        const data = await req.json();
        if (data.payload.lenght < 1) return;
        setDataStudent(data.payload);
        //console.log(DataStudent);
      } catch (error) {
        console.log(error);
        Swal.fire("เกิดข้อผิดพลาด", error, "error");
      }
    };
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
  const filteredStudentSelected = useMemo(() => {
    const students =
      selectClasses === "ทั้งหมด"
        ? DataStudent
        : DataStudent.filter((s) => s.classes === selectClasses);
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

  /**
   * The function `handleStatusChange` updates the status of a student in the DataStudentAttendance
   * array based on the input student ID and new status.
   */
  function handleStatusChange(inputId, newStatus) {
    setDataUpdate((prev) => {
      const data = DataStudentAttendance.find((d) => d.studentId === inputId);
      if (data) {
        return [
          ...prev,
          {
            update: true,
            _id: data._id,
            studentId: inputId,
            status: newStatus,
          },
        ];
      }
      const student = DataStudent.find((d) => d.studentId === inputId);
      return [
        ...prev,
        {
          update: false,
          studentId: inputId,
          status: newStatus,
          name: student.name,
          classes: student.classes,
        },
      ];
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
  /**
   * The `handleUpdate` function is an asynchronous function that sends a PUT request to update
   * attendance data, shows a success alert if the request is successful, and handles errors by
   * displaying an error message.
   * @returns If the `dataUpdate` array has a length of 0, the function `handleUpdate` will return
   * early and not execute the rest of the code block.
   */
  const handleUpdate = async () => {
    if (dataUpdate.length === 0) return;
    document.body.classList.add("loading");
    setLoading(true);
    Swal.fire({
      text: "ยืนยันการบันทึกข้อมูล...",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      icon: "question",
      iconColor: "#009EA3",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
        } catch (error) {
          document.body.classList.remove("loading");
          setLoading(false);
          console.error(error);
          Swal.fire("เกิดข้อผิดพลาด", error, "error");
        } finally {
          setLoading(false);
          document.body.classList.remove("loading");
        }
      } else if (result.isDismissed) {
        setLoading(false);
        document.body.classList.remove("loading");
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
  const handleRowChange = (e) => {
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
                  className="px-2/3 py-1 outline-none border border-[#009EA3] rounded-md cursor-pointer text-sm sm:text-base w-fit mt-1"
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
            <div className="m-2 flex">
              <button
                className={`bg-green-600 hover:bg-green-700 disabled:bg-green-700 transition-colors text-white rounded-md px-3 py-2 ${
                  loading ? "cursor-wait" : "cursor-pointer"
                } disabled:cursor-not-allowed `}
                onClick={handleUpdate}
                disabled={dataUpdate.length === 0 || overTimeEditState}
              >
                <p className="hidden sm:inline">บันทึกการเปลี่ยนแปลง</p>
                <p className="sm:hidden">บันทึก</p>
              </button>

              <button
                className={`flex items-center ml-5 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors`}
                onClick={async () => {
                  try {
                    Swal.fire({
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });
                    setTimeout(async () => {
                      await fetchDataAttendance();
                      Swal.close();
                    }, 500);
                  } catch (error) {
                    Swal.close();
                  }
                }}
              >
                <RefreshCcw size={20} className="mr-1" />
                <p className="text-xs sm:text-s">รีเฟรช</p>
              </button>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-collapse border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-100 text-nowrap">
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
                        className="px-2 border border-slate-500 focus:border-blue-500 transition-colors rounded-md outline-none cursor-pointer disabled:text-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed"
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
                        <option value="เข้าร่วมกิจกรรม">เข้าร่วมกิจกรรม</option>
                        <option value="ลา">ลา</option>
                        <option value="สาย">สาย</option>
                        <option value="ขาด">ขาด</option>
                        <option value="ยังไม่เช็คชื่อ">
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
          <div className="flex items-center text-sm mt-2 mb-4">
            <button
              onClick={() => setNumberPager(NumberPager - 1)}
              disabled={NumberPager === 1}
              className="mr-3 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setNumberPager(page)}
                className={` mr-3 ${
                  page === NumberPager && "bg-blue-400 text-white"
                } outline outline-blue-400 px-3 py-1/2 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors rounded-sm`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setNumberPager(NumberPager + 1)}
              disabled={NumberPager === totalPages}
              className="ml-3 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TableAttendance;
