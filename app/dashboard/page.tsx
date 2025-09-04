"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type WakaData = {
  human_readable_total: string;
  human_readable_daily_average: string;
};

const DashboardHome = () => {
  const [wakaData, setWakaData] = useState<WakaData | null>(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const wakaRes = await fetch("/api/wakatime?range=last_30_days");
      const wakaJson = await wakaRes.json();
      setWakaData(wakaJson);

      const projectsRes = await fetch("/api/projects");
      const projectsJson = await projectsRes.json();
      setProjects(projectsJson);
    };

    fetchData();
  }, []);

  if (!wakaData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  const totalTime = wakaData.human_readable_total ?? "0 hrs";
  const dailyAverage = parseFloat(wakaData.human_readable_daily_average);
  const targetDaily = 5; // assume 6 productive hrs/day
  const productivity = ((dailyAverage / targetDaily) * 100).toFixed(0);

  // Sample chart data
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Coded",
        data: [2, 4, 3, 6, 5, 7, 4],
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Tailwind blue-500
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Rainbow Animated Name */}
      <h1 className="text-5xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_200%] animate-gradient text-transparent bg-clip-text">
        Welcome, Mubassim!
      </h1>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
        <Card className="bg-zinc-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" /> Total Coding Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold"> {totalTime} hrs</p>
            <p className="text-sm text-gray-400">this month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-400" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {projects?.filter((p: any) => p.logs[0]?.status === true)
                .length ?? 0}
            </p>
            <p className="text-sm text-gray-400">active projects</p>
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
            <p className="text-sm text-gray-400">weekly average</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="max-w-4xl w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800 text-gray-300 rounded-xl">
          <TabsTrigger value="overview" className="rounded-xl">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-xl">
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-zinc-900 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>
                  Pushed new commits to <b>Portfolio Project</b>
                </li>
                <li>
                  Fixed bugs in <b>Analytics Dashboard</b>
                </li>
                <li>Explored new React libraries</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-zinc-900 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/profile">
                <Button
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardHome;
