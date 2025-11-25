"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "@/components/ui/select";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TrafficData {
  visitors: number;
  pageviews: number;
  sessions: number;
  bounces: number;
  totaltime: number;
}

const timeRanges = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
  { value: "all", label: "All Time" },
];

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [prevData, setPrevData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    async function fetchTraffic() {
      setLoading(true);
      try {
        // Current period
        const res = await fetch(`/api/analytics/traffic?range=${range}`);
        const json: TrafficData = await res.json();
        setData(json);

        // Previous period for trend calculation
        const resPrev = await fetch(
          `/api/analytics/traffic?range=prev_${range}`
        );
        const jsonPrev: TrafficData = await resPrev.json();
        setPrevData(jsonPrev);
      } catch (err) {
        console.error("Error fetching traffic:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTraffic();
  }, [range]);

  // Calculate trend %
  const calcTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return 0;
    if (previous === 0) return 100; // avoid divide by 0
    return ((current - previous) / previous) * 100;
  };

  const chartData = data
    ? {
        labels: ["Visitors", "Pageviews", "Sessions"],
        datasets: [
          {
            label: "Traffic",
            data: [data.visitors, data.pageviews, data.sessions],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(234, 179, 8, 0.7)",
            ],
          },
        ],
      }
    : null;

  const stats = [
    {
      label: "Visitors",
      value: data?.visitors,
      trend: calcTrend(data?.visitors, prevData?.visitors),
    },
    {
      label: "Pageviews",
      value: data?.pageviews,
      trend: calcTrend(data?.pageviews, prevData?.pageviews),
    },
    {
      label: "Sessions",
      value: data?.sessions,
      trend: calcTrend(data?.sessions, prevData?.sessions),
    },
    {
      label: "Bounce Rate (%)",
      value: data?.bounces,
      trend: calcTrend(data?.bounces, prevData?.bounces),
    },
    {
      label: "Total Time (min)",
      value: data ? Math.round(data.totaltime / 60) : 0,
      trend: calcTrend(data?.totaltime, prevData?.totaltime),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Traffic Chart */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold">Traffic Overview</CardTitle>

          {/* Range selector */}
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

        {/* Stats numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {loading
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg mb-8" />
              ))
            : stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-zinc-900 border-gray-700 h-24 flex flex-col items-center justify-center mb-8 mt-3"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p
                    className={`text-sm mt-1 ${
                      stat.trend >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend.toFixed(1)}%
                  </p>
                </Card>
              ))}
        </div>

        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-64" />
          ) : chartData ? (
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
                    y: { beginAtZero: true },
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
    </div>
  );
}
