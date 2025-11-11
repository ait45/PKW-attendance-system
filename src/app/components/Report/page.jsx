import React, { useEffect } from "react";
import { FileOutput, FileSpreadsheet, FolderOpen } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ShowAlert from "../Sweetalert";
function Report({ session }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = searchParams.get("type");

  useEffect(() => {
    if (!params) return;
    const processPDF = async (typeFile) => {
      try {
        const res = await fetch(`/api/generate-pdf/${typeFile}`);
        if (!res.ok) throw new Error("Download failed");
        const contentDisposition = res.headers.get("Content-Disposition");

        let fileName = `${typeFile}.pdf`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            fileName = decodeURIComponent(match[1]); // รองรับชื่อไฟล์ภาษาไทย
          }
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        ShowAlert({ title: "Download Failed", error: "error" });
      }
    };
    processPDF(params);
    const path = new URLSearchParams(window.location.search);
    path.delete("type");
    
    const newQuery = params.toString();
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
    router.replace(newUrl);
  }, [params]);

  return (
    <main className="max-w-7xl p-4">
      <div className="bg-white rounded-xl shadow-xl p-4">
        <header className="text-base md:text-xl font-bold flex items-center">
          <FolderOpen className="mr-2" /> เมนูแสดงการรายงานต่าง ๆ
        </header>
        {/* รายการฟังก์ชั่นรายงานทั้งหมด */}
        <div className="text-sm mt-4">
          <h1>- ไฟล์แสดงรายชื่อนักเรียน</h1>
          <p className="text-red-500 text-xs">
            ที่มีคะแนนความประพฤติต่ำกว่าเกณฑ์
          </p>
          <div className="flex m-2">
            <a
              href="?type=studentRandomly"
              className="flex items-center mr-2 text-blue-700"
            >
              <FileOutput />
              ไฟล์ PDF
            </a>
            <a href="#" className="flex items-center text-green-700">
              <FileSpreadsheet />
              ไฟล์ Excel
            </a>
          </div>
        </div>
        <div className="text-sm mt-4">
          <h1>- คะแนนความประพฤตินักเรียนทั้งหมด</h1>
          <div className="flex m-2">
            <Link
              href={`${pathname}?${searchParams}&type=report_student-behaviorScore-all`}
              className="flex items-center mr-2 text-blue-700"
            >
              <FileOutput />
              ไฟล์ PDF
            </Link>
            <a href="#" className="flex items-center text-green-700">
              <FileSpreadsheet />
              ไฟล์ Excel
            </a>
          </div>
        </div>
        <div className="text-sm mt-4">
          <h1>- การเช็คชื่อวันนี้</h1>
          <div className="flex m-2">
            <a href="#" className="flex items-center mr-2 text-blue-700">
              <FileOutput />
              ไฟล์ PDF
            </a>
            <a href="#" className="flex items-center text-green-700">
              <FileSpreadsheet />
              ไฟล์ Excel
            </a>
          </div>
        </div>
        <div className="text-sm mt-4">
          <h1>- ประวัติการเช็คชื่อย้อนหลัง 3 เดือน</h1>
          <div className="flex m-2">
            <a href="#" className="flex items-center mr-2 text-blue-700">
              <FileOutput />
              ไฟล์ PDF
            </a>
            <a href="#" className="flex items-center text-green-700">
              <FileSpreadsheet />
              ไฟล์ Excel
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Report;
