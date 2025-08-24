"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TrafficData {
  total: number;
  breakdown: { x: string; y: number }[];
}

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTraffic() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics/traffic?range=7d");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching traffic:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTraffic();
  }, []);

  const thisWeek = data?.total || 0;
  const lastWeek = Math.round(thisWeek * 0.8); // placeholder, can refine with 14d API
  const change = ((thisWeek - lastWeek) / lastWeek) * 100;

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold">Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="w-full h-24" />
          ) : (
            <>
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="font-medium">{thisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Week</span>
                <span className="font-medium">{lastWeek}</span>
              </div>
              <div className="flex justify-between">
                <span>Change</span>
                <span
                  className={`font-medium ${
                    change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change.toFixed(1)}%
                </span>
              </div>
              <Progress value={(thisWeek / (lastWeek || 1)) * 100} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
