"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportGenerator() {
  const [includeEverything, setIncludeEverything] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("month");
  const [format, setFormat] = useState("pdf");
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<"download" | "email" | null>(null);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleGenerate = async (action: "download" | "email") => {
    // ✅ Validation: if not "everything" and no options selected
    if (!includeEverything && selectedOptions.length === 0) {
      toast.error("Please select at least one option.");
      return;
    }

    setLoading(action);
    try {
      const endpoint =
        action === "email" ? "/api/reports/mail" : "/api/reports";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          includeEverything,
          options: includeEverything ? [] : selectedOptions,
          timeRange,
          customDate: date,
          format,
          ...(action === "email" ? { email: "Mubassim Ahmed Khan" } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      if (action === "download") {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = format === "csv" ? "report.csv" : "report.pdf";
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success(
          `Report downloaded successfully as ${format.toUpperCase()}`
        );
      } else {
        await res.json();
        toast.success("Report sent via email.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        action === "download"
          ? "Failed to download report."
          : "Failed to send report."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">
              Report Generator
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-6 rounded-md" />
              ))}
            </div>
          ) : (
            <>
              {/* Include Everything */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={includeEverything}
                  onCheckedChange={(val) => setIncludeEverything(!!val)}
                  className="border border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <Label className="font-medium">Include Everything</Label>
              </div>

              {/* Individual Options */}
              {!includeEverything && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  {["Logs", "Visuals", "Tables", "Pie Charts"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedOptions.includes(opt)}
                        onCheckedChange={() => handleOptionToggle(opt)}
                      />
                      <Label>{opt}</Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Time Range */}
              <div className="space-y-2">
                <Label className="font-medium">Select Time Range</Label>
                <div className="border-gray-500 border rounded-xl max-w-[220px]">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="max-w-[220px] border-gray-500 border rounded-xl">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="lastYear">Last Year</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Calendar */}
              {timeRange === "custom" && (
                <div className="space-y-2 max-w-[220px]">
                  <Label className="font-medium block">
                    Select Custom Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Report Format */}
              <div className="space-y-2">
                <Label className="font-medium">Report Format</Label>
                <div className="border-gray-500 border rounded-xl max-w-[220px]">
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="max-w-[220px]">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-6">
                <Button
                  onClick={() => handleGenerate("download")}
                  className="flex items-center gap-2"
                  disabled={loading === "download"}
                >
                  {loading === "download" ? (
                    <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {loading === "download" ? "Downloading..." : "Download"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => handleGenerate("email")}
                  className="flex items-center gap-2"
                  disabled={loading === "email"}
                >
                  {loading === "email" ? (
                    <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading === "email" ? "Sending..." : "Send via Email"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
