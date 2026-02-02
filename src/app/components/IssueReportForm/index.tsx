"use client";

import { useState } from "react";
import { Bug, Lightbulb, HelpCircle, MessageSquare, Send, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function IssueReportForm() {
  const [formData, setFormData] = useState({
    type: "bug",
    title: "",
    description: "",
    reportedBy: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const typeOptions = [
    { value: "bug", label: "แจ้งปัญหา/บัค", icon: Bug, color: "text-red-500" },
    { value: "suggestion", label: "เสนอแนะ", icon: Lightbulb, color: "text-yellow-500" },
    { value: "question", label: "สอบถาม", icon: HelpCircle, color: "text-blue-500" },
    { value: "other", label: "อื่นๆ", icon: MessageSquare, color: "text-gray-500" },
  ];

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      Swal.fire("กรุณากรอกข้อมูล", "หัวข้อและรายละเอียดจำเป็นต้องกรอก", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/issue-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        Swal.fire("สำเร็จ!", "ส่งเรื่องร้องเรียนเรียบร้อยแล้ว", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", data.message || "", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: "bug", title: "", description: "", reportedBy: "", studentId: "" });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ส่งเรื่องสำเร็จ!</h2>
          <p className="text-gray-500 mb-6">ขอบคุณสำหรับการแจ้งปัญหา เราจะดำเนินการตรวจสอบโดยเร็วที่สุด</p>
          <button
            onClick={resetForm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ส่งเรื่องใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">แจ้งปัญหา / เสนอแนะ</h1>
            <p className="text-sm text-gray-500">กรุณากรอกข้อมูลเพื่อแจ้งปัญหา <br className="sm:hidden"/>หรือข้อเสนอแนะ</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, type: option.value })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                    formData.type === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หัวข้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น ระบบสแกน QR ใช้งานไม่ได้"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs sm:placeholder:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="อธิบายรายละเอียดปัญหาหรือข้อเสนอแนะ..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs sm:placeholder:text-sm"
            />
          </div>

          {/* Optional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้แจ้ง (ไม่บังคับ)</label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                placeholder="ชื่อ-นามสกุล"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs sm:placeholder:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักเรียน (ไม่บังคับ)</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="1234"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs sm:placeholder:text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>กำลังส่ง...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                ส่งเรื่อง
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
