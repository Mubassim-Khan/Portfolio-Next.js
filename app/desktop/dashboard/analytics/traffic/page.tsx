"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/desktop/ui/card";
import { TrafficSkeleton } from "@/components/desktop/skeletons/TrafficSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/desktop/ui/select";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DailyStat {
  day: string;
  visitors: number;
}

interface TrafficData {
  visitors: number;
  dailyStats: DailyStat[];
  prevVisitors: number;
  prevDailyStats: DailyStat[];
}

interface TopPage {
  path: string;
  visitors: number;
}

const timeRanges = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
  { value: "all", label: "All Time" },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    async function fetchTraffic() {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetch(`/api/analytics/traffic?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch traffic");
            return r.json();
          }),
          fetch(`/api/analytics/pages?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch pages");
            return r.json();
          }),
        ]);

        const reportError = (label: string, result: PromiseSettledResult<unknown>) => {
          if (result.status === "rejected") {
            toast.error(`${label}: ${result.reason?.message || "Unknown error"}`);
          }
        };

        const [trafficResult, pagesResult] = results;
        reportError("Traffic", trafficResult);
        reportError("Pages", pagesResult);

        const trafficJson = trafficResult.status === "fulfilled" ? trafficResult.value : null;
        const pagesJson = pagesResult.status === "fulfilled" ? pagesResult.value : [];

        if (trafficJson && typeof trafficJson === "object" && "visitors" in trafficJson) {
          setData(trafficJson as TrafficData);
        }
        setTopPages(Array.isArray(pagesJson) ? pagesJson : []);
      } catch (err) {
        toast.error("Error loading traffic data");
      } finally {
        setLoading(false);
      }
    }
    fetchTraffic();
  }, [range]);

  const calcTrend = (current?: number, previous?: number) => {
    if (current == null || previous == null) return null;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const trend = calcTrend(data?.visitors, data?.prevVisitors);

  const chartData = data?.dailyStats?.length
    ? {
        labels: data.dailyStats.map((d) => {
          const parts = d.day.split("-");
          return parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.day;
        }),
        datasets: [
          {
            label: "Visitors",
            data: data.dailyStats.map((d) => d.visitors),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderRadius: 4,
          },
        ],
      }
    : null;

  if (loading) return <TrafficSkeleton />;

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold">Traffic Overview</CardTitle>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Select Range:</span>
            <div className="border border-gray-500 rounded-xl">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
          <Card className="bg-zinc-900 border-gray-700 h-24 flex flex-col items-center justify-center mb-4">
            <p className="text-sm text-muted-foreground">Visitors</p>
            <p className="text-xl font-bold">
              {data ? formatNumber(data.visitors) : "—"}
            </p>
            <p
              className={`text-sm mt-1 ${
                trend != null && trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend != null ? `${trend.toFixed(1)}%` : "—"}
            </p>
          </Card>
          <Card className="bg-zinc-900 border-gray-700 h-24 flex flex-col items-center justify-center mb-4">
            <p className="text-sm text-muted-foreground">Avg Visitors / Day</p>
            <p className="text-xl font-bold">
              {data && data.dailyStats?.length
                ? formatNumber(
                    Math.round(data.visitors / data.dailyStats.length)
                  )
                : "—"}
            </p>
          </Card>
        </div>

        <CardContent>
          {chartData ? (
            <div className="w-full h-64">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) =>
                          Number.isInteger(value) ? value : null,
                      },
                    },
                    x: {
                      ticks: {
                        maxTicksLimit: 20,
                        maxRotation: 45,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No traffic data available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Top Pages */}
      {topPages.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPages.map((page, i) => {
                const maxVisitors = topPages[0]?.visitors || 1;
                const barWidth = (page.visitors / maxVisitors) * 100;
                return (
                  <div key={page.path} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-6 text-right">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate flex-1">
                      {page.path}
                    </span>
                    <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-600/60 rounded transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">
                      {formatNumber(page.visitors)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
