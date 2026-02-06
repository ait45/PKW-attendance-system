"use client";

import React, { useState, useEffect } from "react";
import {
  UserRound,
  Calendar,
  Clock,
  CheckCircle,
  User,
  BookOpen,
  Award,
  XCircle,
  Pause,
  CircleAlert,
  FileBadge,
  QrCode,
  Sparkles,
  TrendingUp,
  MapPin,
  ChevronRight,
  Users,
  Search,
  Filter,
} from "lucide-react";
import AttendanceCheckPage from "../AttendanceCheck";
import { SkeletonStudentDashboard } from "../Skeleton";

interface UserData {
  studentId: number;
  name: string;
  classes: string;
  isAdmin: boolean;
  Number: number;
  joinDays: number;
  leaveDays: number;
  lateDays: number;
  absentDays: number;
  behaviorScore: number;
  data_attendance: {
    status: string;
    createdAt: string;
  };
}

interface StudentInfo {
  studentId: string;
  name: string;
  classes: string;
  joinDays: number;
  leaveDays: number;
  lateDays: number;
  absentDays: number;
  behaviorScore: number;
}

interface ScheduleItem {
  ID: number;
  CLASS_ID: string;
  DAY_OF_WEEK: number;
  PERIOD: number;
  SUBJECT: string;
  TEACHER_NAME: string;
  ROOM: string;
}

const periodTimes = [
  { period: 1, time: "08:30-09:20" },
  { period: 2, time: "09:20-10:10" },
  { period: 3, time: "10:20-11:10" },
  { period: 4, time: "11:10-12:00" },
  { period: 5, time: "13:00-13:50" },
  { period: 6, time: "13:50-14:40" },
  { period: 7, time: "14:50-15:40" },
  { period: 8, time: "15:40-16:30" },
];

const classes = [
  "ทั้งหมด",
  "มัธยมศึกษาปีที่ 1",
  "มัธยมศึกษาปีที่ 2",
  "มัธยมศึกษาปีที่ 3",
  "มัธยมศึกษาปีที่ 4",
  "มัธยมศึกษาปีที่ 5",
  "มัธยมศึกษาปีที่ 6",
];

