"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Deployment = {
  project: string;
  date: string;
  status: "Success" | "Failed" | "Building";
};

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState("all");
  const [refreshingDeployments, setRefreshingDeployments] = useState(false);

  const fetchDeployments = async () => {
    try {
      const res = await fetch("/api/deployments");
      const data = await res.json();
      setDeployments(data);
    } catch (err) {
      console.error("Failed to fetch deployments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  async function refreshDeployments() {
    setRefreshingDeployments(true);
    await fetch("/api/deployments", { method: "GET" });
    await fetchDeployments();
    setRefreshingDeployments(false);
  }

  const projects = Array.from(new Set(deployments.map((d) => d.project)));
  const filteredDeployments =
    projectFilter === "all"
      ? deployments
      : deployments.filter((d) => d.project === projectFilter);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          {/* Title with Info Tooltip */}
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">
              Recent Deployments
            </CardTitle>
            <span
              className="italic text-gray-400 cursor-pointer relative group"
              title="Each project shows 3 recent deployments."
            >
              <Info className="h-4 w-4" />
              <span className="absolute left-1/2 bottom-full mb-1 hidden w-max text-xs text-white bg-black px-2 py-1 rounded group-hover:block">
                Each project shows 3 recent deployments.
              </span>
            </span>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Filter Deployments:</span>
              <div className="border-gray-500 border rounded-xl">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={refreshDeployments}
              className="rounded-[10px]"
              disabled={refreshingDeployments}
            >
              {refreshingDeployments ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Refreshing...
                </>
              ) : (
                "Refresh Deployments"
              )}
            </Button>
          </div>

          {/* Projects Table */}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-6" />
              ))}
            </div>
          ) : filteredDeployments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.project}</TableCell>
                    <TableCell>{d.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          d.status === "Success"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : d.status === "Building"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-sm">No deployments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
