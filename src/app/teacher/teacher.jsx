"use client";
import { useEffect, useState } from "react";
import Nav from "../components/Navbar/page";
import Footer from "../components/Footer/page";
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
import StatisticsPage from "../components/Statistics/page";
import SchedulePage from "../components/Schedule/page";
import StudentManagement from "../components/StudentManagement/page";
import AttendanceCheckPage from "../components/AttendanceCheck/page";
import TableAttendance from "../components/tableAttendance/page";
import { redirect, useRouter } from "next/navigation";

function TeacherPage() {
  const [currentPage, setCurrentPage] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();
  Swal.close();
  if (!session?.user?.role === "teacher" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher" && session?.user?.isAdmin)
    redirect("/teacher/admin");
  if (session?.user?.role === "student") return redirect("/dashboard");
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  const SideBar = ({ activeMenu, setActiveMenu }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "messages", label: "Messages", icon: Mail },
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "settings", label: "Settings", icon: Settings },
    ];
    const toggleSideBar = () => {
      setIsCollapsed(!isCollapsed);
    };
    const handleMenuClick = (itemId) => {
      setActiveItem(itemId);
    };

    return (
      <main className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`relative bg-[#009EA3] text-white transition-all duration-300 ease-in shadow-2xl ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-lg cursor-default">
                      P
                    </span>
                  </div>
                  <span className="font-bold text-xl cursor-default">
                    หน้า Admin
                  </span>
                </div>
              )}
              <button
                onClick={toggleSideBar}
                className="p-1.5 rounded-lg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {/* navigation */}

          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 hover:translate-x-1 group relative ${
                        isActive ? "bg-white/20 shadow-lg" : ""
                      } ${
                        isCollapsed
                          ? "justify-center"
                          : "justify-start space-x-3"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium flex-1 text-left">
                            {item.label}
                          </span>
                        </>
                      )}
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-0 w-1 h-8 bg-white rounded-l-full" />
                      )}

                      {/* Tooltip for collapsed state */}

                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </main>
    );
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav session={session} />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
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
      <main className="flex w-full">
        <SideBar />
        <main className="py-4 w-full">
          {currentPage === "scan" && <AttendanceCheckPage />}
          {currentPage === "tableAttendance" && <TableAttendance />}
          {currentPage === "students" && <StudentManagement />}
          {currentPage === "schedule" && <SchedulePage />}
          {currentPage === "statistics" && <StatisticsPage />}
        </main>
      </main>
      <Footer />
    </div>
  );
}

export default TeacherPage;
