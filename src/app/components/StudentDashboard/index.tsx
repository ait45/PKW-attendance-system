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
  AlertTriangle,
  CircleAlert,
  FileBadge,
  QrCode,
} from "lucide-react";
import AttendanceCheckPage from "../AttendanceCheck";

interface User {
  studentId: number,
  name: string,
  classes: string,
  isAdmin: boolean,
  Number: number,
  joinDays: number,
  leaveDays: number,
  lateDays: number,
  absentDays: number,
  behaviorScore: number,
  data_attendance: {
    status: string,
    createdAt: string,
  }
}
interface subject {
  time: Date,
  name: string,
  subject: string,
  teacher: string,
  room: string,

}

const StudentDashboard = ({ session }) => {
  // checkUser
  const [DataUser, setDataUser] = useState<Partial<User>>({});
  const fetchDataUser = async () => {
    const req = await fetch(`/api/studentManagement/${session?.id}`);
    const data = await req.json();
    setDataUser(data.data);
    const req_attendance = await fetch(
      `/api/scanAttendance/${session?.user?.username}`
    );
    if (req_attendance.status === 204) return;
    const data_attendance_raw = await req_attendance.json();
    const date = new Date(data_attendance_raw.payload.CREATED_AT);

    // เวลา (ตามเครื่อง local)
    const time = date.toTimeString().split(" ")[0];
    const data_attendance = {
      status: data_attendance_raw.data.STATUS,
      createdAt: time,
    };
    setDataUser((prev: User) => {
      return { ...prev, data_attendance };
    });
  };
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    fetchDataUser();
  });

  // ข้อมูลตัวอย่างนักเรียน
  const studentData = {
    id: "STD2024001",
    name: "นาย สมชาย ใจดี",
    class: "ม.6/1",
    studentNumber: "12345",
    profileImage: "/api/placeholder/120/120",
    attendance: {
      present: 156,
      absent: 8,
      late: 12,
      excused: 5,
      totalDays: 181,
    },
    behaviorScore: 85,
    lineup: {
      status: "เข้าแถว",
      time: "07:45",
      date: "2024-03-15",
      uniform: "สมบูรณ์",
      punctuality: "ตรงเวลา",
    },
  };

  const schedule: string[] = [];
  const behaviorRecords = [
    {
      date: "2024-03-15",
      type: "ดี",
      description: "ช่วยเหลืองานโรงเรียน",
      score: "+5",
    },
    {
      date: "2024-03-10",
      type: "ปกติ",
      description: "เข้าเรียนปกติ",
      score: "0",
    },
    {
      date: "2024-03-08",
      type: "เสีย",
      description: "มาสาย 15 นาที",
      score: "-2",
    },
    {
      date: "2024-03-05",
      type: "ดี",
      description: "ได้รับรางวัลความประพฤติดี",
      score: "+10",
    },
    {
      date: "2024-03-01",
      type: "ปกติ",
      description: "เข้าเรียนปกติ",
      score: "0",
    },
  ];

  const showAlert = (type, title, message) => {
    // ใน production จริงจะใช้ SweetAlert2
    alert(`${title}: ${message}`);
  };

  const AttendanceCard = ({ icon: Icon, label, value, color, percentage }) => (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
          <p className="text-sm text-gray-500">{percentage}%</p>
        </div>
        <Icon className="h-12 w-12 opacity-20" style={{ color }} />
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      title={label}
      onClick={() => setSelectedTab(id)}
      className={`flex justify-center items-center px-3 md:px-6 py-1.5 md:py-3 rounded-lg font-medium transition-all duration-200 ${
        selectedTab === id
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <p className="hidden md:inline">{label}</p>
    </button>
  );

  const [showDetailProfile, setShowDetailProfile] = useState(false);
  const handleShowDetailProfile = () => {
    const state = !showDetailProfile;
    setShowDetailProfile(state);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="sm:flex place-items-center space-x-4">
              <span className="flex justify-center items-center w-17 h-17 rounded-full bg-gray-200 cursor-pointer sm:cursor-default">
                <UserRound
                  color={`${DataUser.isAdmin ? "red" : "#009EA3"}`}
                  size={50}
                  onClick={handleShowDetailProfile}
                />
              </span>
              {showDetailProfile && (
                <div
                  className="w-full h-full"
                  onClick={handleShowDetailProfile}
                >
                  <div className="sm:hidden absolute left-1/4 transform -translate-x-1/2 px-2 py-1 z-50 text-white text-xs rounded-xl text-nowrap bg-[#18786F] opacity-85 backdrop-blur-xl shadow-2xl">
                    <div className=" w-40 h-auto z-80">
                      <h1 className="text-2xl font-bold text-white opacity-100">
                        {DataUser.name || "กำลังโหลด"}
                      </h1>
                      <div className="text-xs text-white">
                        <span className="flex mr-2 text-white">
                          รหัสนักเรียน :
                          <p className="ml-2">
                            {DataUser.studentId || "กำลังโหลด"}
                          </p>
                        </span>
                        <span className="flex mr-2">
                          ชั้นเรียน :
                          <p className="ml-2">
                            {DataUser.classes || "กำลังโหลด"}
                          </p>
                        </span>
                        <span className="flex mr-2">
                          เลขที่ :
                          <p className="ml-2">
                            {DataUser.Number || "กำลังโหลด"}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="hidden sm:inline">
                <h1 className="text-2xl font-bold text-gray-900">
                  {DataUser.name || "กำลังโหลด"}
                </h1>
                <div className="text-xs text-gray-500">
                  <span className="flex mr-2">
                    รหัสนักเรียน :
                    <p className="text-blue-500">
                      {DataUser.studentId || "กำลังโหลด"}
                    </p>
                  </span>
                  <span className="flex mr-2">
                    ชั้นเรียน :
                    <p className="text-blue-500">
                      {DataUser.classes || "กำลังโหลด"}
                    </p>
                  </span>
                  <span className="flex mr-2">
                    เลขที่ :
                    <p className="text-blue-500">
                      {DataUser.Number || "กำลังโหลด"}
                    </p>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div
                title="สแกนการเช็คชื่อเข้าร่วมกิจกรรม"
                className="flex flex-col justify-center"
              >
                <QrCode
                  size={30}
                  className="mr-4 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => setSelectedTab("scan")}
                />
              </div>
              {/* การเข้าแถววันนี้ */}
              <div
                className={`border ${
                  DataUser?.data_attendance?.status === "มา" &&
                  "bg-green-50 border-green-200"
                } ${
                  DataUser?.data_attendance?.status === "ลา" &&
                  "bg-blue-50 border-blue-200"
                } ${
                  DataUser?.data_attendance?.status === "ขาด" &&
                  "bg-red-50 border-red-200"
                }  ${
                  DataUser?.data_attendance?.status === "ลา" &&
                  "bg-orange-50 border-orange-200"
                } bg-gray-50 border-gray-200 rounded-lg p-4`}
              >
                <div className="flex items-center space-x-3">
                  {DataUser?.data_attendance?.status === "มา" && (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                  {DataUser?.data_attendance?.status === "ลา" && (
                    <Pause className="w-8 h-8 text-blue-600" />
                  )}
                  {DataUser?.data_attendance?.status === "สาย" && (
                    <Clock className="w-8 h-8 text-orange-600" />
                  )}
                  {DataUser?.data_attendance?.status === "ขาด" && (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  {!DataUser?.data_attendance?.status && (
                    <CircleAlert className="w-8 h-8 text-gray-600" />
                  )}
                  <div>
                    <p
                      className={`font-semibold text-nowrap text-gray-800  ${
                        DataUser?.data_attendance?.status === "มา" &&
                        "text-green-800"
                      } ${
                        DataUser?.data_attendance?.status === "ลา" &&
                        "text-blue-800"
                      } ${
                        DataUser?.data_attendance?.status === "สาย" &&
                        "text-orange-800"
                      } ${
                        DataUser?.data_attendance?.status === "ขาด" &&
                        "text-red-800"
                      }`}
                    >
                      สถานะการเข้าแถว
                    </p>
                    <p
                      className={`text-sm text-nowrap text-gray-600 ${
                        DataUser?.data_attendance?.status === "มา" &&
                        "text-green-600"
                      } ${
                        DataUser?.data_attendance?.status === "ลา" &&
                        "text-blue-600"
                      } ${
                        DataUser?.data_attendance?.status === "สาย" &&
                        "text-orange-600"
                      } ${
                        DataUser?.data_attendance?.status === "ขาด" &&
                        "text-red-600"
                      }`}
                    >
                      {DataUser?.data_attendance?.status ||
                        "ยังไม่มีการเช็คชื่อ"}
                      {DataUser?.data_attendance?.createdAt && (
                        <span>เวลา {DataUser?.data_attendance?.createdAt}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-end gap-4 mb-8 bg-white rounded-2xl shadow p-4 w-fit">
          <TabButton id="overview" label="ภาพรวม" icon={User} />
          <TabButton id="attendance" label="การเข้าเรียน" icon={Calendar} />
          <TabButton id="schedule" label="ตารางเรียน" icon={BookOpen} />
          <TabButton id="behavior" label="ความประพฤติ" icon={Award} />
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Attendance Summary */}
            <div className="flex items-center">
              <FileBadge size={25} color="#009EA3" className="mr-2" />
              <h1 className="font-bold text-3xl">กิจกรรมหน้าเสาธง</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AttendanceCard
                icon={CheckCircle}
                label="วันที่เข้าร่วม"
                value={DataUser.joinDays}
                color="#10B981"
                percentage={(
                  (DataUser.joinDays / studentData.attendance.totalDays) *
                  100
                ).toFixed(1)}
              />
              <AttendanceCard
                icon={XCircle}
                label="วันที่ขาด"
                value={DataUser.absentDays}
                color="#EF4444"
                percentage={(
                  (DataUser.absentDays / studentData.attendance.totalDays) *
                  100
                ).toFixed(1)}
              />
              <AttendanceCard
                icon={Clock}
                label="วันที่มาสาย"
                value={DataUser.lateDays}
                color="#F59E0B"
                percentage={(
                  (DataUser.lateDays / studentData.attendance.totalDays) *
                  100
                ).toFixed(1)}
              />
              <AttendanceCard
                icon={Pause}
                label="วันที่ลา"
                value={DataUser.leaveDays}
                color="#8B5CF6"
                percentage={(
                  (DataUser.leaveDays / studentData.attendance.totalDays) *
                  100
                ).toFixed(1)}
              />
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Behavior Score */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    คะแนนความประพฤติ
                  </h3>
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      DataUser.behaviorScore >= 80
                        ? "text-green-600"
                        : DataUser.behaviorScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {DataUser.behaviorScore}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        DataUser.behaviorScore >= 80
                          ? "bg-green-600"
                          : DataUser.behaviorScore >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${DataUser.behaviorScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {DataUser.behaviorScore >= 80
                      ? "ความประพฤติดีมาก"
                      : DataUser.behaviorScore >= 60
                      ? "ความประพฤติดี"
                      : "ต้องปรับปรุง"}
                  </p>
                </div>
              </div>

              {/* Today's Schedule Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ตารางเรียนวันนี้{" "}
                    <p className="text-xs text-red-500">* ยังไม่เปิดใช้งาน</p>
                  </h3>
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <div className="space-y-3">
                  
                </div>
                <button
                  onClick={() => setSelectedTab("schedule")}
                  className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ดูตารางเรียนทั้งหมด →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {selectedTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                สถิติการเข้าเรียน{" "}
                <p className="text-xs text-red-500">* ยังไม่เปิดใช้งาน</p>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {studentData.attendance.totalDays}
                  </p>
                  <p className="text-sm text-gray-600">วันเรียนทั้งหมด</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {studentData.attendance.present}
                  </p>
                  <p className="text-sm text-gray-600">วันที่มาเรียน</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {studentData.attendance.absent}
                  </p>
                  <p className="text-sm text-gray-600">วันที่ขาดเรียน</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {studentData.attendance.late}
                  </p>
                  <p className="text-sm text-gray-600">วันที่มาสาย</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {studentData.attendance.excused}
                  </p>
                  <p className="text-sm text-gray-600">วันที่ลา</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  เปรียบเทียบผลการเข้าเรียน
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      อัตราการมาเรียน
                    </span>
                    <span className="font-medium text-green-600">
                      {(
                        (studentData.attendance.present /
                          studentData.attendance.totalDays) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (studentData.attendance.present /
                            studentData.attendance.totalDays) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {selectedTab === "schedule" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                ตารางเรียนประจำวัน{" "}
                <p className="text-xs text-red-500">* ยังไม่เปิดใช้งาน</p>
              </h2>
              <div className="text-sm text-gray-600">
                วันจันทร์ที่ 15 มีนาคม 2567
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      คาบ
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      เวลา
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      วิชา
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      ครูผู้สอน
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      ห้องเรียน
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Behavior Tab */}
        {selectedTab === "behavior" && (
          <div className="space-y-6">
            {/* Behavior Score Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  ประวัติความประพฤติ{" "}
                  <p className="text-xs text-red-500">* ยังไม่เปิดใช้งาน</p>
                </h2>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    คะแนนรวม: {DataUser.behaviorScore}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {behaviorRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          record.type === "ดี"
                            ? "bg-green-100"
                            : record.type === "เสีย"
                            ? "bg-red-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {record.type === "ดี" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : record.type === "เสีย" ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.description}
                        </p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.score.includes("+")
                          ? "bg-green-100 text-green-800"
                          : record.score.includes("-")
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.score}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  เกณฑ์การประเมิน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">
                      ดีเยี่ยม (80-100):
                    </span>
                    <span className="text-gray-600"> ความประพฤติดีมาก</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-700">
                      ดี (60-79):
                    </span>
                    <span className="text-gray-600"> ความประพฤติดี</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">
                      ต้องปรับปรุง (0-59):
                    </span>
                    <span className="text-gray-600"> ต้องปรับปรุงพฤติกรรม</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Attendance Page */}
        {selectedTab === "scan" && <AttendanceCheckPage session={session} />}
      </div>

      {/* Action Buttons */}
      <div className="hidden fixed bottom-6 right-6 flex-col space-y-3">
        <button
          onClick={() => showAlert("success", "สำเร็จ", "ส่งข้อมูลแล้ว")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <BookOpen className="w-6 h-6" />
        </button>
        <button
          title="ดาวน์โหลดรายงาน"
          onClick={() => showAlert("info", "ข้อมูล", "ดาวน์โหลดรายงาน")}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Award className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
