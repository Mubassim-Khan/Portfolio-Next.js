"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3, Code, Clock } from "lucide-react";
import type { TooltipItem } from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import GradientText from "@/components/misc/GradientText";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type WakaData = {
  human_readable_total: string;
  human_readable_daily_average: string;
};

type DailySummary = {
  range: { date: string; text: string };
  grand_total: { hours: number; minutes: number; text: string; total_seconds: number };
};

function formatHoursMinutes(hours: number, minutes: number): string {
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h 0m`;
  if (minutes > 0) return `${minutes}m`;
  return "0m";
}

const DashboardHome = () => {
  const [wakaData, setWakaData] = useState<WakaData | null>(null);
  const [projects, setProjects] = useState([]);
  const [weeklySummaries, setWeeklySummaries] = useState<DailySummary[]>([]);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailySummary[]>([]);
  const [mainReady, setMainReady] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const endStr = today.toISOString().split("T")[0];

      const [wakaResult, , weeklyResult, monthlyResult] = await Promise.allSettled([
        fetch("/api/wakatime?range=last_30_days").then((r) => r.ok ? r.json() : null),
        fetch("/api/projects").then((r) => r.ok ? r.json() : []),
        (async () => {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 6);
          const startStr = weekAgo.toISOString().split("T")[0];
          const res = await fetch(`/api/wakatime/summaries?start=${startStr}&end=${endStr}`);
          if (!res.ok) return [];
          const json = await res.json();
          return json.data || [];
        })(),
        (async () => {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const startMonthStr = monthStart.toISOString().split("T")[0];
          const res = await fetch(`/api/wakatime/summaries?start=${startMonthStr}&end=${endStr}`);
          if (!res.ok) return [];
          const json = await res.json();
          return json.data || [];
        })(),
      ]);

      if (wakaResult.status === "fulfilled") setWakaData(wakaResult.value);
      if (weeklyResult.status === "fulfilled") setWeeklySummaries(weeklyResult.value);
      if (monthlyResult.status === "fulfilled") setDailyBreakdown(monthlyResult.value);
      setMainReady(true);
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) setProjects(await res.json());
      } catch (e) { console.error("Failed to fetch projects", e); }
      setProjectsLoading(false);
    };

    fetchData();
    fetchProjects();
  }, []);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const dayData = weeklySummaries.find((s) => s.range.date === dateStr);
      const hours = dayData?.grand_total?.hours ?? 0;
      const minutes = dayData?.grand_total?.minutes ?? 0;

      labels.push(dayName);
      data.push(hours + minutes / 60);
    }

    return {
      labels,
      datasets: [
        {
          label: "Hours Coded",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [weeklySummaries]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.raw as number;
            const h = Math.floor(value);
            const m = Math.round((value - h) * 60);
            return formatHoursMinutes(h, m);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => `${value}h`,
        },
      },
    },
  };

  const monthlyRows = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const rows: { date: string; formatted: string; totalSeconds: number }[] = [];

    for (let day = 1; day <= currentDay; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const dayData = dailyBreakdown.find((s) => s.range.date === dateStr);
      const hours = dayData?.grand_total?.hours ?? 0;
      const minutes = dayData?.grand_total?.minutes ?? 0;
      const totalSeconds = dayData?.grand_total?.total_seconds ?? 0;

      rows.push({
        date: `${dayName}, ${day} ${date.toLocaleDateString("en-US", { month: "short" })}`,
        formatted: formatHoursMinutes(hours, minutes),
        totalSeconds,
      });
    }

    return rows;
  }, [dailyBreakdown]);

  const totalTime = wakaData?.human_readable_total ?? "0 hrs";

  const parseTimeToHours = useCallback((str: string) => {
    if (!str) return 0;
    if (str.includes("hr")) return parseFloat(str);
    if (str.includes("min")) {
      const mins = parseFloat(str);
      return mins / 60;
    }
    return 0;
  }, []);

  const dailyAverage = parseTimeToHours(wakaData?.human_readable_daily_average ?? "0");
  const targetDaily = 3;
  const productivity = ((dailyAverage / targetDaily) * 100).toFixed(0);

  if (!mainReady) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen rounded-[15px] flex flex-col items-center justify-center p-6">
      <GradientText
        colors={["#5227FF", "#FF9FFC", "#B497CF"]}
        animationSpeed={8}
        showBorder={false}
        className="text-5xl sm:text-5xl font-extrabold mb-8"
      >
        Welcome, Mubassim!
      </GradientText>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-zinc-900 text-white border-gray-700 cursor-pointer hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" /> Total Coding Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalTime}</p>
                <p className="text-sm text-gray-400">click for daily breakdown</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-gray-700 text-white max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Daily Coding Breakdown —{" "}
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="text-left py-2">Day</th>
                    <th className="text-right py-2">Time Coded</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-800 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="py-2 text-gray-300">{row.date}</td>
                      <td className={`py-2 text-right font-medium ${
                        row.totalSeconds > 0 ? "text-blue-400" : "text-gray-600"
                      }`}>
                        {row.formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="bg-zinc-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-400" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-1">
                <div
                  className="h-8 w-16 rounded"
                  style={{
                    background: "linear-gradient(90deg, rgba(39,39,42,1) 25%, rgba(63,63,70,1) 50%, rgba(39,39,42,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  className="h-4 w-24 rounded"
                  style={{
                    background: "linear-gradient(90deg, rgba(39,39,42,1) 25%, rgba(63,63,70,1) 50%, rgba(39,39,42,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: "0.1s",
                  }}
                />
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {projects?.filter(
                    (p: { logs: { status: boolean }[] }) => p.logs[0]?.status === true,
                  ).length ?? 0}
                </p>
                <p className="text-sm text-gray-400">active projects</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{productivity}%</p>
            <p className="text-sm text-gray-400">daily average vs 3hr target</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl w-full">
        <Card className="bg-zinc-900 border-gray-700 text-white rounded-xl">
          <CardHeader>
            <CardTitle>Coding Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              <div className="h-[300px] w-full max-w-2xl">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
