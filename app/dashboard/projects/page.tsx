"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartSpline, Globe, Wrench } from "lucide-react";

const ProjectsHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto py-10">
      {/* Status Overview */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            View the overall health and status of your projects.
          </p>
          <Link href="/dashboard/projects/status">
            <Button className="w-full">
              <ChartSpline />Go to Status
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Manage Projects */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Manage Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Add, edit, and configure your tracked projects.
          </p>
          <Link href="/dashboard/projects/manage">
            <Button className="w-full">
              <Wrench />  Go to Manage</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Deployments */}
      <Card className="flex flex-col justify-between border border-gray-800">
        <CardHeader>
          <CardTitle>Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Track and monitor deployments across environments.
          </p>
          <Link href="/dashboard/projects/deployments">
            <Button className="w-full">
              <Globe />
              Go to Deployments
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsHome;
