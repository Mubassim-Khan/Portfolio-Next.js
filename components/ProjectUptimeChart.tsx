"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProjectUptimeChart({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`/api/logs/${projectId}`)
      .then((res) => res.json())
      .then(setLogs);
  }, [projectId]);

  const labels = logs.map((log: any) => new Date(log.checkedAt).toLocaleTimeString());
  const statusData = logs.map((log: any) => (log.status ? 1 : 0));

  const data = {
    labels,
    datasets: [
      {
        label: "Uptime",
        data: statusData,
        borderColor: "green",
        backgroundColor: "rgba(34,197,94,0.4)", // Tailwind green-500 with transparency
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return tickValue === 1 ? "UP" : "DOWN";
          },
        },
        min: 0,
        max: 1,
      },
    },
  };

  return <Line data={data} options={options} />;
}
