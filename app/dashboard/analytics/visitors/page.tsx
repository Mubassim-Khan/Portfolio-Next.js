"use client";

import { useEffect, useState } from "react";
import VisitorsMap from "@/components/VisitorsMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VisitorsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visitorsData, setVisitorsData] = useState<
    { country: string; visitors: number }[]
  >([]);

  useEffect(() => {
    setTimeout(() => {
      setVisitorsData([
        { country: "United States of America", visitors: 1200 },
        { country: "Pakistan", visitors: 800 },
        { country: "India", visitors: 950 },
        { country: "Germany", visitors: 400 },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Map */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Visitors Map</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-[400px] rounded-lg" />
          ) : (
            <VisitorsMap visitorsData={visitorsData} />
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-2/3 h-6" />
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-3/4 h-6" />
            </>
          ) : (
            visitorsData.map((v) => (
              <div
                key={v.country}
                className={`flex justify-between items-center p-2 rounded-xl cursor-pointer ${
                  selectedCountry === v.country
                    ? "bg-gray-500"
                    : "hover:bg-gray-900"
                }`}
                onClick={() => setSelectedCountry(v.country)}
              >
                <span>{v.country}</span>
                <span className="font-semibold">{v.visitors} visitors</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
