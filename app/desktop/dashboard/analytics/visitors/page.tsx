"use client";

import { useEffect, useState } from "react";
import VisitorsMap from "@/components/desktop/charts/VisitorsMap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/desktop/ui/card";
import { VisitorsSkeleton } from "@/components/desktop/skeletons/VisitorsSkeleton";

export default function VisitorsPage() {
  const [loading, setLoading] = useState(true);

  const [visitorsData] = useState<{ country: string; visitors: number }[]>([]);

  useEffect(() => {
    // Simulate loading briefly for skeleton
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <VisitorsSkeleton />;

  return (
    <div className="space-y-6">
      {/* World Map */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Visitors Map</CardTitle>
        </CardHeader>
        <CardContent className="relative w-full h-[500px]">
          <VisitorsMap visitorsData={visitorsData} selectedCountry={null} />
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
