import React from "react";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
} from "chart.js";

ChartJS.register(zoomPlugin);

export default function Graph({ data, theme }) {
  const isDark = theme === "dark";

  const options = {
    responsive: true,
    animation: { duration: 300 },
    spanGaps: false,

    plugins: {
      legend: {
        labels: {
          color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
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
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },

        zoom: {
          wheel: {
            enabled: true,
          },

          pinch: {
            enabled: true,
          },

          mode: "xy",
        },
      },
    },

    scales: {
      x: {
        type: "linear",

        min: -10,
        max: 10,

        ticks: {
          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",

          stepSize: 1,

          callback: (value) => value,
        },

        grid: {
          color: (ctx) =>
            ctx.tick.value === 0
              ? isDark
                ? "rgba(255,255,255,0.45)"
                : "rgba(0,0,0,0.45)"
              : isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.07)",

          lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
        },
      },

      y: {
        ticks: {
          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        },

        grid: {
          color: (ctx) =>
            ctx.tick.value === 0
              ? isDark
                ? "rgba(255,255,255,0.45)"
                : "rgba(0,0,0,0.45)"
              : isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.07)",

          lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
        },
      },
    },
  };

  return (
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'} p-6 rounded-2xl shadow-lg`}>
      <h2 className="text-2xl font-bold mb-4">Gráfica</h2>

      {data ? (
        <Line data={data} options={options} />
      ) : (
        <div className={`flex items-center justify-center h-48 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Función inválida o sin datos
        </div>
      )}
    </div>
  );
}