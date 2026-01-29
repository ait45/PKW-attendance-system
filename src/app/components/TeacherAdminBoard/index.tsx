"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Book,
  Calculator,
  Globe,
  Heart,
  Briefcase,
  Palette,
  Search,
  Phone,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Filter,
  Beaker,
  ChartBar,
  UserPlus,
} from "lucide-react";
import Swal from "sweetalert2";

interface SubjectGroup {
  id: string;
  name: string;
  nameEN: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface Teacher {
  TEACHER_ID: string;
  NAME: string;
  DEPARTMENT: string;
  SUBJECT: string;
  PHONE: string;
  IS_ADMIN: boolean;
  SUBJECT_GROUP: string;
}

interface FormData {
  teacherId: string;
  name: string;
  department: string;
  subject: string;
  phone: string;
  subjectGroup: string;
  isAdmin: boolean;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Flask: Beaker,
  Calculator: Calculator,
  Book: Book,
  Globe: Globe,
  Users: Users,
  Palette: Palette,
  Heart: Heart,
  Briefcase: Briefcase,
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  let result = "";
  if (digits.length > 0) result = digits.slice(0, 3);
  if (digits.length > 3) result += "-" + digits.slice(3, 6);
  if (digits.length > 6) result += "-" + digits.slice(6, 10);
  return result;
};

function TeacherAdminBoard() {
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    teacherId: "",
    name: "",
    department: "",
    subject: "",
    phone: "",
    subjectGroup: "",
    isAdmin: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsRes, teachersRes] = await Promise.all([
        fetch("/api/subjectGroups"),
        fetch("/api/teacherManagement"),
      ]);

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setSubjectGroups(groupsData.data || []);
      }

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.message || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลได้",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTeachersByGroup = (groupId: string) => {
    return teachers.filter((t) => t.SUBJECT_GROUP === groupId);
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchGroup = filterGroup === "all" || t.SUBJECT_GROUP === filterGroup;
    const matchSearch = t.NAME.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  const getGroupInfo = (groupId: string) => {
    return subjectGroups.find((g) => g.id === groupId);
  };

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setIsEdit(true);
      setFormData({
        teacherId: teacher.TEACHER_ID,
        name: teacher.NAME,
        department: teacher.DEPARTMENT || "",
        subject: teacher.SUBJECT || "",
        phone: teacher.PHONE || "",
        subjectGroup: teacher.SUBJECT_GROUP || "",
        isAdmin: teacher.IS_ADMIN || false,
      });
    } else {
      setIsEdit(false);
      setFormData({
        teacherId: "",
        name: "",
        department: "",
        subject: "",
        phone: "",
        subjectGroup: "",
        isAdmin: false,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.teacherId || !formData.name) {
      Swal.fire({
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกรหัสครูและชื่อ",
        icon: "warning",
      });
      return;
    }

    setSubmitting(true);

    try {
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch("/api/teacherManagement", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire({
          title: "สำเร็จ",
          text: isEdit ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ",
          icon: "success",
        });
        setShowModal(false);
        fetchData();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (teacherId: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบข้อมูลครูนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/teacherManagement?teacherId=${teacherId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          Swal.fire("ลบสำเร็จ", "ข้อมูลครูถูกลบแล้ว", "success");
          fetchData();
        } else {
          throw new Error("Failed to delete");
        }
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl">
              <ChartBar size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard บริหารครู
            </h1>
          </div>
          <p className="text-gray-600">
            จัดการข้อมูลครูทั้งหมดในระบบ
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
        >
          <UserPlus size={20} />
          เพิ่มครูใหม่
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3">
            <Users size={32} className="opacity-80" />
            <div>
              <div className="text-3xl font-bold">{teachers.length}</div>
              <div className="text-blue-100">ครูทั้งหมด</div>
            </div>
          </div>
        </div>
        {subjectGroups.slice(0, 3).map((group) => {
          const Icon = iconMap[group.icon] || Users;
          return (
            <div
              key={group.id}
              className="rounded-2xl p-6"
              style={{ backgroundColor: group.bgColor }}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: group.color }}>
                  <Icon size={32} />
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: group.color }}>
                    {getTeachersByGroup(group.id).length}
                  </div>
                  <div className="text-sm text-gray-600">{group.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อครู..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">ทุกกลุ่มสาระ</option>
              {subjectGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  รหัส
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  ชื่อ-นามสกุล
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  กลุ่มสาระ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  วิชา
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  เบอร์โทร
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const group = getGroupInfo(teacher.SUBJECT_GROUP);
                  return (
                    <tr
                      key={teacher.TEACHER_ID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                        {teacher.TEACHER_ID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {teacher.NAME.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {teacher.NAME}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {group ? (
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: group.bgColor,
                              color: group.color,
                            }}
                          >
                            {group.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.SUBJECT || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.PHONE || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {teacher.IS_ADMIN ? (
                          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                            ผู้ดูแลระบบ
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            ครู
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(teacher)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.TEACHER_ID)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    ไม่พบข้อมูลครู
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-scroll hide-scroll">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
                        <Users size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                         {isEdit ? "แก้ไขข้อมูลครู" : "เพิ่มครูใหม่"}
                        </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <hr className="w-[80%] mx-auto"/>

            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  รหัสครู <p className="text-red-600 ml-1">*</p>
                </label>
                <input
                  type="text"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  disabled={isEdit}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="เช่น T001"
                />
              </div>

              <div>
                <label className="flex text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล <p className="text-red-600 ml-1">*</p>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น นายสมชาย ใจดี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  กลุ่มสาระการเรียนรู้
                </label>
                <select
                  value={formData.subjectGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectGroup: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกกลุ่มสาระ</option>
                  {subjectGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วิชาที่สอน
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น คณิตศาสตร์พื้นฐาน"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  แผนก/ฝ่าย
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น ฝ่ายวิชาการ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: formatPhone(e.target.value),
                    })
                  }
                  maxLength={12}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="xxx-xxx-xxxx"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={(e) =>
                    setFormData({ ...formData, isAdmin: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isAdmin" className="text-sm text-gray-700">
                  เป็นผู้ดูแลระบบ (Admin)
                </label>
              </div>
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-color text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEdit ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeacherAdminBoard;
