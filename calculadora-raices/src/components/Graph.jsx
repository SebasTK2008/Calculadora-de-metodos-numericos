import React from "react";
import { Line } from "react-chartjs-2";

export default function Graph({ data }) {
  const options = {
  responsive: true,
  animation: { duration: 300 },
  spanGaps: false,

  plugins: {
    legend: {
      labels: {
        color: "white",
        usePointStyle: true,
      },
    },

    tooltip: {
      callbacks: {
        label: (ctx) => {
          if (!ctx.raw) return "";

          return `(${ctx.raw.x.toFixed(4)}, ${ctx.raw.y.toFixed(4)})`;
        },
      },
    },
  },

  scales: {
    x: {
      type: "linear",

      min: -10,
      max: 10,

      ticks: {
        color: "rgba(255,255,255,0.7)",

        stepSize: 1,

        callback: (value) => value,
      },

      grid: {
        color: (ctx) =>
          ctx.tick.value === 0
            ? "rgba(255,255,255,0.45)"
            : "rgba(255,255,255,0.07)",

        lineWidth: (ctx) =>
          ctx.tick.value === 0 ? 2 : 1,
      },
    },

    y: {
      ticks: {
        color: "rgba(255,255,255,0.7)",
      },

      grid: {
        color: (ctx) =>
          ctx.tick.value === 0
            ? "rgba(255,255,255,0.45)"
            : "rgba(255,255,255,0.07)",

        lineWidth: (ctx) =>
          ctx.tick.value === 0 ? 2 : 1,
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