import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DonutChart({ data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = ref.current;
    if (!ctx) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Menunggu", "Diproses", "Selesai"],
        datasets: [
          {
            data: [data.Menunggu, data.Diproses, data.Selesai],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <canvas ref={ref} />
    </div>
  );
}
datasets: [
  {
    data: [data.Menunggu, data.Diproses, data.Selesai],
    backgroundColor: ["rgba(245,124,0,0.85)", "rgba(37,99,235,0.75)", "rgba(22,163,74,0.75)"],
    borderColor: ["rgba(245,124,0,1)", "rgba(37,99,235,1)", "rgba(22,163,74,1)"],
    borderWidth: 1
  }
]
