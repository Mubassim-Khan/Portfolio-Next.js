"use client";

import { useEffect, useState } from "react";
import VisitorsMap from "@/components/VisitorsMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VisitorsPage() {
  const [loading, setLoading] = useState(true);

  const [visitorsData, setVisitorsData] = useState<
    { country: string; visitors: number }[]
  >([]);

  useEffect(() => {
    // Simulate loading briefly for skeleton
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      {/* World Map */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Visitors Map</CardTitle>
        </CardHeader>
        <CardContent className="relative w-full h-[500px]">
          {loading ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : (
            <VisitorsMap visitorsData={visitorsData} selectedCountry={null} />
          )}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-400 text-lg text-center">
            Country-level visitor data is only available in Umami v2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
