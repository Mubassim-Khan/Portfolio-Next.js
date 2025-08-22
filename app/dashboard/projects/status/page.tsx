"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProjectUptimeChart from "@/components/ProjectUptimeChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StatusPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchStatus() {
    setLoading(true);
    const res = await fetch("/api/status");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  async function refreshStatus() {
    setRefreshing(true);
    await fetch("/api/refresh", { method: "POST" });
    await fetchStatus();
    setRefreshing(false);
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Project Status Overview</h1>
        <Button onClick={refreshStatus} disabled={refreshing}>
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
            </>
          ) : (
            "Refresh Status"
          )}
        </Button>
      </div>

      {/* Project Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects found.</p>
          ) : (
            projects.map((p) => {
              const log = p.logs?.[0];
              const isUp = log?.status;
              const lastCheck = log?.checkedAt
                ? new Date(log.checkedAt).toLocaleString()
                : "No checks yet";

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  {/* Project Info */}
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Last check: {lastCheck}
                    </span>
                    {log?.httpStatus && (
                      <span className="text-xs text-muted-foreground">
                        HTTP {log.httpStatus}
                      </span>
                    )}
                    {log?.responseTime && (
                      <span className="text-xs text-muted-foreground">
                        Response: {log.responseTime}ms
                      </span>
                    )}
                    {log?.errorMessage && (
                      <span className="text-xs text-red-500">
                        Error: {log.errorMessage}
                      </span>
                    )}
                  </div>

                  {/* Status & View Graph */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isUp ? "secondary" : "destructive"}
                      className={
                        isUp
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white"
                      }
                    >
                      {isUp ? "UP" : "DOWN"}
                    </Badge>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Graph
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            {p.name} - Uptime & Response History
                          </DialogTitle>
                        </DialogHeader>
                        <ProjectUptimeChart projectId={p.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
