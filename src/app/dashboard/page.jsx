"use client";
import { useRef, useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Home,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import QRScanning from "../components/QRScanning/page";
import Nav from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
const AttendanceCheckPage = () => {
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        เช็คชื่อนัเรียน
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mg-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ห้องเรียน
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="#">texst</option>
          </select>
        </div>
      </div>
    </div>
  </div>;
};

function dashboard() {
  const { data: session, status } = useSession();
  const lastRequestTime = useRef(0);
  if (!session?.user?.role === "student" && status === "unauthenticated")
    redirect("/login");
  if (session?.user?.role === "teacher") return redirect("/login");
  if (!session && status === "unauthenticated") return redirect("/login");
  if (status === "loading") return null;
  Swal.close();
  async function handleScan(req) {
    const now = Date.now();
    if (now - lastRequestTime.current < 1000) {
      Swal.fire({
        width: '60%',
        didOpen: () => {
          Swal.showLoading();
        },
      })
      return;
    }
    lastRequestTime.current = now;
    try {
      const res = await fetch("http://localhost:3000/api/scanAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: req }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        Swal.fire({
          title: "สแกนสำเร็จ",
          text: data.message,
          icon: "success",
          timer: 3000,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          title: "สแกนไม่สำเร็จ",
          text: data.message,
          icon: "error",
          timer: 3000,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="bg-[#AFFDFF]">
      <Nav session={session} />
      <AttendanceCheckPage />
      <QRScanning onScan={handleScan} label="Check-in" />
      <Footer />
    </main>
  );
}

export default dashboard;
