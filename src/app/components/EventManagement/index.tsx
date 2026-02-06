"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CalendarRange,
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import { SkeletonEventManagement } from "@/app/components/Skeleton";

interface Event {
  ID: number;
  NAME: string;
  TYPE: "special_day" | "activity";
  DESCRIPTION: string;
  EVENT_DATE: string;
  START_TIME: string;
  END_TIME: string;
  TARGET_CLASSES: string | null;
  PERIODS: number;
  STATUS: "upcoming" | "active" | "completed";
  CREATED_BY: string;
  CREATED_AT: string;
}

interface NewEvent {
  name: string;
  type: "special_day" | "activity";
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  targetClasses: string;
  periods: number;
}

function EventManagement({ session }: { session: any }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFormUpdate, setIsFormUpdate] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("ทั้งหมด");
  const [filterStatus, setFilterStatus] = useState<string>("ทั้งหมด");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newEvent, setNewEvent] = useState<NewEvent>({
    name: "",
    type: "activity",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    targetClasses: "",
    periods: 1,
  });

  const classes = [
    "มัธยมศึกษาปีที่ 1",
    "มัธยมศึกษาปีที่ 2",
    "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4",
    "มัธยมศึกษาปีที่ 5",
    "มัธยมศึกษาปีที่ 6",
    "ทั้งหมด",
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.message || []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = () => setIsOpenModal(true);

  const closeModal = () => {
    setIsOpenModal(false);
    setIsFormUpdate(false);
    setUpdateId(null);
    setNewEvent({
      name: "",
      type: "activity",
      description: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      targetClasses: "",
      periods: 1,
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newEvent.name) newErrors.name = "กรุณากรอกชื่อกิจกรรม";
    if (!newEvent.eventDate) newErrors.eventDate = "กรุณาเลือกวันที่";
    if (!newEvent.startTime) newErrors.startTime = "กรุณาเลือกเวลาเริ่ม";
    if (!newEvent.endTime) newErrors.endTime = "กรุณาเลือกเวลาสิ้นสุด";
    return newErrors;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }

    Swal.fire({
      title: isFormUpdate ? "ยืนยันการแก้ไข?" : "ยืนยันการสร้างกิจกรรม?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({ didOpen: () => Swal.showLoading() });

          const method = isFormUpdate ? "PUT" : "POST";
          const url = isFormUpdate ? `/api/events/${updateId}` : "/api/events";

          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newEvent,
              createdBy: session?.user?.name || "Unknown",
            }),
          });

          const data = await res.json();
          if (data.success) {
            Swal.fire({
              text: isFormUpdate ? "แก้ไขสำเร็จ!" : "สร้างกิจกรรมสำเร็จ!",
              icon: "success",
              timer: 2000,
            });
            closeModal();
            fetchEvents();
          } else {
            Swal.fire("เกิดข้อผิดพลาด", data.message || "", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง", "error");
        }
      }
    });
  };

  const handleDelete = async (id: number, name: string) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `ลบกิจกรรม: ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ text: "ลบสำเร็จ!", icon: "success", timer: 2000 });
            fetchEvents();
          }
        } catch (error) {
          console.error(error);
          Swal.fire("เกิดข้อผิดพลาด", "", "error");
        }
      }
    });
  };

  const handleEdit = (event: Event) => {
    setIsFormUpdate(true);
    setUpdateId(event.ID);
    setNewEvent({
      name: event.NAME,
      type: event.TYPE,
      description: event.DESCRIPTION || "",
      eventDate: event.EVENT_DATE?.split("T")[0] || "",
      startTime: event.START_TIME || "",
      endTime: event.END_TIME || "",
      targetClasses: event.TARGET_CLASSES || "",
      periods: event.PERIODS || 1,
    });
    setIsOpenModal(true);
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchType =
        filterType === "ทั้งหมด" ||
        (filterType === "กิจกรรม" && event.TYPE === "activity") ||
        (filterType === "วันพิเศษ" && event.TYPE === "special_day");

      const matchStatus =
        filterStatus === "ทั้งหมด" ||
        (filterStatus === "กำลังจะมาถึง" && event.STATUS === "upcoming") ||
        (filterStatus === "กำลังดำเนินการ" && event.STATUS === "active") ||
        (filterStatus === "เสร็จสิ้น" && event.STATUS === "completed");

      return matchType && matchStatus;
    });
  }, [events, filterType, filterStatus]);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const currentData = filteredEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getTypeBadge = (type: string) => {
    if (type === "activity") {
      return (
        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
          กิจกรรม
        </span>
      );
    }
    return (
      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
        วันพิเศษ
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            กำลังจะมาถึง
          </span>
        );
      case "active":
        return (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            กำลังดำเนินการ
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            เสร็จสิ้น
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <SkeletonEventManagement />;
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="bg-[#009EA3] mr-3 p-2 rounded-md text-white">
            <CalendarRange size={28} />
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-bold text-slate-800">
              จัดการกิจกรรม / วันพิเศษ
            </h2>
            <p className="text-xs text-slate-600">
              สร้าง แก้ไข ลบ กิจกรรมและวันพิเศษ
            </p>
          </div>
        </div>
        {/* Filters and Add Button */}
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <p className="text-xs text-slate-500 mb-1">ประเภท</p>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-[#009EA3] rounded-md text-sm cursor-pointer outline-none"
            >
              <option>ทั้งหมด</option>
              <option>กิจกรรม</option>
              <option>วันพิเศษ</option>
            </select>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">สถานะ</p>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-[#009EA3] rounded-md text-sm cursor-pointer outline-none"
            >
              <option>ทั้งหมด</option>
              <option>กำลังจะมาถึง</option>
              <option>กำลังดำเนินการ</option>
              <option>เสร็จสิ้น</option>
            </select>
          </div>

          <button
            onClick={() => {
              setIsFormUpdate(false);
              openModal();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center ml-auto"
          >
            <Plus size={20} className="mr-2" />
            สร้างกิจกรรมใหม่
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-collapse border-gray-300 text-sm">
            <thead>
              <tr className="bg-[#009EA3] text-white text-nowrap">
                <th className="border border-white/20 px-4 py-3">
                  ชื่อกิจกรรม
                </th>
                <th className="border border-white/20 px-4 py-3">ประเภท</th>
                <th className="border border-white/20 px-4 py-3">วันที่</th>
                <th className="border border-white/20 px-4 py-3">เวลา</th>
                <th className="border border-white/20 px-4 py-3">ชั้นเรียน</th>
                <th className="border border-white/20 px-4 py-3">จำนวนคาบ</th>
                <th className="border border-white/20 px-4 py-3">สถานะ</th>
                <th className="border border-white/20 px-4 py-3">ผู้สร้าง</th>
                <th className="border border-white/20 px-4 py-3">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((event) => (
                  <tr
                    key={event.ID}
                    className="bg-slate-50 text-center hover:bg-slate-100"
                  >
                    <td className="border border-slate-200 px-4 py-3 text-left">
                      {event.NAME}
                    </td>
                    <td className="border border-slate-200 px-4 py-3">
                      {getTypeBadge(event.TYPE)}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {formatDate(event.EVENT_DATE)}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {event.START_TIME && event.END_TIME
                        ? `${event.START_TIME} - ${event.END_TIME}`
                        : "-"}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {event.TARGET_CLASSES || "ทุกชั้น"}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {event.PERIODS || 1} คาบ
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {getStatusBadge(event.STATUS)}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-nowrap">
                      {event.CREATED_BY}
                    </td>
                    <td className="border border-slate-200 px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.ID, event.NAME)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="border border-slate-200 px-4 py-8 text-center text-gray-500"
                  >
                    ไม่มีข้อมูลกิจกรรม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs sm:text-sm text-slate-500">
            แสดง {(currentPage - 1) * rowsPerPage + 1} -{" "}
            {Math.min(currentPage * rowsPerPage, filteredEvents.length)} จาก{" "}
            {filteredEvents.length} รายการ
          </p>
          <span className="inline sm:hidden">|</span>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-100 text-xs sm:text-sm text-nowrap"
            >
              ก่อนหน้า
            </button>
            <span className="px-1 sm:px-2 py-1 text-xs sm:text-sm">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className=" disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-100 text-xs sm:text-sm text-nowrap"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-scroll hide-scroll">
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black/40"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] md:w-[600px] max-h-[85vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div
                  className={`${
                    isFormUpdate ? "bg-amber-500" : "bg-emerald-500"
                  } mr-3 text-white p-2 rounded-md`}
                >
                  {isFormUpdate ? <Pencil size={24} /> : <Plus size={24} />}
                </div>
                <h2 className="text-xl font-bold">
                  {isFormUpdate ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <hr className="mb-4" />

            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  ชื่อกิจกรรม <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  } placeholder:text-sm sm:placeholder:text-base`}
                  placeholder="กรอกชื่อกิจกรรม"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  ประเภท <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] cursor-pointer"
                >
                  <option value="activity">กิจกรรม</option>
                  <option value="special_day">วันพิเศษ (สอนชดเชย)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] placeholder:text-sm sm:placeholder:text-base"
                  placeholder="รายละเอียดกิจกรรม (ถ้ามี)"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    วันที่ <span className="text-red-500">*</span> 
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={newEvent.eventDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] ${
                      errors.eventDate ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.eventDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.eventDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    เวลาเริ่ม <span className="text-red-500">*</span> 
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] ${
                      errors.startTime ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    เวลาสิ้นสุด <span className="text-red-500">*</span> 
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] ${
                      errors.endTime ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                </div>
              </div>

              {/* Target Classes and Periods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    ชั้นเรียนที่เกี่ยวข้อง
                  </label>
                  <select
                    name="targetClasses"
                    value={newEvent.targetClasses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3] cursor-pointer"
                  >
                    <option value="">ทุกชั้นเรียน</option>
                    {classes.slice(0, 6).map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    จำนวนคาบ
                  </label>
                  <input
                    type="number"
                    name="periods"
                    min="1"
                    max="10"
                    value={newEvent.periods}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#009EA3]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className={`${
                  isFormUpdate
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white px-6 py-2 rounded-lg transition-colors flex items-center`}
              >
                {isFormUpdate ? (
                  <>
                    <Pencil size={18} className="mr-2" />
                    บันทึกการแก้ไข
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    สร้างกิจกรรม
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventManagement;