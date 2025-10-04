"use client";

import { useState, useEffect } from "react";
import { ChevronsLeft } from "lucide-react";

export default function DownloadPdf({ setBack }) {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);
  const handleOpen = () => {
    if (isMobile) {
      window.open("/api/generate-pdf/qr-student", "_blank");
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pdf/qr-student");

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-students.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl p-6">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="">
          <button
            title="ย้อนกลับ"
            onClick={() => setBack("students")}
            className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronsLeft size={25} />
            <p className="text-xs">ย้อนกลับ</p>
          </button>
          <h1 className="text-[#009EA3]">QR code สำหรับระบบเช็คชื่อ</h1>
        </div>
        <p className="text-red-500 text-xs p-2">* ตัวอย่างก่อนดาวน์โหลด</p>
        <div>
          <div className="mb-4 my-2">
            {isMobile ? (
              <a
                href="/api/generate-pdf/qr-student"
                className="px-4 py-2 bg-green-500 text-white rounded-lg  hover:bg-green-600 transition-colors active:bg-green-600"
              >
                เปิดไฟล์
              </a>
            ) : (
              <div className="mt-2 mb-4">
                <iframe
                  src="/api/generate-pdf/qr-student"
                  width="100%"
                  height="410px"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "กำลังโหลด PDF..." : "ดาวน์โหลด PDF"}
          </button>
        </div>
      </div>
    </main>
  );
}
