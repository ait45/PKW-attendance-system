"use client";

import IssueReportForm from "../components/IssueReportForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Route } from "next";

export default function IssueReportPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-6 mb-4">
        <Link
          href={"/login" as Route}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">กลับหน้า Login</span>
        </Link>
      </div>

      {/* Issue Report Form */}
      <IssueReportForm />
    </div>
  );
}
