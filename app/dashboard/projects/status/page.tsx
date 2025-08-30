"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectUptimeChart from "@/components/ProjectUptimeChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

// Define ProjectStatus type
type ProjectStatus = {
  id: string;
  name: string;
  logs?: {
    status: boolean;
    checkedAt?: string;
    httpStatus?: number;
    responseTime?: number;
    errorMessage?: string;
  }[];
};

export default function StatusPage() {
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "up" | "down">(
    "all"
  );

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
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

  const filteredProjects = projects.filter((p) => {
    const isUp = p.logs?.[0]?.status;
    if (statusFilter === "up") return isUp;
    if (statusFilter === "down") return !isUp;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col pt-6 sm:flex-row justify-between gap-2 sm:items-center">
        <h1 className="text-xl font-semibold">Status Overview</h1>

        {/* Filter */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Filter Status:</span>
            <div className="border-gray-500 border rounded-xl">
              <Select
                value={statusFilter}
                onValueChange={(v: "all" | "up" | "down") => setStatusFilter(v)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="up">UP</SelectItem>
                  <SelectItem value="down">DOWN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={refreshStatus}
            className="rounded-[10px]"
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Status"}
          </Button>
        </div>
      </div>

      {/* Project Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {loading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px]" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects found.</p>
          ) : (
            filteredProjects.map((p) => {
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
                        <Button variant="default" size="sm">
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
