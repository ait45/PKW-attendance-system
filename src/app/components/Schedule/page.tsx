"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, BookOpen, User, MapPin, Printer, Download, FileText } from "lucide-react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ScheduleItem {
  ID: number;
  CLASS_ID: string;
  DAY_OF_WEEK: number;
  PERIOD: number;
  SUBJECT: string;
  TEACHER_ID: string;
  TEACHER_NAME: string;
  ROOM: string;
}

const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
const periodTimes = [
  { period: 1, time: "08:40-09:30" },
  { period: 2, time: "09:30-10:20" },
  { period: 3, time: "10:20-11:10" },
  { period: 4, time: "11:10-12:00" },
  { period: 5, time: "13:00-13:50" },
  { period: 6, time: "13:50-14:40" },
  { period: 7, time: "14:50-15:40" },
];

const subjectColors: Record<string, { bg: string; text: string; border: string; print: string }> = {
  "คณิตศาสตร์": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", print: "#E9D5FF" },
  "ภาษาไทย": { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300", print: "#FCE7F3" },
  "ภาษาอังกฤษ": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-300", print: "#CFFAFE" },
  "วิทยาศาสตร์": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", print: "#DBEAFE" },
  "สังคมศึกษา": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", print: "#FEF3C7" },
  "ศิลปะ": { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", print: "#FEE2E2" },
  "สุขศึกษา": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", print: "#D1FAE5" },
  "พลศึกษา": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", print: "#D1FAE5" },
  "default": { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", print: "#F3F4F6" },
};

function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [exporting, setExporting] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [classes] = useState([
    "ม.1",
    "ม.2",
    "ม.3",
    "ม.4",
    "ม.5",
    "ม.6",
  ]);

  useEffect(() => {
    if (selectedClass) {
      fetchSchedule();
    }
  }, [selectedClass]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/schedule?classId=${encodeURIComponent(selectedClass)}`);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลตารางเรียนได้",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForPeriod = (day: number, period: number) => {
    return schedule.find((s) => s.DAY_OF_WEEK === day && s.PERIOD === period);
  };

  const getSubjectColor = (subject: string) => {
    for (const key in subjectColors) {
      if (subject.includes(key)) {
        return subjectColors[key];
      }
    }
    return subjectColors.default;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!scheduleRef.current || !selectedClass) return;
    
    try {
      setExporting(true);
      
      const canvas = await html2canvas(scheduleRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 287;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
      pdf.save(`ตารางเรียน_${selectedClass}_${new Date().toLocaleDateString("th-TH")}.pdf`);
      
      Swal.fire({
        title: "ส่งออกสำเร็จ!",
        text: "ไฟล์ PDF ถูกบันทึกแล้ว",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Export failed:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งออก PDF ได้",
        icon: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!scheduleRef.current || !selectedClass) return;
    
    try {
      setExporting(true);
      
      const canvas = await html2canvas(scheduleRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `ตารางเรียน_${selectedClass}_${new Date().toLocaleDateString("th-TH")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      Swal.fire({
        title: "ส่งออกสำเร็จ!",
        text: "ไฟล์รูปภาพถูกบันทึกแล้ว",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Export failed:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งออกรูปภาพได้",
        icon: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-blue-500 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl print:hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={32} />
              <h1 className="text-2xl md:text-3xl font-bold">ตารางเรียน</h1>
            </div>
            <p className="text-white/80">ตารางเรียน</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
            >
              <option value="" className="text-gray-900">เลือกชั้นเรียน</option>
              {classes.map((c) => (
                <option key={c} value={c} className="text-gray-900">
                  {c}
                </option>
              ))}
            </select>

            {selectedClass && schedule.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                  title="พิมพ์"
                >
                  <Printer size={20} />
                  <span className="hidden sm:inline">พิมพ์</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50"
                  title="ส่งออก PDF"
                >
                  <FileText size={20} />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={handleExportImage}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50"
                  title="ส่งออกรูปภาพ"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">รูปภาพ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!selectedClass ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center print:hidden">
          <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">เลือกชั้นเรียน</h2>
          <p className="text-gray-500">กรุณาเลือกชั้นเรียนเพื่อดูตารางเรียน</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-[400px] print:hidden">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        /* Schedule Table - Days as Columns, Periods as Rows */
        <div 
          ref={scheduleRef}
          className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Print Header */}
          <div className="hidden print:block p-6 text-center border-b-2 border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">ตารางเรียนประจำสัปดาห์</h1>
            <p className="text-lg text-gray-600 mt-1">ชั้น {selectedClass}</p>
            <p className="text-sm text-gray-500 mt-1">ปีการศึกษา 2567</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 print:bg-gray-100">
                  <th className="px-4 py-4 text-left text-sm font-bold text-white print:text-gray-900 border-r border-white/20 print:border-gray-300 w-28">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="print:hidden" />
                      เวลา
                    </div>
                  </th>
                  {dayNames.map((day, i) => (
                    <th
                      key={day}
                      className={`px-4 py-4 text-center text-sm font-bold text-white print:text-gray-900 border-r border-white/20 print:border-gray-300 last:border-r-0 ${
                        new Date().getDay() === i + 1
                          ? "bg-white/20 print:bg-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg">{day}</span>
                        <span className="text-xs opacity-80 print:opacity-100">(วันที่ {i + 1})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodTimes.map(({ period, time }, index) => (
                  <tr 
                    key={period} 
                    className={`border-b border-gray-100 print:border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50/50 print:bg-white" : "bg-white"
                    }`}
                  >
                    {/* Time Column */}
                    <td className="px-3 py-3 bg-gray-100 print:bg-gray-50 border-r border-gray-200 print:border-gray-300">
                      <div className="text-center">
                        <div className="font-bold text-gray-800 text-lg">คาบ {period}</div>
                        <div className="text-xs text-gray-500 mt-1">{time}</div>
                      </div>
                    </td>
                    
                    {/* Day Columns */}
                    {[1, 2, 3, 4, 5].map((day) => {
                      const item = getScheduleForPeriod(day, period);
                      const colors = item ? getSubjectColor(item.SUBJECT) : null;

                      return (
                        <td
                          key={day}
                          className={`px-2 py-2 border-r border-gray-100 print:border-gray-300 last:border-r-0 ${
                            new Date().getDay() === day && !item
                              ? "bg-purple-50/30 print:bg-gray-50"
                              : ""
                          }`}
                        >
                          {item && colors ? (
                            <div
                              className={`p-3 rounded-xl ${colors.bg} ${colors.border} border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] print:shadow-none print:border print:rounded-lg h-full`}
                              style={{ 
                                backgroundColor: colors.print + "66",
                              }}
                            >
                              <div className={`font-bold text-sm ${colors.text} leading-tight`}>
                                {item.SUBJECT}
                              </div>
                              {item.TEACHER_NAME && (
                                <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                  <User size={10} className="print:hidden" />
                                  <span className="truncate">{item.TEACHER_NAME}</span>
                                </div>
                              )}
                              {item.ROOM && (
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} className="print:hidden" />
                                  <span>ห้อง {item.ROOM}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 text-center text-gray-300 text-sm h-full flex items-center justify-center">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print Footer */}
          <div className="hidden print:flex justify-between items-center p-4 border-t-2 border-gray-200 text-sm text-gray-500">
            <span>พิมพ์เมื่อ: {new Date().toLocaleDateString("th-TH", { 
              year: "numeric", 
              month: "long", 
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
            <span>โรงเรียน PKW</span>
          </div>
        </div>
      )}

      {/* Legend */}
      {selectedClass && !loading && schedule.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 print:hidden">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            สัญลักษณ์วิชา
          </h3>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(schedule.map((s) => s.SUBJECT))).map((subject) => {
              const colors = getSubjectColor(subject);
              return (
                <span
                  key={subject}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
                >
                  {subject}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          #schedule-container,
          #schedule-container * {
            visibility: visible;
          }
          #schedule-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          table {
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #d1d5db !important;
          }
        }
      `}</style>
    </main>
  );
}

export default SchedulePage;
