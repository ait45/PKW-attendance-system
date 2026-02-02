"use client";

import React from "react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer/page";
import Link from "next/link";
import { FileText, Shield, UserCheck, AlertTriangle, Lock, BookOpen, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Route } from "next";

function TermsOfService() {
  const { data: session } = useSession();

  const sections = [
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: "1. การใช้งานระบบ",
      content: [
        "ผู้ใช้งานจะต้องใช้ระบบเพื่อวัตถุประสงค์ทางการศึกษาเท่านั้น",
        "ห้ามใช้ระบบในทางที่ผิดกฎหมายหรือขัดต่อระเบียบของโรงเรียน",
        "ผู้ใช้งานต้องรักษาความลับของข้อมูลการเข้าสู่ระบบของตนเอง",
        "ห้ามแชร์บัญชีผู้ใช้หรือรหัสผ่านกับบุคคลอื่น",
      ],
    },
    {
      icon: <Lock className="w-6 h-6 text-green-600" />,
      title: "2. ความเป็นส่วนตัวและข้อมูล",
      content: [
        "ข้อมูลส่วนบุคคลของผู้ใช้จะถูกเก็บรักษาอย่างปลอดภัย",
        "ข้อมูลจะถูกใช้เพื่อการบริหารจัดการระบบการศึกษาเท่านั้น",
        "โรงเรียนจะไม่เปิดเผยข้อมูลส่วนบุคคลแก่บุคคลภายนอกโดยไม่ได้รับอนุญาต",
        "ผู้ใช้มีสิทธิ์ร้องขอการแก้ไขหรือลบข้อมูลส่วนบุคคลของตนเอง",
      ],
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "3. ความรับผิดชอบของผู้ใช้",
      content: [
        "ผู้ใช้ต้องรายงานการเข้าถึงบัญชีโดยไม่ได้รับอนุญาตทันที",
        "ผู้ใช้มีหน้าที่รักษาความถูกต้องของข้อมูลที่ตนเองกรอก",
        "การกระทำใดๆ ที่เกิดขึ้นบนบัญชีผู้ใช้ถือเป็นความรับผิดชอบของเจ้าของบัญชี",
        "ห้ามพยายามเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต",
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      title: "4. ข้อจำกัดและบทลงโทษ",
      content: [
        "การละเมิดข้อกำหนดอาจนำไปสู่การระงับสิทธิ์การใช้งานระบบ",
        "การกระทำผิดร้ายแรงอาจถูกดำเนินการตามระเบียบของโรงเรียน",
        "โรงเรียนสงวนสิทธิ์ในการยกเลิกบัญชีผู้ใช้ที่ละเมิดข้อกำหนด",
        "ผู้ใช้อาจต้องรับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานที่ไม่เหมาะสม",
      ],
    },
    {
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      title: "5. การเปลี่ยนแปลงข้อกำหนด",
      content: [
        "โรงเรียนสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดการใช้งานได้ตลอดเวลา",
        "ผู้ใช้จะได้รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงข้อกำหนดที่สำคัญ",
        "การใช้งานระบบต่อไปหลังจากมีการเปลี่ยนแปลงถือว่ายอมรับข้อกำหนดใหม่",
      ],
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-blue-50">
      <Nav session={session} />
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#009EA3] rounded-2xl shadow-lg mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-2">
              ข้อกำหนดการใช้งาน
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              PKW Service System <br className="sm:hidden" /><span className="hidden sm:inline">-</span> ระบบบริการโรงเรียนพระแก้วอาสาวิทยา
            </p>
          </header>

          {/* Terms Content */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2 pl-2">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-[#009EA3] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Agreement Notice */}
          <div className="mt-6 bg-linear-to-r from-[#009EA3] to-[#00CAD1] rounded-xl p-5 sm:p-6 text-white text-center shadow-lg">
            <p className="text-sm sm:text-base mb-2">
              การเข้าสู่ระบบถือว่าคุณยอมรับข้อกำหนดการใช้งานทั้งหมด
            </p>
            <p className="text-xs opacity-80">
              อัปเดตล่าสุด: มกราคม 2569
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center ">
            <Link
              href={"/login" as Route}
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#009EA3] rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> <p>กลับไปหน้าเข้าสู่ระบบ</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default TermsOfService;
