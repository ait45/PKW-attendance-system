"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Eye,
  X,
} from "lucide-react";

interface IssueReport {
  _id: string;
  type: "bug" | "suggestion" | "question" | "other";
  title: string;
  description: string;
  reportedBy: string;
  studentId: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminNote: string;
  createdAt: string;
}

interface Stats {
  pending: number;
  in_progress: number;
  resolved: number;
  closed: number;
  total: number;
}

export default function IssueReportManagement() {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, in_progress: 0, resolved: 0, closed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [editData, setEditData] = useState({ status: "", priority: "", adminNote: "" });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter, type: typeFilter });
      const res = await fetch(`/api/issue-reports?${params}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.data.reports);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleUpdate = async () => {
    if (!selectedReport) return;
    try {
      const res = await fetch("/api/issue-reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedReport._id, ...editData }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReport(null);
        fetchReports();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openDetail = (report: IssueReport) => {
    setSelectedReport(report);
    setEditData({ status: report.status, priority: report.priority, adminNote: report.adminNote });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      bug: <Bug className="w-4 h-4 text-red-500" />,
      suggestion: <Lightbulb className="w-4 h-4 text-yellow-500" />,
      question: <HelpCircle className="w-4 h-4 text-blue-500" />,
      other: <MessageSquare className="w-4 h-4 text-gray-500" />,
    };
    return icons[type] || icons.other;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    const labels: Record<string, string> = {
      pending: "รอดำเนินการ",
      in_progress: "กำลังดำเนินการ",
      resolved: "แก้ไขแล้ว",
      closed: "ปิด",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 จัดการเรื่องร้องเรียน</h1>
            <p className="text-gray-500 text-sm">รายการแจ้งปัญหาและข้อเสนอแนะจากผู้ใช้</p>
          </div>
          <button onClick={fetchReports} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-gray-500">ทั้งหมด</p><p className="text-xl font-bold">{stats.total}</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100"><p className="text-xs text-yellow-600">รอดำเนินการ</p><p className="text-xl font-bold text-yellow-700">{stats.pending}</p></div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100"><p className="text-xs text-blue-600">กำลังดำเนินการ</p><p className="text-xl font-bold text-blue-700">{stats.in_progress}</p></div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-100"><p className="text-xs text-green-600">แก้ไขแล้ว</p><p className="text-xl font-bold text-green-700">{stats.resolved}</p></div>
          <div className="bg-gray-50 rounded-xl p-3 border"><p className="text-xs text-gray-500">ปิด</p><p className="text-xl font-bold text-gray-700">{stats.closed}</p></div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm">
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="in_progress">กำลังดำเนินการ</option>
            <option value="resolved">แก้ไขแล้ว</option>
            <option value="closed">ปิด</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm">
            <option value="all">ประเภททั้งหมด</option>
            <option value="bug">แจ้งปัญหา</option>
            <option value="suggestion">เสนอแนะ</option>
            <option value="question">สอบถาม</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><Loader className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>ไม่มีข้อมูล</p></div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">ประเภท</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">หัวข้อ</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">สถานะ</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">ผู้แจ้ง</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">วันที่</th>
                  <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{getTypeIcon(r.type)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">{r.title}</td>
                    <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.reportedBy || "ไม่ระบุ"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => openDetail(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">รายละเอียด</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div><p className="text-xs text-gray-500">หัวข้อ</p><p className="font-medium">{selectedReport.title}</p></div>
              <div><p className="text-xs text-gray-500">รายละเอียด</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500 mb-1">สถานะ</p>
                  <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="pending">รอดำเนินการ</option>
                    <option value="in_progress">กำลังดำเนินการ</option>
                    <option value="resolved">แก้ไขแล้ว</option>
                    <option value="closed">ปิด</option>
                  </select>
                </div>
                <div><p className="text-xs text-gray-500 mb-1">ระดับความสำคัญ</p>
                  <select value={editData.priority} onChange={(e) => setEditData({ ...editData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">สูง</option>
                    <option value="urgent">ด่วน</option>
                  </select>
                </div>
              </div>
              <div><p className="text-xs text-gray-500 mb-1">หมายเหตุ Admin</p>
                <textarea value={editData.adminNote} onChange={(e) => setEditData({ ...editData, adminNote: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="เพิ่มหมายเหตุ..." />
              </div>
              <button onClick={handleUpdate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
