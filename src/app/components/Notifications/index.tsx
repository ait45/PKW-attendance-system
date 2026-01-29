"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  X,
  Pin,
  Calendar,
  Users,
  Megaphone,
  AlertCircle,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";

interface Notification {
  ID: number;
  TITLE: string;
  CONTENT: string;
  TYPE: "general" | "urgent" | "event" | "info";
  TARGET_AUDIENCE: string;
  EXPIRE_DATE: string | null;
  IS_PINNED: number;
  STATUS: "active" | "expired";
  CREATED_BY: string;
  CREATED_AT: string;
}

interface NewNotification {
  title: string;
  content: string;
  type: "general" | "urgent" | "event" | "info";
  targetAudience: string;
  expireDate: string;
  isPinned: boolean;
}

function Notifications({ session }: { session?: any }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFormUpdate, setIsFormUpdate] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("ทั้งหมด");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newNotification, setNewNotification] = useState<NewNotification>({
    title: "",
    content: "",
    type: "general",
    targetAudience: "all",
    expireDate: "",
    isPinned: false,
  });

  const isTeacher = session?.user?.role === "teacher";

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.message || []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openModal = () => setIsOpenModal(true);

  const closeModal = () => {
    setIsOpenModal(false);
    setIsFormUpdate(false);
    setUpdateId(null);
    setNewNotification({
      title: "",
      content: "",
      type: "general",
      targetAudience: "all",
      expireDate: "",
      isPinned: false,
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewNotification((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewNotification((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newNotification.title) newErrors.title = "กรุณากรอกหัวข้อ";
    if (!newNotification.content) newErrors.content = "กรุณากรอกเนื้อหา";
    return newErrors;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }

    Swal.fire({
      title: isFormUpdate ? "ยืนยันการแก้ไข?" : "ยืนยันการสร้างประกาศ?",
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
          const payload = isFormUpdate
            ? { id: updateId, ...newNotification }
            : newNotification;

          const res = await fetch("/api/notifications", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (data.success) {
            Swal.fire({
              text: isFormUpdate ? "แก้ไขสำเร็จ!" : "สร้างประกาศสำเร็จ!",
              icon: "success",
              timer: 2000,
            });
            closeModal();
            fetchNotifications();
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

  const handleDelete = async (id: number, title: string) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `ลบประกาศ: ${title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/notifications?id=${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ text: "ลบสำเร็จ!", icon: "success", timer: 2000 });
            fetchNotifications();
          }
        } catch (error) {
          console.error(error);
          Swal.fire("เกิดข้อผิดพลาด", "", "error");
        }
      }
    });
  };

  const handleEdit = (notification: Notification) => {
    setIsFormUpdate(true);
    setUpdateId(notification.ID);
    setNewNotification({
      title: notification.TITLE,
      content: notification.CONTENT,
      type: notification.TYPE,
      targetAudience: notification.TARGET_AUDIENCE,
      expireDate: notification.EXPIRE_DATE?.split("T")[0] || "",
      isPinned: notification.IS_PINNED === 1,
    });
    setIsOpenModal(true);
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filterType === "ทั้งหมด") return notifications;
    if (filterType === "ปักหมุด")
      return notifications.filter((n) => n.IS_PINNED === 1);
    if (filterType === "ด่วน")
      return notifications.filter((n) => n.TYPE === "urgent");
    if (filterType === "ทั่วไป")
      return notifications.filter((n) => n.TYPE === "general");
    if (filterType === "กิจกรรม")
      return notifications.filter((n) => n.TYPE === "event");
    return notifications;
  }, [notifications, filterType]);

  const getTypeBadge = (type: string, isPinned: number) => {
    const badges = [];

    if (isPinned === 1) {
      badges.push(
        <span
          key="pinned"
          className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full mr-1 inline-flex items-center"
        >
          <Pin size={12} className="mr-1" />
          ปักหมุด
        </span>
      );
    }

    switch (type) {
      case "urgent":
        badges.push(
          <span
            key="type"
            className="bg-red-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center"
          >
            <AlertCircle size={12} className="mr-1" />
            ด่วน
          </span>
        );
        break;
      case "event":
        badges.push(
          <span
            key="type"
            className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center"
          >
            <Calendar size={12} className="mr-1" />
            กิจกรรม
          </span>
        );
        break;
      case "info":
        badges.push(
          <span
            key="type"
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center"
          >
            <Info size={12} className="mr-1" />
            แจ้งเตือน
          </span>
        );
        break;
      default:
        badges.push(
          <span
            key="type"
            className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center"
          >
            <Megaphone size={12} className="mr-1" />
            ทั่วไป
          </span>
        );
    }

    return badges;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case "all":
        return "ทุกคน";
      case "teachers":
        return "ครูเท่านั้น";
      case "students":
        return "นักเรียนเท่านั้น";
      default:
        return audience;
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-blue-500 mr-3 p-2 rounded-md text-white">
              <Bell size={28} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
                ประกาศ / แจ้งเตือน
              </h2>
              <p className="text-xs text-slate-600">ข่าวสารและประกาศล่าสุด</p>
            </div>
          </div>

          {isTeacher && (
            <button
              onClick={() => {
                setIsFormUpdate(false);
                openModal();
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              สร้างประกาศ
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["ทั้งหมด", "ปักหมุด", "ด่วน", "กิจกรรม", "ทั่วไป"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${filterType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-scroll hide-scrollbar">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.ID}
                className={`border rounded-lg p-4 transition-colors ${notification.IS_PINNED === 1
                    ? "border-yellow-400 bg-yellow-50"
                    : notification.TYPE === "urgent"
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeBadge(notification.TYPE, notification.IS_PINNED)}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">
                      {notification.TITLE}
                    </h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">
                      {notification.CONTENT}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {getAudienceLabel(notification.TARGET_AUDIENCE)}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(notification.CREATED_AT)}
                      </span>
                      <span>โดย: {notification.CREATED_BY}</span>
                    </div>
                  </div>

                  {isTeacher && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(notification)}
                        className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(notification.ID, notification.TITLE)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p>ไม่มีประกาศ</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div onClick={closeModal} className="fixed inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] md:w-[600px] max-h-[85vh] overflow-y-scroll hide-scrollbar p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div
                  className={`${isFormUpdate ? "bg-amber-500" : "bg-emerald-500"
                    } mr-3 text-white p-2 rounded-md`}
                >
                  {isFormUpdate ? <Pencil size={24} /> : <Plus size={24} />}
                </div>
                <h2 className="text-xl font-bold">
                  {isFormUpdate ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
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
              {/* Title */}
              <div>
                <label className="text-sm text-slate-600 mb-1 flex">
                  หัวข้อ <p className="text-red-500 ml-1">*</p>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newNotification.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${errors.title ? "border-red-500" : "border-slate-300"
                    }`}
                  placeholder="กรอกหัวข้อประกาศ"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="text-sm text-slate-600 flex mb-1">
                  เนื้อหา <p className="text-red-500 ml-1">*</p>
                </label>
                <textarea
                  name="content"
                  value={newNotification.content}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${errors.content ? "border-red-500" : "border-slate-300"
                    }`}
                  placeholder="กรอกเนื้อหาประกาศ"
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
              </div>

              {/* Type and Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    ประเภท
                  </label>
                  <select
                    name="type"
                    value={newNotification.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="urgent">ด่วน</option>
                    <option value="event">กิจกรรม</option>
                    <option value="info">แจ้งเตือน</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    กลุ่มเป้าหมาย
                  </label>
                  <select
                    name="targetAudience"
                    value={newNotification.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  >
                    <option value="all">ทุกคน</option>
                    <option value="teachers">ครูเท่านั้น</option>
                    <option value="students">นักเรียนเท่านั้น</option>
                  </select>
                </div>
              </div>

              {/* Expire Date and Pin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">
                    วันหมดอายุ (ถ้ามี)
                  </label>
                  <input
                    type="date"
                    name="expireDate"
                    value={newNotification.expireDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="isPinned"
                    id="isPinned"
                    checked={newNotification.isPinned}
                    onChange={handleInputChange}
                    className="w-5 h-5 mr-2 cursor-pointer"
                  />
                  <label htmlFor="isPinned" className="cursor-pointer flex items-center">
                    <Pin size={16} className="mr-1 text-yellow-500" />
                    ปักหมุดประกาศนี้
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className={`${isFormUpdate
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
                    สร้างประกาศ
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

export default Notifications;
