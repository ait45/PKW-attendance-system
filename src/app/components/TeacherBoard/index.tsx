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
  ChevronRight,
  Search,
  Phone,
  Mail,
  User,
  X,
  Beaker,
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

import { SkeletonTeacherCards } from "../Skeleton";

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

function TeacherBoard() {
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const filteredTeachers = selectedGroup
    ? getTeachersByGroup(selectedGroup).filter((t) =>
        t.NAME.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teachers.filter((t) =>
        t.NAME.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getGroupInfo = (groupId: string) => {
    return subjectGroups.find((g) => g.id === groupId);
  };

  if (loading) {
    return <SkeletonTeacherCards />;
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ข้อมูลครูตามกลุ่มสาระการเรียนรู้
        </h1>
        <p className="text-gray-600">
          จัดการและดูข้อมูลครูแยกตามกลุ่มสาระการเรียนรู้ทั้ง 8 กลุ่ม
        </p>
      </div>

      {/* Subject Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {subjectGroups.map((group) => {
          const Icon = iconMap[group.icon] || Users;
          const teacherCount = getTeachersByGroup(group.id).length;

          return (
            <div
              key={group.id}
              onClick={() => {
                setSelectedGroup(group.id);
                setShowModal(true);
              }}
              className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              style={{ backgroundColor: group.bgColor }}
            >
              {/* Background decoration */}
              <div
                className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ color: group.color }}
              >
                <Icon size={100} />
              </div>

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: group.color }}
                >
                  <Icon size={24} className="text-white" />
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{group.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{group.nameEN}</p>

                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: group.color }}
                  >
                    {teacherCount}
                  </span>
                  <span className="text-sm text-gray-500">คน</span>
                  <ChevronRight
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: group.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics Summary */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{teachers.length}</div>
            <div className="text-blue-100">ครูทั้งหมด</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{subjectGroups.length}</div>
            <div className="text-blue-100">กลุ่มสาระ</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {teachers.filter((t) => t.IS_ADMIN).length}
            </div>
            <div className="text-blue-100">ผู้ดูแลระบบ</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {new Set(teachers.map((t) => t.DEPARTMENT)).size}
            </div>
            <div className="text-blue-100">แผนก</div>
          </div>
        </div>
      </div>

      {/* Modal for teacher list */}
      {showModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div
              className="p-6"
              style={{ backgroundColor: getGroupInfo(selectedGroup)?.bgColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const group = getGroupInfo(selectedGroup);
                    const Icon = group ? iconMap[group.icon] || Users : Users;
                    return (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: group?.color }}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {getGroupInfo(selectedGroup)?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {filteredTeachers.length} ครู
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mt-4 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="ค้นหาครู..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Teacher List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {filteredTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.TEACHER_ID}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {teacher.NAME.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {teacher.NAME}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {teacher.SUBJECT || "ไม่ระบุวิชา"}
                          </p>
                          {teacher.PHONE && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Phone size={14} />
                              {teacher.PHONE}
                            </div>
                          )}
                          {teacher.IS_ADMIN && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                              ผู้ดูแลระบบ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <User size={48} className="mx-auto mb-4 opacity-50" />
                  <p>ไม่พบครูในกลุ่มนี้</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeacherBoard;
