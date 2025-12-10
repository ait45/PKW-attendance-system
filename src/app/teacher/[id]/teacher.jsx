"use client";
import { useEffect, useState } from "react";
import Nav from "@/app/components/Navbar/page";
import Footer from "@/app/components/Footer/page";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import {
  Home,
  UserRound,
  Settings,
  FileText,
  Mail,
  Database,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatisticsPage from "@/app/components/Statistics/page";
import SchedulePage from "@/app/components/Schedule/page";
import StudentManagement from "@/app/components/StudentManagement/page";
import AttendanceCheckPage from "@/app/components/AttendanceCheck/page";
import TableAttendance from "@/app/components/tableAttendance/page";
import QRDownload from "@/app/components/QRDownload/page";
import {
  redirect,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import Dashboard from "@/app/components/Dashboard/page";
import ReportPage from "@/app/components/Report/page";
import Teacher_Management from "@/app/components/TeacherManagement/page";
import SettingsPage from "@/app/components/settings/page";
import MenuBar from "@/app/components/MenuBar_teacher/page";

function TeacherPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "messages", label: "Messages", icon: Mail },
      { id: "teachers", label: "ข้อมูลครู", icon: UserRound },
      { id: "settings", label: "ตั้งค่า", icon: Settings },
    ];

    const toggleSideBar = () => {
      setIsCollapsed((prev) => {
        const newState = !prev;
        return newState;
      });
    };

    const handleMenuClick = (itemId) => {
      setActiveMenu(itemId);
    };
    console.log(isMobile);
    return (
      <main className="flex min-h-screen bg-gray-100 w-auto">
        {/* Sidebar */}
        <div
          className={`relative bg-[#009EA3] text-white transition-all duration-300 ease-in-out shadow-2xl ${
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

  Swal.close();
  if (!session?.user?.role === "teacher" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher" && session?.user?.isAdmin)
    return redirect(`/teacher/admin/${session?.id}`);
  if (session?.user?.role === "student")
    return redirect(`/student/${session?.id}`);
  if (session?.user?.role === "student" && session?.user?.isAdmin)
    return redirect(`/student/admin/${session?.id}`);
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav session={session} />
      {/* Navigation */}
      <MenuBar currentPage={currentPage} handleChangePage={handleChangePage} />
      <main className="flex h-screen">
        <SideBar
          activeMenu={currentPage}
          setActiveMenu={handleChangePage}
          session={session}
        />
        <main
          className={`flex-1 py-1 w-full overflow-auto ${
            isCollapsed && "inline"
          } ${isMobile ? "hidden" : "inline"}`}
        >
          {currentPage === "dashboard" && <Dashboard session={session} />}
          {currentPage === "scan" && <AttendanceCheckPage session={session} />}
          {currentPage === "tableAttendance" && (
            <TableAttendance session={session} />
          )}
          {currentPage === "students" && (
            <StudentManagement session={session} setMenu={handleChangePage} />
          )}
          {currentPage === "schedule" && <SchedulePage session={session} />}
          {currentPage === "statistics" && <StatisticsPage session={session} />}
          {currentPage === "PDFStudent" && (
            <QRDownload setBack={handleChangePage} />
          )}
          {currentPage === "reports" && <ReportPage session={session} />}
          {currentPage === "teachers" && <Teacher_Management />}
          {currentPage === "settings" && <SettingsPage />}
        </main>
      </main>
      <Footer />
    </div>
  );
}

export default TeacherPage;
