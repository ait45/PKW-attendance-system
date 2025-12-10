// client component
"use client";

// Modules
import React, { useState, useEffect } from "react";
import { CircleAlert } from "lucide-react";

function Notifications({ session }) {
  return (
    <main className="max-w-7xl p-2 sm:p-4">
      <div className="bg-white rounded-md p-2 shadow-2xl">
        <header className="p-2 flex">
          <div className=" bg-blue-500 text-white rounded p-2">
            <CircleAlert className="inline-block h-6 w-6" />
          </div>
          <div className="ml-2">
            <h1 className="text-base font-bold">การแจ้งเตือนกิจกรรม</h1>
            <p className="text-xs text-slate-500">ประกาศล่าสุด</p>
          </div>
        </header>
      </div>
    </main>
  );
}

export default Notifications;
