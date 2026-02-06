"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Send,
  Users,
  Radio,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface LineLog {
  _id: string;
  messageType: "push" | "broadcast" | "multicast";
  recipientType: string;
  recipientId: string;
  recipientCount: number;
  altText: string;
  status: "success" | "failed" | "pending";
  errorMessage: string;
  sentBy: string;
  createdAt: string;
}

interface Stats {
  success: number;
  failed: number;
  pending: number;
  total: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function LineMessageLogs() {
  const [logs, setLogs] = useState<LineLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    success: 0,
    failed: 0,
    pending: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        type: typeFilter,
      });

      const res = await fetch(`/api/line-logs?${params}`);
      const data = await res.json();

      if (data.success) {
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, typeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "push":
        return <Send className="w-4 h-4" />;
      case "broadcast":
        return <Radio className="w-4 h-4" />;
      case "multicast":
        return <Users className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      push: "bg-blue-100 text-blue-800",
      broadcast: "bg-purple-100 text-purple-800",
      multicast: "bg-indigo-100 text-indigo-800",
    };
    return styles[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📊 LINE Message Logs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              สถานะการส่งข้อความ LINE ทั้งหมด
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            รีเฟรช
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">สำเร็จ</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.success}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ล้มเหลว</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 text-sm">ตัวกรอง:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="success">สำเร็จ</option>
              <option value="failed">ล้มเหลว</option>
              <option value="pending">รอดำเนินการ</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="push">Push</option>
              <option value="broadcast">Broadcast</option>
              <option value="multicast">Multicast</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Send className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>ไม่พบข้อมูล log</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ข้อความ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ส่ง
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนผู้รับ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(log.messageType)}`}
                        >
                          {getTypeIcon(log.messageType)}
                          {log.messageType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}
                        >
                          {getStatusIcon(log.status)}
                          {log.status === "success"
                            ? "สำเร็จ"
                            : log.status === "failed"
                              ? "ล้มเหลว"
                              : "รอดำเนินการ"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {log.altText || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.sentBy || "system"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.recipientCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                แสดง {(pagination.page - 1) * pagination.limit + 1} -{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                จาก {pagination.total} รายการ
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  หน้า {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
