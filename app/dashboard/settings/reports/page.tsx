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
import { CalendarIcon, FileText, Download, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportGenerator() {
  const [includeEverything, setIncludeEverything] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("month");
  const [format, setFormat] = useState("pdf");
  const [date, setDate] = useState<Date | undefined>();

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleGenerate = async (action: "download" | "email") => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        includeEverything,
        options: includeEverything ? [] : selectedOptions,
        timeRange,
        customDate: date,
        format,
        action,
        email: action === "email" ? "user@example.com" : null,
      }),
    });
    if (action === "download") {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.${format}`;
      a.click();
    } else {
      toast.success("Report sent via email!");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Generate Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Include Everything */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={includeEverything}
            onCheckedChange={(val) => setIncludeEverything(!!val)}
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
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

        {/* Custom Calendar */}
        {timeRange === "custom" && (
          <div className="space-y-2">
            <Label className="font-medium">Select Custom Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Report Format */}
        <div className="space-y-2">
          <Label className="font-medium">Report Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={() => handleGenerate("download")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleGenerate("email")}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> Send via Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
