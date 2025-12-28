"use client";

import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Log = {
  checkedAt: string | number;
  status: boolean;
  responseTime?: number;
};

export default function ProjectUptimeChart({
  projectId,
}: {
  projectId: string;
}) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [range, setRange] = useState<"7d" | "1m" | "2m" | "all">("1m");

  useEffect(() => {
    fetch(`/api/logs/${projectId}`)
      .then((res) => res.json())
      .then(setLogs);
  }, [projectId]);

  function parseTime(value: string | number) {
    if (typeof value === "number") return value;

    // Force ISO if missing timezone
    const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
    const time = new Date(iso).getTime();

    return isNaN(time) ? null : time;
  }

  const normalizedLogs = useMemo(() => {
    return [...logs]
      .map((log) => ({
        ...log,
        _time: new Date(log.checkedAt).getTime(),
      }))
      .filter((log) => !isNaN(log._time))
      .sort((a, b) => a._time - b._time); // oldest → newest
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (range === "all") return normalizedLogs;

    const now = Date.now();

    const ranges = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "1m": 30 * 24 * 60 * 60 * 1000,
      "2m": 60 * 24 * 60 * 60 * 1000,
    };

    return normalizedLogs.filter((log) => now - log._time <= ranges[range]);
  }, [normalizedLogs, range]);

  const labels = filteredLogs.map((log) =>
    new Date(log._time).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const uptimeData = filteredLogs.map((l) => (l.status ? 1 : 0));
  const responseTimes = filteredLogs.map((l) => l.responseTime || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Uptime",
        data: uptimeData,
        borderColor: "green",
        backgroundColor: "rgba(34,197,94,0.4)",
        yAxisID: "y",
      },
      {
        label: "Response Time (ms)",
        data: responseTimes,
        borderColor: "blue",
        backgroundColor: "rgba(59,130,246,0.4)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => {
            return Number(value) === 1 ? "UP" : "DOWN";
          },
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <Select value={range} onValueChange={(v) => setRange(v as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="1m">Last 1 Month</SelectItem>
            <SelectItem value="2m">Last 2 Months</SelectItem>
            <SelectItem value="all">All Logs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <Line data={data} options={options} />
    </div>
  );
}
