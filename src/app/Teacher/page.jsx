"use client";
import { useEffect, useState } from "react";
import Nav from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

import {
  Camera,
  Users,
  Settings,
  Plus,
  Edit,
  Trsh2,
  Save,
  X,
  QrCode,
  GraduationCap,
  BookOpen,
  UserRoundCheck,
  Calendar,
  BarChart3,
  UserStar,
} from "lucide-react";
import StatisticsPage from "../components/Statistics/page";
import SchedulePage from "../components/Schedule/page";
import StudentManagement from "../components/StudentManagement/page";
import AttendanceCheckPage from "../components/AttendanceCheck/page";
import { redirect, useRouter } from "next/navigation";

const StudentAttendanceSystem = () => {
  const [currentPage, setCurrentPage] = useState("scan");
  const router = useRouter();
  
  const { data: session, status } = useSession();
  Swal.close();
  console.log(session);
  if (!session?.user?.role === "teacher" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher" && session?.user?.isAdmin) redirect("/teacher/admin");
  if (session?.user?.role === "student") return redirect("/dashboard");
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav session={session} />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <GraduationCap size={32} className="text-blue-600" />
              <div className="text-sm font-bold text-gray-800">
                ระบบเช็คชื่อโรงเรียน
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage("scan")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "scan"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <QrCode size={20} />
                <p className="hidden md:inline">เช็คชื่อ</p>
              </button>
              <button
                onClick={() => setCurrentPage("students")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "students"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Users size={20} />
                <p className="hidden md:inline">นักเรียน</p>
              </button>
              <button
                onClick={() => setCurrentPage("schedule")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "schedule"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Calendar size={20} />
                <p className="hidden md:inline">ตารางเรียน</p>
              </button>
              <button
                onClick={() => setCurrentPage("reports")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "reports"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <BookOpen size={20} />
                <p className="hidden md:inline">รายงาน</p>
              </button>
              <button
                onClick={() => setCurrentPage("statistics")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "statistics"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <BarChart3 size={20} />
                <p className="hidden md:inline">สถิติ</p>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">
        {currentPage === "scan" && <AttendanceCheckPage />}
        {currentPage === "students" && <StudentManagement />}
        {currentPage === "schedule" && <SchedulePage />}
        {currentPage === "statistics" && <StatisticsPage />}
      </main>
      <Footer />
    </div>
  );
};

export default StudentAttendanceSystem;
