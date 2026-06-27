"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CountUp from "react-countup";
import { RefreshCw, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CodingSkeleton } from "@/components/skeletons/CodingSkeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

type Project = {
  name: string;
  total_seconds: number;
  text: string;
};

type WakaData = {
  human_readable_total: string;
  human_readable_daily_average: string;
  categories: Category[];
  languages: Language[];
  projects?: Project[];
};

const timeRanges = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_6_months", label: "Last 6 Months" },
  { value: "last_year", label: "Last Year" },
  { value: "all_time", label: "All Time" },
  { value: "custom", label: "Custom" },
];

const categoryNames = ["Coding", "Writing Docs", "AI Coding"];

const languageColors = [
  "rgba(168, 85, 247, 0.7)",   // purple
  "rgba(59, 130, 246, 0.7)",   // blue
  "rgba(34, 211, 238, 0.7)",   // cyan
  "rgba(52, 211, 153, 0.7)",   // emerald
  "rgba(250, 204, 21, 0.7)",   // yellow
  "rgba(249, 115, 22, 0.7)",   // orange
  "rgba(239, 68, 68, 0.7)",    // red
  "rgba(236, 72, 153, 0.7)",   // pink
  "rgba(165, 180, 252, 0.7)",  // indigo
  "rgba(217, 70, 239, 0.7)",   // fuchsia
];

function formatHoursMinutes(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function formatTooltip(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const totalHrs = (seconds / 3600).toFixed(1);
  if (hrs > 0) return `${hrs}h ${mins}m (${totalHrs} hrs)`;
  return `${mins}m (${totalHrs} hrs)`;
}

export default function CodingAnalyticsPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wakaData, setWakaData] = useState<WakaData | null>(null);
  const [range, setRange] = useState("all_time");
  const [customDate, setCustomDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      if (range === "custom" && customDate) {
        const dateStr = format(customDate, "yyyy-MM-dd");
        const res = await fetch(`/api/wakatime/summaries?start=${dateStr}&end=${dateStr}`);
        const json = await res.json();
        const day = json.data?.[0];
        if (day) {
          setWakaData({
            human_readable_total: day.grand_total?.text || "0 hrs",
            human_readable_daily_average: day.grand_total?.text || "0 hrs",
            categories: day.categories || [],
            languages: day.languages || [],
            projects: day.projects || [],
          });
        }
      } else {
        const res = await fetch(`/api/wakatime?range=${range}`);
        const data = await res.json();
        setWakaData(data);
      }
    } catch {
      // keep old data visible on error
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  useEffect(() => {
    if (range === "custom" && customDate) {
      fetchData();
    }
  }, [customDate]);

  const totalTime = wakaData?.human_readable_total ?? "0 hrs";
  const dailyAverage = wakaData?.human_readable_daily_average ?? "0 hrs";

  const categories = categoryNames.map((name) =>
    wakaData?.categories?.find((c: Category) => c.name === name) ?? {
      name,
      text: "0 hrs 0 mins",
      total_seconds: 0,
    }
  );

  const topLangs = (wakaData?.languages ?? [])
    .sort((a: Language, b: Language) => b.total_seconds - a.total_seconds)
    .slice(0, 10);

  const projects = (wakaData?.projects ?? [])
    .sort((a: Project, b: Project) => b.total_seconds - a.total_seconds);

  const totalLangSeconds = topLangs.reduce((sum, l) => sum + l.total_seconds, 0);

  const chartData = {
    labels: topLangs.map((l: Language) => l.name),
    datasets: [
      {
        label: "Hours",
        data: topLangs.map((l: Language) => (l.total_seconds / 3600).toFixed(1)),
        backgroundColor: languageColors.slice(0, topLangs.length),
        borderColor: languageColors.map((c) => c.replace("0.7", "1")).slice(0, topLangs.length),
        borderWidth: 1,
      },
    ],
  };

  if (initialLoading) return <CodingSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col pt-6 sm:flex-row justify-between gap-2 sm:items-center mx-6">
        <h1 className="text-xl font-semibold">Coding Analytics</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Select Range:</span>
            <div className="border-gray-500 border rounded-xl">
              <Select
                value={range}
                onValueChange={(v) => { setRange(v); if (v !== "custom") setCustomDate(undefined); }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select range" />
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

          {range === "custom" && (
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !customDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={(d) => {
                    setCustomDate(d);
                    setDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          <Button onClick={fetchData} className="rounded-[10px]" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
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
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
              <p className="text-sm text-zinc-400">Total Time</p>
              <h2 className="text-xl font-bold text-purple-400">
                <CountUp end={parseFloat(totalTime)} duration={2} /> hrs
              </h2>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
              <p className="text-sm text-zinc-400">Daily Average</p>
              <h2 className="text-xl font-bold text-blue-400">
                <CountUp end={parseFloat(dailyAverage)} duration={2} /> hrs
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((cat: Category) => (
              <div
                key={cat.name}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center"
              >
                <p className="text-sm text-zinc-400">{cat.name}</p>
                <h2 className="text-lg font-bold text-emerald-400">
                  {cat.text}
                </h2>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Languages</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full max-w-md">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "right", labels: { color: "#a1a1aa" } },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const seconds = topLangs[context.dataIndex]?.total_seconds ?? 0;
                        const pct = totalLangSeconds > 0
                          ? ((seconds / totalLangSeconds) * 100).toFixed(1)
                          : "0";
                        return `${context.label}: ${formatTooltip(seconds)} (${pct}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-full space-y-2">
            {topLangs.map((lang: Language, i: number) => (
              <div key={lang.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: languageColors[i]?.replace("0.7", "1") }}
                />
                <span className="text-sm text-zinc-300 w-28 truncate">{lang.name}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: totalLangSeconds > 0
                        ? `${(lang.total_seconds / totalLangSeconds) * 100}%`
                        : "0%",
                      backgroundColor: languageColors[i]?.replace("0.7", "1"),
                    }}
                  />
                </div>
                <span className="text-sm text-zinc-400 w-20 text-right">
                  {formatHoursMinutes(lang.total_seconds)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((proj: Project) => (
                <div key={proj.name} className="flex items-center gap-3">
                  <span className="text-sm text-zinc-300 w-40 truncate">{proj.name}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500/70 rounded-full transition-all"
                      style={{
                        width: projects[0]?.total_seconds > 0
                          ? `${(proj.total_seconds / projects[0].total_seconds) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-zinc-400 w-20 text-right">
                    {formatHoursMinutes(proj.total_seconds)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm text-center">No project data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
