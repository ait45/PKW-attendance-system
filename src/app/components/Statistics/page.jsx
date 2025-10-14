"use client";

import React, { useEffect, useState } from "react";
import Day from "../date-time/day";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ChartArea } from "lucide-react";

function StatisticsPage() {
  // หน้าสถิติ
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/api/charts/weekly")
      .then((res) => res.json())
      .then((d) => setData(d.data));
  }, []);
  return (
    // หน้าสถิติ
    <main className="max-w-7xl p-4">
      <div className="bg-white rounded-xl shadow-xl p-4">
        <header className="mb-3">
          <div className="flex items-center">
            <ChartArea />
            <h1 className="text-base md:text-xl font-bold text-blue-500 mb-2 ml-1">
              สถิติการเช็คชื่อรายสัปดาห์
            </h1>
          </div>
          <Day />
        </header>
        <div className="">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 30, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#009EA3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leave" fill="#2B7FFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="#F54927" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#DB0F0F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default StatisticsPage;
