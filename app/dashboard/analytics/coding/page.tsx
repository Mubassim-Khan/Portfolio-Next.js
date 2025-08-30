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
import CountUp from "react-countup";
import { RefreshCw } from "lucide-react";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Category = {
  name: string;
  text: string;
  total_seconds: number;
};

type Language = {
  name: string;
  total_seconds: number;
};

type WakaData = {
  human_readable_total: string;
  human_readable_daily_average: string;
  categories: Category[];
  languages: Language[];
};

export default function StatusPage() {
  const [loading, setLoading] = useState(true);
  const [wakaData, setWakaData] = useState<WakaData | null>(null);
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
    wakaData?.categories?.filter((c: Category) =>
      ["Coding", "Writing Docs", "AI Coding"].includes(c.name)
    ) ?? [];

  const topLangs = (wakaData?.languages ?? [])
    .sort((a: Language, b: Language) => b.total_seconds - a.total_seconds)
    .slice(0, 10);

  const chartData = {
    labels: topLangs.map((l: Language) => l.name),
    datasets: [
      {
        label: "Hours",
        data: topLangs.map((l: Language) =>
          (l.total_seconds / 3600).toFixed(1)
        ),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col pt-6 sm:flex-row justify-between gap-2 sm:items-center">
        <h1 className="text-xl mx-6 font-semibold">Coding Analytics</h1>

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
            className="rounded-[10px]"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
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
              categories.map((cat: Category) => (
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
