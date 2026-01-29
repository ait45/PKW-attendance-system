"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Filter, Clock, CheckCircle, Eye, X, Key, User } from "lucide-react";

interface PasswordResetRequest {
  _id: string;
  studentId: string;
  studentName: string;
  classes: string;
  reason: string;
  status: "pending" | "acknowledged" | "resolved";
  acknowledgedBy: string;
  acknowledgedAt: string;
  note: string;
  createdAt: string;
}

interface Stats {
  pending: number;
  acknowledged: number;
  resolved: number;
  total: number;
}

export default function PasswordResetManagement() {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, acknowledged: 0, resolved: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [editData, setEditData] = useState({ status: "", note: "" });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      const res = await fetch(`/api/password-reset-request?${params}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data.requests);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch("/api/password-reset-request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRequest._id, ...editData }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openDetail = (request: PasswordResetRequest) => {
    setSelectedRequest(request);
    setEditData({ status: request.status, note: request.note });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      acknowledged: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    };
    const labels: Record<string, string> = {
      pending: "รอดำเนินการ",
      acknowledged: "รับทราบแล้ว",
      resolved: "ดำเนินการแล้ว",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🔑 คำขอรีเซ็ตรหัสผ่าน</h1>
            <p className="text-gray-500 text-sm">รายการคำขอเปลี่ยนรหัสผ่านจากนักเรียน</p>
          </div>
          <button onClick={fetchRequests} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-gray-500">ทั้งหมด</p><p className="text-xl font-bold">{stats.total}</p></div>
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100"><p className="text-xs text-yellow-600">รอดำเนินการ</p><p className="text-xl font-bold text-yellow-700">{stats.pending}</p></div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100"><p className="text-xs text-blue-600">รับทราบแล้ว</p><p className="text-xl font-bold text-blue-700">{stats.acknowledged}</p></div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-100"><p className="text-xs text-green-600">ดำเนินการแล้ว</p><p className="text-xl font-bold text-green-700">{stats.resolved}</p></div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 flex gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm">
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="acknowledged">รับทราบแล้ว</option>
            <option value="resolved">ดำเนินการแล้ว</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><Key className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>ไม่มีคำขอ</p></div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">รหัสนักเรียน</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">ชื่อ</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">ชั้นเรียน</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">สถานะ</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">วันที่</th>
                  <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{r.studentId}</td>
                    <td className="px-4 py-3 text-sm">{r.studentName || "-"}</td>
                    <td className="px-4 py-3 text-sm">{r.classes || "-"}</td>
                    <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
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
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">รายละเอียดคำขอ</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">รหัสนักเรียน</p><p className="font-mono font-medium">{selectedRequest.studentId}</p></div>
                <div><p className="text-xs text-gray-500">ชื่อ</p><p className="font-medium">{selectedRequest.studentName || "-"}</p></div>
              </div>
              <div><p className="text-xs text-gray-500">ชั้นเรียน</p><p>{selectedRequest.classes || "-"}</p></div>
              {selectedRequest.reason && <div><p className="text-xs text-gray-500">เหตุผล</p><p className="text-sm">{selectedRequest.reason}</p></div>}

              <div><p className="text-xs text-gray-500 mb-1">สถานะ</p>
                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="pending">รอดำเนินการ</option>
                  <option value="acknowledged">รับทราบแล้ว</option>
                  <option value="resolved">ดำเนินการแล้ว</option>
                </select>
              </div>

              <div><p className="text-xs text-gray-500 mb-1">หมายเหตุ</p>
                <textarea value={editData.note} onChange={(e) => setEditData({ ...editData, note: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="เช่น รีเซ็ตแล้ว รหัสใหม่คือ xxxxxxxx" />
              </div>

              <button onClick={handleUpdate} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
