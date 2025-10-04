import React from "react";
import { FileOutput, FileSpreadsheet, FolderOpen } from "lucide-react";
function Report({ session }) {
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
          <h1>- คะแนนความประพฤตินักเรียนทั้งหมด</h1>
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
