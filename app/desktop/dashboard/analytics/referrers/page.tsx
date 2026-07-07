"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/desktop/ui/card";
import { ReferrersSkeleton } from "@/components/desktop/skeletons/ReferrersSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/desktop/ui/select";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface Referrer {
  source: string;
  visitors: number;
  ref_scheme: string;
}

interface SourceBreakdown {
  name: string;
  count: number;
}

const SOURCE_COLORS: Record<string, string> = {
  "Direct / Other": "rgba(107, 114, 128, 0.8)",
  Search: "rgba(59, 130, 246, 0.8)",
  Referral: "rgba(16, 185, 129, 0.8)",
  Campaign: "rgba(234, 179, 8, 0.8)",
};

export default function ReferrersPage() {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [sources, setSources] = useState<SourceBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    async function fetchReferrers() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/referrers?range=${range}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch referrers");
        }
        const json = await res.json();
        if (json && typeof json === "object") {
          setReferrers(Array.isArray(json.referrers) ? json.referrers : []);
          setSources(Array.isArray(json.sources) ? json.sources : []);
        }
      } catch (error) {
        toast.error(`Referrers: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchReferrers();
  }, [range]);

  const chartData = {
    labels: referrers.map((r) => r.source),
    datasets: [
      {
        label: "Visitors",
        data: referrers.map((r) => r.visitors),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const doughnutData = sources.length
    ? {
        labels: sources.map((s) => s.name),
        datasets: [
          {
            data: sources.map((s) => s.count),
            backgroundColor: sources.map(
              (s) => SOURCE_COLORS[s.name] || "rgba(107, 114, 128, 0.8)"
            ),
            borderWidth: 0,
          },
        ],
      }
    : null;

  if (loading) return <ReferrersSkeleton />;

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Top Referrers</CardTitle>

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
          {referrers.length > 0 ? (
            <div className="w-full h-80">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: true, position: "bottom" } },
                  indexAxis: "y",
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

      {/* Traffic Source Breakdown */}
      {sources.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-64 h-64 shrink-0">
                <Doughnut
                  data={doughnutData!}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { boxWidth: 12, padding: 12 },
                      },
                    },
                  }}
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                {sources.map((s) => {
                  const total = sources.reduce((a, b) => a + b.count, 0);
                  const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : "0";
                  return (
                    <div key={s.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            SOURCE_COLORS[s.name] || "rgba(107, 114, 128, 0.8)",
                        }}
                      />
                      <span className="text-sm flex-1">{s.name}</span>
                      <span className="text-sm text-gray-400">{pct}%</span>
                      <span className="text-sm font-medium w-16 text-right">
                        {s.count.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
