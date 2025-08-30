"use client";

import { useEffect, useState } from "react";
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
import CountUp from "react-countup"; // npm i react-countup

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatusPage() {
  const [loading, setLoading] = useState(true);
  const [wakaData, setWakaData] = useState<any>(null);
  const [range, setRange] = useState("all_time");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wakatime?range=${range}`);
      const data = await res.json();
      setWakaData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  // ---- Extract values ----
  const totalTime = wakaData?.human_readable_total ?? "0 hrs";
  const dailyAverage = wakaData?.human_readable_daily_average ?? "0 hrs";

  const categories =
    wakaData?.categories?.filter((c: any) =>
      ["Coding", "Writing Docs", "AI Coding"].includes(c.name)
    ) ?? [];

  const topLangs = (wakaData?.languages ?? [])
    .sort((a: any, b: any) => b.total_seconds - a.total_seconds)
    .slice(0, 10);

  const chartData = {
    labels: topLangs.map((l: any) => l.name),
    datasets: [
      {
        label: "Hours",
        data: topLangs.map((l: any) => (l.total_seconds / 3600).toFixed(1)),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header (always visible) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coding Analytics</h1>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Select Range:</span>
            <div className="border-gray-500 border rounded-xl">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={fetchData}
            className="rounded-[10px]
           disabled={loading}"
          >
            <RefreshCw className="w-4 h-4" />
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </>
            ) : (
              <>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <h2 className="text-xl font-bold text-blue-600">
                    <CountUp end={parseFloat(totalTime)} duration={2} /> hrs
                  </h2>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                  <h2 className="text-xl font-bold text-purple-600">
                    <CountUp end={parseFloat(dailyAverage)} duration={2} /> hrs
                  </h2>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </>
            ) : (
              categories.map((cat: any) => (
                <div
                  key={cat.name}
                  className="p-4 bg-green-50 rounded-xl text-center"
                >
                  <p className="text-sm text-muted-foreground">{cat.name}</p>
                  <h2 className="text-xl font-bold text-green-600">
                    {cat.text}
                  </h2>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Languages</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {loading ? (
            <Skeleton className="h-[300px] w-full max-w-3xl rounded-xl" />
          ) : (
            <div className="w-full max-w-3xl">
              <Bar data={chartData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
