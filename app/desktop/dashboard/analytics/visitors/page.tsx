"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import VisitorsMap from "@/components/desktop/charts/VisitorsMap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/desktop/ui/card";
import { VisitorsSkeleton } from "@/components/desktop/skeletons/VisitorsSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/desktop/ui/select";

interface StatItem {
  name: string;
  count: number;
}

const timeRanges = [
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

export default function VisitorsPage() {
  const [loading, setLoading] = useState(true);
  const [visitorsData, setVisitorsData] = useState<
    { country: string; visitors: number }[]
  >([]);
  const [browsers, setBrowsers] = useState<StatItem[]>([]);
  const [systems, setSystems] = useState<StatItem[]>([]);
  const [devices, setDevices] = useState<StatItem[]>([]);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetch(`/api/analytics/visitors?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch visitors");
            return r.json();
          }),
          fetch(`/api/analytics/browsers?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch browsers");
            return r.json();
          }),
          fetch(`/api/analytics/systems?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch systems");
            return r.json();
          }),
          fetch(`/api/analytics/devices?range=${range}`).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).error || "Failed to fetch devices");
            return r.json();
          }),
        ]);

        const reportError = (label: string, result: PromiseSettledResult<unknown>) => {
          if (result.status === "rejected") {
            toast.error(`${label}: ${result.reason?.message || "Unknown error"}`);
          }
        };

        const [visitorsResult, browsersResult, systemsResult, devicesResult] = results;
        reportError("Visitors", visitorsResult);
        reportError("Browsers", browsersResult);
        reportError("Systems", systemsResult);
        reportError("Devices", devicesResult);

        const visitorsJson = visitorsResult.status === "fulfilled" ? visitorsResult.value : [];
        const browsersJson = browsersResult.status === "fulfilled" ? browsersResult.value : [];
        const systemsJson = systemsResult.status === "fulfilled" ? systemsResult.value : [];
        const devicesJson = devicesResult.status === "fulfilled" ? devicesResult.value : [];

        setVisitorsData(Array.isArray(visitorsJson) ? visitorsJson : []);
        setBrowsers(Array.isArray(browsersJson) ? browsersJson : []);
        setSystems(Array.isArray(systemsJson) ? systemsJson : []);
        setDevices(
          Array.isArray(devicesJson)
            ? devicesJson
            : Array.isArray(devicesJson?.categorized)
              ? devicesJson.categorized
              : []
        );
      } catch (err) {
        toast.error("Error loading visitors data");
        setVisitorsData([]);
        setBrowsers([]);
        setSystems([]);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [range]);

  if (loading) return <VisitorsSkeleton />;

  const maxBrowserCount = Math.max(...browsers.map((b) => b.count), 1);
  const maxSystemCount = Math.max(...systems.map((s) => s.count), 1);
  const maxDeviceCount = Math.max(...devices.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Visitors Map</CardTitle>
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
        <CardContent className="relative w-full h-[500px]">
          {visitorsData.length > 0 ? (
            <VisitorsMap visitorsData={visitorsData} selectedCountry={null} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                No visitor data available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Countries List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {visitorsData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {visitorsData
                .sort((a, b) => b.visitors - a.visitors)
                .slice(0, 20)
                .map((item) => (
                  <div
                    key={item.country}
                    className="bg-zinc-900 border border-gray-700 rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium truncate mr-2">
                      {item.country}
                    </span>
                    <span className="text-sm text-blue-400 font-semibold whitespace-nowrap">
                      {item.visitors.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-lg text-center py-8">
              No visitor data available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Browsers + Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {browsers.length > 0 ? (
              <div className="space-y-2">
                {browsers.map((b) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 shrink-0">
                      {b.name}
                    </span>
                    <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-purple-600/60 rounded transition-all"
                        style={{
                          width: `${(b.count / maxBrowserCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right shrink-0">
                      {formatNumber(b.count)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">
                No browser data available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Operating Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systems.length > 0 ? (
              <div className="space-y-2">
                {systems.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 shrink-0">
                      {s.name}
                    </span>
                    <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-emerald-600/60 rounded transition-all"
                        style={{
                          width: `${(s.count / maxSystemCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right shrink-0">
                      {formatNumber(s.count)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">
                No OS data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Devices (full width row) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Devices</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const nonZero = devices.filter((d) => d.count > 0);
            if (nonZero.length === 0) {
              return (
                <p className="text-gray-500 text-sm text-center py-6">
                  No device data available.
                </p>
              );
            }
            const cols = Math.min(nonZero.length, 4);
            return (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {nonZero.map((d) => {
                  const pct = maxDeviceCount > 0 ? (d.count / maxDeviceCount) * 100 : 0;
                  return (
                    <div
                      key={d.name}
                      className="bg-zinc-900 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center"
                    >
                      <span className="text-2xl font-bold text-amber-400">
                        {formatNumber(d.count)}
                      </span>
                      <span className="text-sm text-gray-400 mt-1 text-center">
                        {d.name}
                      </span>
                      <div className="w-full h-2 bg-zinc-800 rounded mt-3 overflow-hidden">
                        <div
                          className="h-full bg-amber-600/60 rounded transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
