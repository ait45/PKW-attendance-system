"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Mail,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const SideBar = ({ activeMenu, setActiveMenu, session, onOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      onOpen({ isCollapsed, isMobile: mobile });
    };

    checkMobile();
    window.addEventListener("reset", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isCollapsed]);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "settings", label: "ตั้งค่า", icon: Settings },
  ];
  const toggleSideBar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      onOpen({ isCollapsed: newState, isMobile });
      return newState;
    });
  };
  const handleMenuClick = (itemId) => {
    setActiveMenu(itemId);
  };

  return (
    <main className="flex min-h-screen bg-gray-100 w-auto">
      {/* Sidebar */}
      <div
        className={`relative bg-[#009EA3] text-white transition-all duration-300 ease-in shadow-2xl ${
          isCollapsed ? `w-16` : `w-60`
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
                      isCollapsed ? "justify-center" : "justify-start space-x-3"
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

export default SideBar;
