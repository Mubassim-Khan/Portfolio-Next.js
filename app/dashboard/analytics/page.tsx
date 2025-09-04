"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Share2, Map, Code } from "lucide-react";

const AnalyticsHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-10">
      {/* Traffic Reports */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Traffic Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Monitor website traffic and performance over time.
          </p>
          <Link href="/dashboard/analytics/traffic">
            <Button className="w-full">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            See where your visitors are coming from.
          </p>
          <Link href="/dashboard/analytics/referrers">
            <Button className="w-full">
              <Share2 className="h-4 w-4" />
              View Referrers
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Visitor Map */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Visitor Map</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Visualize where your users are located globally.
          </p>
          <Link href="/dashboard/analytics/visitors">
            <Button className="w-full">
              <Map className="h-4 w-4" />
              View Map
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Coding Analytics */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Coding Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Insights on your coding activity and productivity.
          </p>
          <Link href="/dashboard/analytics/coding">
            <Button className="w-full">
              <Code className="h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsHome;
