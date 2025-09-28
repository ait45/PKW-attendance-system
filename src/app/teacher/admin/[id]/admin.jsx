"use client";
import { useEffect, useState } from "react";
import Nav from "../../../components/Navbar/page";
import Footer from "../../../components/Footer/page";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import {
  Home,
  Users,
  Settings,
  FileText,
  Mail,
  Database,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  QrCode,
  GraduationCap,
  BookOpen,
  UserRoundCheck,
  Calendar,
  BarChart3,
} from "lucide-react";
import SideBar from "@/app/components/SideBar/page";
import StatisticsPage from "../../../components/Statistics/page";
import SchedulePage from "../../../components/Schedule/page";
import StudentManagement from "../../../components/StudentManagement/page";
import AttendanceCheckPage from "../../../components/AttendanceCheck/page";
import TableAttendance from "../../../components/tableAttendance/page";
import { redirect, useRouter } from "next/navigation";

function adminPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const router = useRouter();

  const { data: session, status } = useSession();
  Swal.close();
  if (!session?.user?.role === "teacher" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher" && !session?.user?.isAdmin)
    return redirect(`/teacher/${session?.id}`);
  if (session?.user?.role === "student" && !session?.user?.isAdmin)
    return redirect(`/student/${session?.id}`);
  if (session?.user?.role === "student" && session?.user?.isAdmin)
    return redirect(`/student/admin/${session?.id}`);
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav session={session} />
      {/* Navigation */}
      <nav className="bg-white shadow-lg max-w-full">
        <div className="w-full mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <GraduationCap size={32} className="text-blue-600" />
              <div className="text-sm font-bold text-gray-800 hidden sm:inline">
                โรงเรียนพระแก้วอาสาวิทยา
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors rounded-md">
                <QrCode size={20} />
                <select
                  className="outline-none w-[120px] text-sm focus:text-gray-900"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  id="attendance"
                >
                  <option value="">หน้าแรก</option>
                  <option value="scan">เช็คชื่อ</option>
                  <option value="tableAttendance">ตารางการเช็คชื่อ</option>
                </select>
              </div>
              <button
                onClick={() => setCurrentPage("students")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === "students"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="นักเรียน"
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
                title="ตารางเรียน"
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
                title="รายงาน"
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
                title="สถิติ"
              >
                <BarChart3 size={20} />
                <p className="hidden md:inline">สถิติ</p>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex h-screen mb-4">
        <SideBar
          activeMenu={currentPage}
          setActiveMenu={setCurrentPage}
          session={session}
        />
        <main className="flex-1 py-4 w-full overflow-auto">
          {currentPage === "scan" && <AttendanceCheckPage session={session} />}
          {currentPage === "tableAttendance" && (
            <TableAttendance session={session} />
          )}
          {currentPage === "students" && (
            <StudentManagement session={session} />
          )}
          {currentPage === "schedule" && <SchedulePage session={session} />}
          {currentPage === "statistics" && <StatisticsPage session={session} />}
        </main>
      </main>
      <Footer />
    </div>
  );
}

export default adminPage;
