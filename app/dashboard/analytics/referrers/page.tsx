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

interface Referrer {
  source: string;
  visitors: number;
}

export default function ReferrersPage() {
  const [data, setData] = useState<Referrer[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    async function fetchReferrers() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/referrers?range=${range}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching referrers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReferrers();
  }, [range]);

  const chartData = {
    labels: data.map((r) => r.source),
    datasets: [
      {
        label: "Visitors",
        data: data.map((r) => r.visitors),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Top Referrers</CardTitle>

          {/* Filter Range */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Select Range:</span>
              <div className="border border-gray-500 rounded-xl">
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-64" />
          ) : data.length > 0 ? (
            <div className="w-full h-80">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: true, position: "bottom" } },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No referrer data available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
