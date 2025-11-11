"use client";
import { useEffect, useState } from "react";
import Nav from "@/app/components/Navbar/page";
import Footer from "@/app/components/Footer/page";
import { signOut, useSession } from "next-auth/react";
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
  UserRound,
} from "lucide-react";
import StatisticsPage from "@/app/components/Statistics/page";
import SchedulePage from "@/app/components/Schedule/page";
import StudentManagement from "@/app/components/StudentManagement/page";
import AttendanceCheckPage from "@/app/components/AttendanceCheck/page";
import TableAttendance from "@/app/components/tableAttendance/page";
import Dashboard from "@/app/components/Dashboard/page";
import ReportPage from "@/app/components/Report/page";
import QRDownload from "@/app/components/QRDownload/page";
import Teacher_Management from "@/app/components/TeacherManagement/page";
import SettingsPage from "@/app/components/settings/page";
import { useSearchParams, usePathname, useRouter, redirect } from "next/navigation";

function adminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  Swal.close();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.addEventListener("resize", checkMobile);
  }, []);

  const currentPage = searchParams.get("page") || "dashboard";
  const handleChangePage = (pageName) => {
    router.push(`${pathname}?page=${pageName}`);
  };
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const SideBar = ({ activeMenu, setActiveMenu, session }) => {
    

    const toggleSideBar = () => {
      setIsCollapsed((prev) => {
        const newState = !prev;
        return newState;
      });
    };

    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "messages", label: "Messages", icon: Mail },
      { id: "teachers", label: "ข้อมูลครู", icon: UserRound },
      { id: "settings", label: "ตั้งค่า", icon: Settings },
    ];
    const handleMenuClick = (itemId) => {
      setActiveMenu(itemId);
    };

    return (
      <main className="flex min-h-screen bg-gray-100 w-auto">
        {/* Sidebar */}
        <div
          className={`relative bg-[#009EA3] text-white transition-all duration-500 ease-initial shadow-2xl ${
            isCollapsed ? "w-16" : "w-60"
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
                  {session?.user?.role === "teacher" &&
                  session?.user?.isAdmin === true ? (
                    <span className="font-bold text-xl cursor-default">
                      หน้า Admin
                    </span>
                  ) : (
                    <span className="font-bold text-xl cursor-default">
                      หน้า Teacher
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={toggleSideBar}
                className="p-1.5 rounded-lg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                title={`${isCollapsed ? "เปิดเมนู" : "ปิดเมนู"}`}
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
                const isActive = activeMenu === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center px-3 py-4 rounded-xl transition-all duration-200 hover:bg-white/10 hover:translate-x-1 group relative ${
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
              <div
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors rounded-md"
                title={currentPage}
              >
                <QrCode size={20} />
                <select
                  className="outline-none w-[20px] sm:w-[120px] text-sm focus:text-gray-900 cursor-pointer"
                  value={currentPage}
                  onChange={(e) => handleChangePage(e.target.value)}
                  id="attendance"
                >
                  <option value="dashboard">หน้าแรก</option>
                  <option value="scan">เช็คชื่อ</option>
                  <option value="tableAttendance">ตารางการเช็คชื่อ</option>
                </select>
              </div>
              <button
                onClick={() => handleChangePage("students")}
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
                onClick={() => handleChangePage("schedule")}
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
                onClick={() => handleChangePage("reports")}
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
                onClick={() => handleChangePage("statistics")}
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
      <main className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mb-4">
        <SideBar
          activeMenu={currentPage}
          setActiveMenu={handleChangePage}
          session={session}
        />
        <main
          className={`flex-1 py-4 w-full overflow-y-scroll hide-scrollbar duration-300 ${
            isCollapsed ? ("inline") : (isMobile && "hidden")
          } `}
        >
          {currentPage === "dashboard" && <Dashboard session={session} />}
          {currentPage === "scan" && <AttendanceCheckPage session={session} />}
          {currentPage === "tableAttendance" && (
            <TableAttendance session={session} />
          )}
          {currentPage === "students" && (
            <StudentManagement session={session} setMenu={handleChangePage} />
          )}
          {currentPage === "PDFDownload" && <QRDownload session={session} setBack={handleChangePage}/>}
          {currentPage === "schedule" && <SchedulePage session={session} />}
          {currentPage === "statistics" && <StatisticsPage session={session} />}
          {currentPage === "reports" && <ReportPage session={session} />}
          {currentPage === "teachers" && <Teacher_Management />}
          {currentPage === "settings" && < SettingsPage />}
        </main>
      </main>
      <Footer />
    </div>
  );
}

export default adminPage;