const StudentCouncilDashboard = ({ session }: { session: any }) => {
  const [loading, setLoading] = useState(true);
  const [DataUser, setDataUser] = useState<UserData>({
    studentId: 0,
    name: "",
    classes: "",
    isAdmin: false,
    Number: 0,
    joinDays: 0,
    leaveDays: 0,
    lateDays: 0,
    absentDays: 0,
    behaviorScore: 0,
    data_attendance: {
      status: "",
      createdAt: "",
    },
  });
  
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showDetailProfile, setShowDetailProfile] = useState(false);

  // Student council specific states
  const [studentList, setStudentList] = useState<StudentInfo[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ทั้งหมด");

  const fetchDataUser = async () => {
    try {
      setLoading(true);
      const req = await fetch(`/api/studentManagement/${session?.id}`);
      const data = await req.json();
      setDataUser(data.data);
      
      const req_attendance = await fetch(
        `/api/scanAttendance/${session?.user?.username}`
      );
      if (req_attendance.status === 204) return;
      const data_attendance_raw = await req_attendance.json();
      const date = new Date(data_attendance_raw.payload.CREATED_AT);
      const time = date.toTimeString().split(" ")[0];
      const data_attendance = {
        status: data_attendance_raw.data.STATUS,
        createdAt: time,
      };
      setDataUser((prev) => ({ ...prev, data_attendance }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    if (!DataUser.classes) return;
    try {
      setLoadingSchedule(true);
      const today = new Date().getDay() || 1;
      const res = await fetch(
        `/api/schedule?classId=${encodeURIComponent(DataUser.classes)}&dayOfWeek=${today}`
      );
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const fetchStudentList = async () => {
    try {
      setLoadingStudents(true);
      const res = await fetch("/api/studentManagement");
      const data = await res.json();
      if (data.payload && Array.isArray(data.payload)) {
        setStudentList(data.payload.map((s: any) => ({
          studentId: s.studentId,
          name: s.name,
          classes: s.classes,
          joinDays: s.joinDays || 0,
          leaveDays: s.leaveDays || 0,
          lateDays: s.lateDays || 0,
          absentDays: s.adsentDays || 0,
          behaviorScore: s.behaviorScore || 100,
        })));
      }
    } catch (error) {
      console.error("Error fetching student list:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    if (DataUser.classes) {
      fetchSchedule();
    }
  }, [DataUser.classes]);

  useEffect(() => {
    if (selectedTab === "students") {
      fetchStudentList();
    }
  }, [selectedTab]);

  const filteredStudents = studentList.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "ทั้งหมด" || student.classes === classFilter;
    return matchesSearch && matchesClass;
  });

  const totalDays = DataUser.joinDays + DataUser.absentDays + DataUser.lateDays + DataUser.leaveDays || 1;

  if (loading) {
    return <SkeletonStudentDashboard />;
  }

  const AttendanceCard = ({
    icon: Icon,
    label,
    value,
    color,
    percentage,
    gradient,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    percentage: string;
    gradient: string;
  }) => (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}
      />
      <div
        className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-4xl font-bold tracking-tight" style={{ color }}>
            {value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(parseFloat(percentage), 100)}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-gray-500">{percentage}%</span>
          </div>
        </div>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, badge }: { id: string; label: string; icon: any; badge?: number }) => (
    <button
      title={label}
      onClick={() => setSelectedTab(id)}
      className={`relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
        selectedTab === id
          ? "bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
          : "text-gray-600 hover:bg-white/80 hover:shadow-md"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden md:inline">{label}</span>
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "มา":
        return { bg: "bg-gradient-to-r from-emerald-500 to-green-600", icon: CheckCircle, text: "เข้าร่วมกิจกรรม" };
      case "ลา":
        return { bg: "bg-gradient-to-r from-blue-500 to-indigo-600", icon: Pause, text: "ลา" };
      case "สาย":
        return { bg: "bg-gradient-to-r from-amber-500 to-orange-600", icon: Clock, text: "มาสาย" };
      case "ขาด":
        return { bg: "bg-gradient-to-r from-red-500 to-rose-600", icon: XCircle, text: "ขาด" };
      default:
        return { bg: "bg-gradient-to-r from-gray-400 to-gray-500", icon: CircleAlert, text: "ยังไม่มีสถานะ" };
    }
  };

  const statusStyles = getStatusStyles(DataUser?.data_attendance?.status);
  const StatusIcon = statusStyles.icon;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-rose-50 to-pink-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Avatar - Rose theme for student council */}
              <div
                className="relative cursor-pointer"
                onClick={() => setShowDetailProfile(!showDetailProfile)}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                  <UserRound className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                {/* Student Council Badge */}
                <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                  สภา
                </div>
              </div>

              {/* User Info */}
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {DataUser.name || "กำลังโหลด..."}
                </h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    {DataUser.studentId || "-"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    {DataUser.classes || "-"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-600">
                    <Users size={14} />
                    สภานักเรียน
                  </span>
                </div>
              </div>

              {/* Mobile Profile Popup */}
              {showDetailProfile && (
                <div className="sm:hidden absolute left-16 top-20 z-50 animate-fadeIn">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20 min-w-[200px]">
                    <h2 className="font-bold text-gray-900">{DataUser.name}</h2>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>รหัส: {DataUser.studentId}</p>
                      <p>ชั้น: {DataUser.classes}</p>
                      <p>เลขที่: {DataUser.Number}</p>
                      <p className="text-rose-600 font-medium">สภานักเรียน</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Status & QR */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTab("scan")}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                title="สแกนการเช็คชื่อ"
              >
                <QrCode className="w-6 h-6 text-rose-600 group-hover:text-rose-700" />
              </button>

              <div className={`${statusStyles.bg} rounded-2xl p-4 text-white shadow-lg min-w-[140px]`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className="w-8 h-8" />
                  <div>
                    <p className="font-semibold text-sm">{statusStyles.text}</p>
                    <p className="text-xs text-white/80">
                      {DataUser?.data_attendance?.createdAt
                        ? `เวลา ${DataUser.data_attendance.createdAt}`
                        : "วันนี้"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Added Students tab for council */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white/50 backdrop-blur-sm rounded-2xl w-fit shadow-lg">
          <TabButton id="overview" label="ภาพรวม" icon={User} />
          <TabButton id="attendance" label="การเข้าเรียน" icon={Calendar} />
          <TabButton id="schedule" label="ตารางเรียน" icon={BookOpen} />
          <TabButton id="behavior" label="ความประพฤติ" icon={Award} />
          <TabButton id="students" label="ข้อมูลนักเรียน" icon={Users} badge={studentList.length} />
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-r from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <FileBadge className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  กิจกรรมหน้าเสาธง
                </h2>
                <p className="text-sm text-gray-500">สรุปการเข้าร่วมกิจกรรม</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AttendanceCard
                icon={CheckCircle}
                label="วันที่เข้าร่วม"
                value={DataUser.joinDays}
                color="#10B981"
                gradient="bg-gradient-to-br from-emerald-400 to-green-500"
                percentage={((DataUser.joinDays / totalDays) * 100).toFixed(1)}
              />
              <AttendanceCard
                icon={XCircle}
                label="วันที่ขาด"
                value={DataUser.absentDays}
                color="#EF4444"
                gradient="bg-gradient-to-br from-red-400 to-rose-500"
                percentage={((DataUser.absentDays / totalDays) * 100).toFixed(1)}
              />
              <AttendanceCard
                icon={Clock}
                label="วันที่มาสาย"
                value={DataUser.lateDays}
                color="#F59E0B"
                gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                percentage={((DataUser.lateDays / totalDays) * 100).toFixed(1)}
              />
              <AttendanceCard
                icon={Pause}
                label="วันที่ลา"
                value={DataUser.leaveDays}
                color="#EC4899"
                gradient="bg-gradient-to-br from-pink-400 to-rose-500"
                percentage={((DataUser.leaveDays / totalDays) * 100).toFixed(1)}
              />
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Behavior Score Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-r from-amber-400 to-yellow-500 rounded-xl">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      คะแนนความประพฤติ
                    </h3>
                  </div>
                  <TrendingUp
                    className={`w-5 h-5 ${
                      DataUser.behaviorScore >= 80
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }`}
                  />
                </div>

                <div className="text-center">
                  <div
                    className={`text-6xl font-bold mb-4 ${
                      DataUser.behaviorScore >= 80
                        ? "text-emerald-500"
                        : DataUser.behaviorScore >= 60
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {DataUser.behaviorScore}
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                        DataUser.behaviorScore >= 80
                          ? "bg-linear-to-r from-emerald-400 to-green-500"
                          : DataUser.behaviorScore >= 60
                          ? "bg-linear-to-r from-amber-400 to-orange-500"
                          : "bg-linear-to-r from-red-400 to-rose-500"
                      }`}
                      style={{ width: `${DataUser.behaviorScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {DataUser.behaviorScore >= 80
                      ? "🌟 ความประพฤติดีมาก"
                      : DataUser.behaviorScore >= 60
                      ? "👍 ความประพฤติดี"
                      : "⚠️ ต้องปรับปรุง"}
                  </p>
                </div>
              </div>

              {/* Today's Schedule Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ตารางเรียนวันนี้
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {loadingSchedule ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
                    </div>
                  ) : schedule.length > 0 ? (
                    schedule.slice(0, 4).map((item) => {
                      const periodInfo = periodTimes.find((p) => p.period === item.PERIOD);
                      return (
                        <div
                          key={item.ID}
                          className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors"
                        >
                          <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {item.PERIOD}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.SUBJECT}</p>
                            <p className="text-xs text-gray-500">
                              {periodInfo?.time} • {item.TEACHER_NAME || "ไม่ระบุ"}
                            </p>
                          </div>
                          {item.ROOM && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={12} />
                              {item.ROOM}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                      <p>ไม่มีตารางเรียนวันนี้</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedTab("schedule")}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                >
                  ดูตารางเรียนทั้งหมด
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {selectedTab === "attendance" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                สถิติการเข้าเรียน
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "วันเรียนทั้งหมด", value: totalDays, color: "blue" },
                  { label: "เข้าร่วม", value: DataUser.joinDays, color: "emerald" },
                  { label: "ขาด", value: DataUser.absentDays, color: "red" },
                  { label: "สาย", value: DataUser.lateDays, color: "amber" },
                  { label: "ลา", value: DataUser.leaveDays, color: "rose" },
                ].map((stat) => (
                  <div key={stat.label} className={`text-center p-4 rounded-2xl bg-${stat.color}-50`}>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">อัตราการเข้าเรียน</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-400 to-green-500 transition-all duration-1000"
                      style={{ width: `${(DataUser.joinDays / totalDays) * 100}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold text-emerald-600">
                    {((DataUser.joinDays / totalDays) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {selectedTab === "schedule" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">ตารางเรียนประจำวัน</h2>
              <span className="text-sm text-gray-500">{DataUser.classes || "ไม่ระบุชั้น"}</span>
            </div>

            {loadingSchedule ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
              </div>
            ) : schedule.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">คาบ</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">เวลา</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">วิชา</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">ครูผู้สอน</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">ห้องเรียน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item) => {
                      const periodInfo = periodTimes.find((p) => p.period === item.PERIOD);
                      return (
                        <tr key={item.ID} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 rounded-lg font-bold">
                              {item.PERIOD}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{periodInfo?.time}</td>
                          <td className="py-4 px-4 font-medium text-gray-900">{item.SUBJECT}</td>
                          <td className="py-4 px-4 text-gray-600">{item.TEACHER_NAME || "-"}</td>
                          <td className="py-4 px-4 text-gray-600">{item.ROOM || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                <p>ไม่มีตารางเรียนวันนี้</p>
              </div>
            )}
          </div>
        )}

        {/* Behavior Tab */}
        {selectedTab === "behavior" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">ประวัติความประพฤติ</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-400 to-yellow-500 rounded-xl text-white">
                  <Award size={18} />
                  <span className="font-semibold">{DataUser.behaviorScore} คะแนน</span>
                </div>
              </div>

              <div className="p-6 bg-linear-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
                <h3 className="font-semibold text-rose-900 mb-4">เกณฑ์การประเมิน</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { range: "80-100", label: "ดีเยี่ยม", color: "emerald", emoji: "🌟" },
                    { range: "60-79", label: "ดี", color: "amber", emoji: "👍" },
                    { range: "0-59", label: "ต้องปรับปรุง", color: "red", emoji: "⚠️" },
                  ].map((item) => (
                    <div key={item.range} className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className={`font-medium text-${item.color}-700`}>{item.range}:</span>
                        <span className="text-gray-600 ml-1">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab - New for Student Council */}
        {selectedTab === "students" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-rose-500 to-pink-600 rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">ข้อมูลนักเรียน</h2>
                    <p className="text-sm text-gray-500">ดูข้อมูลการเข้าร่วมกิจกรรมของนักเรียน</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  พบ {filteredStudents.length} คน
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อหรือรหัสนักเรียน..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 appearance-none bg-white cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Table */}
              {loadingStudents ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">รหัสนักเรียน</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ชื่อ-สกุล</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ชั้นเรียน</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">เข้าร่วม</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">ขาด</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">สาย</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">ลา</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">คะแนนความประพฤติ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 text-rose-600 font-medium">{student.studentId}</td>
                          <td className="py-3 px-4 text-gray-900">{student.name}</td>
                          <td className="py-3 px-4 text-gray-600">{student.classes}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                              {student.joinDays}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                              {student.absentDays}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                              {student.lateDays}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                              {student.leaveDays}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg text-sm font-bold ${
                              student.behaviorScore >= 80
                                ? "bg-emerald-100 text-emerald-700"
                                : student.behaviorScore >= 60
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {student.behaviorScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Users size={64} className="mx-auto mb-4 opacity-50" />
                  <p>ไม่พบข้อมูลนักเรียน</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Tab */}
        {selectedTab === "scan" && <AttendanceCheckPage session={session} />}
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentCouncilDashboard;
