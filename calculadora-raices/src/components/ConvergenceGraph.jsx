import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale
);

export default function ConvergenceGraph({ iteraciones, theme }) {
  const isDark = theme === "dark";
  if (!iteraciones || iteraciones.length === 0) return null;

  const labels = iteraciones.map((it) => it.iteracion);

  const errores = iteraciones.map((it) => it.error);

  const data = {
    labels,
    datasets: [
      {
        label: "Error",
        data: errores,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        borderWidth: 2,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: isDark ? "white" : "rgba(0,0,0,0.85)",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: isDark ? "white" : "rgba(0,0,0,0.85)",
        },
      },

      y: {
        ticks: {
          color: isDark ? "white" : "rgba(0,0,0,0.85)",
        },
      },
    },
  };

  return (
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'} p-6 rounded-2xl shadow-lg mt-10`}>
      <h2 className="text-2xl font-bold mb-4">
        Convergencia del Método
      </h2>

      <Line data={data} options={options} />
    </div>
  );
}
