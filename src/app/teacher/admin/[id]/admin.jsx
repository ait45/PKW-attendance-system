"use client";
import { useEffect, useState } from "react";
import Nav from "@/app/components/Navbar";
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
  Pin,
  Search,
  ChevronLeft,
  ChevronRight,
  UserRound,
  ShieldUser,
} from "lucide-react";
import StatisticsPage from "@/app/components/Statistics/page";
import SchedulePage from "@/app/components/Schedule/page";
import StudentManagement from "@/app/components/StudentManagement";
import AttendanceCheckPage from "@/app/components/AttendanceCheck";
import TableAttendance from "@/app/components/tableAttendance";
import Dashboard from "@/app/components/Dashboard/page";
import ReportPage from "@/app/components/Report/page";
import QRDownload from "@/app/components/QRDownload";
import Teacher_Management from "@/app/components/TeacherManagement";
import SettingsPage from "@/app/components/settings/page";
import MenuBar from "@/app/components/MenuBar_teacher";
import Notifications from "@/app/components/Notifications/page";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";

function adminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  Swal.close();

  const currentPage = searchParams.get("page") || "dashboard";
  const handleChangePage = (pageName) => {
    router.push(`${pathname}?page=${pageName}`);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.addEventListener("resize", checkMobile);
  }, []);

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
      { id: "notifications", label: "ประกาศ", icon: Pin },
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
                    <ShieldUser className="w-5 h-5" />
                  </div>
                  {session?.user?.role === "teacher" &&
                  session?.user?.isAdmin === true ? (
                    <span className="font-bold text-xl cursor-default">
                      หน้าผู้ดูแลระบบ
                    </span>
                  ) : (
                    <span className="font-bold text-xl cursor-default">
                      หน้าบุคลากร
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

  // ตรวจสอบ session ต่างๆ
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
    <main className="min-h-screen bg-gray-100">
      <Nav session={session} />
      {/* Navigation */}
      <MenuBar currentPage={currentPage} handleChangePage={handleChangePage} />
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mb-4 w-full">
        <SideBar
          activeMenu={currentPage}
          setActiveMenu={handleChangePage}
          session={session}
        />
        <main
          className={`flex-1 py-1 w-full overflow-y-scroll hide-scrollbar duration-300 ${
            isCollapsed ? "inline" : isMobile && "hidden"
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
          {currentPage === "PDFDownload" && (
            <QRDownload session={session} setBack={handleChangePage} />
          )}
          {currentPage === "schedule" && <SchedulePage session={session} />}
          {currentPage === "statistics" && <StatisticsPage session={session} />}
          {currentPage === "reports" && <ReportPage session={session} />}
          {currentPage === "teachers" && (
            <Teacher_Management session={session} />
          )}
          {currentPage === "settings" && <SettingsPage />}
          {currentPage === "notifications" && (
            <Notifications session={session} />
          )}
        </main>
      </div>
      <Footer />
    </main>
  );
}

export default adminPage;
