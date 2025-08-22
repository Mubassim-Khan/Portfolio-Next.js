"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProjectUptimeChart({
  projectId,
}: {
  projectId: string;
}) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/logs/${projectId}`)
      .then((res) => res.json())
      .then(setLogs);
  }, [projectId]);

  const labels = logs.map((log) =>
    new Date(log.checkedAt).toLocaleTimeString()
  );
  const uptimeData = logs.map((log) => (log.status ? 1 : 0));
  const responseTimes = logs.map((log) => log.responseTime || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Uptime (1=UP, 0=DOWN)",
        data: uptimeData,
        borderColor: "green",
        backgroundColor: "rgba(34,197,94,0.4)",
        yAxisID: "y",
      },
      {
        label: "Response Time (ms)",
        data: responseTimes,
        borderColor: "blue",
        backgroundColor: "rgba(59,130,246,0.4)", // Tailwind blue-500
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1, // ensures only 0 and 1 are shown
          callback: function (tickValue: string | number) {
            return tickValue === 1 ? "UP" : "DOWN";
          },
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Response Time (ms)" },
      },
    },
  };

  return <Line data={data} options={options} />;
}
