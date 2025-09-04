"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, FileBarChart } from "lucide-react";

const SettingsHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto py-10">
      {/* API Keys */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Manage your API keys for integrations and access control.
          </p>
          <Link href="/dashboard/settings/api-keys">
            <Button className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Manage Keys
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Reports & Export */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Reports & Export</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate reports and export your data in multiple formats.
          </p>
          <Link href="/dashboard/settings/reports">
            <Button className="w-full">
              <FileBarChart className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsHome;
