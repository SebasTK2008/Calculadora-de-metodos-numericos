import React from "react";
import { Line } from "react-chartjs-2";

export default function Graph({ data }) {
  const options = {
    responsive: true,
    spanGaps: false, // gaps en discontinuidades (null values)
    animation: { duration: 300 },
    plugins: {
      legend: {
        labels: {
          color: "white",
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.raw === null) return null;
            return ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(4)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          maxTicksLimit: 11,
          callback: (_, i, ticks) => {
            // Mostrar solo algunos valores del eje x
            const step = Math.floor(ticks.length / 10) || 1;
            return i % step === 0 ? data?.labels?.[i] : "";
          },
        },
        grid: {
          color: (ctx) =>
            ctx.tick?.value === 0
              ? "rgba(255,255,255,0.4)"   // eje y (x=0) más visible
              : "rgba(255,255,255,0.07)",
        },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.6)" },
        grid: {
          color: (ctx) =>
            ctx.tick?.value === 0
              ? "rgba(255,255,255,0.5)"   // eje x (y=0) bien visible
              : "rgba(255,255,255,0.07)",
          lineWidth: (ctx) => (ctx.tick?.value === 0 ? 2 : 1),
        },
      },
    },
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Gráfica</h2>

      {data ? (
        <Line data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-48 text-slate-400">
          Función inválida o sin datos
        </div>
      )}
    </div>
  );
}