import { useState } from "react";
import { compile } from "mathjs";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

export default function App() {
  const [funcion, setFuncion] = useState("x^3 - x - 2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [tol, setTol] = useState(0.0001);
  const [iteraciones, setIteraciones] = useState([]);
  const [raiz, setRaiz] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const evaluar = (expr, x) => {
    return expr.evaluate({ x });
  };

  const biseccion = () => {
    try {
      setErrorMsg("");

      const expr = compile(funcion);

      let ai = parseFloat(a);
      let bi = parseFloat(b);

      let fa = evaluar(expr, ai);
      let fb = evaluar(expr, bi);

      if (fa * fb > 0) {
        setErrorMsg("El intervalo no contiene una raíz.");
        return;
      }

      let pasos = [];
      let c = 0;
      let error = 100;
      let i = 1;
      let anterior = 0;

      while (error > tol && i < 100) {
        c = (ai + bi) / 2;

        const fc = evaluar(expr, c);

        if (i > 1) {
          error = Math.abs(c - anterior);
        }

        pasos.push({
          iteracion: i,
          a: ai,
          b: bi,
          c,
          fc,
          error,
        });

        if (fa * fc < 0) {
          bi = c;
          fb = fc;
        } else {
          ai = c;
          fa = fc;
        }

        anterior = c;
        i++;
      }

      setIteraciones(pasos);
      setRaiz(c);
    } catch (err) {
      setErrorMsg("Función inválida.");
    }
  };

  const generarGrafica = () => {
    try {
      const expr = compile(funcion);

      const xs = [];
      const ys = [];

      for (let x = -10; x <= 10; x += 0.5) {
        xs.push(x);
        ys.push(evaluar(expr, x));
      }

      return {
        labels: xs,
        datasets: [
          {
            label: "f(x)",
            data: ys,
            borderWidth: 2,
          },
        ],
      };
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Calculadora de Raíces
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Datos</h2>

          <div className="mb-4">
            <label>Función</label>
            <input
              type="text"
              value={funcion}
              onChange={(e) => setFuncion(e.target.value)}
              className="w-full p-3 rounded bg-slate-700 mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>a</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 mt-2"
              />
            </div>

            <div>
              <label>b</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 mt-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <label>Tolerancia</label>
            <input
              type="number"
              value={tol}
              step="0.0001"
              onChange={(e) => setTol(e.target.value)}
              className="w-full p-3 rounded bg-slate-700 mt-2"
            />
          </div>

          <button
            onClick={biseccion}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold"
          >
            Resolver
          </button>

          {raiz && (
            <div className="mt-6 bg-green-700 p-4 rounded-xl">
              <h3 className="text-xl font-bold">Raíz Aproximada</h3>
              <p>{raiz}</p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-6 bg-red-700 p-4 rounded-xl">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Gráfica</h2>

          {generarGrafica() && (
            <Line
              data={generarGrafica()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "white",
                    },
                  },
                  y: {
                    ticks: {
                      color: "white",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-10 bg-slate-800 p-6 rounded-2xl shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Iteraciones</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="p-3">i</th>
              <th className="p-3">a</th>
              <th className="p-3">b</th>
              <th className="p-3">c</th>
              <th className="p-3">f(c)</th>
              <th className="p-3">Error</th>
            </tr>
          </thead>

          <tbody>
            {iteraciones.map((it) => (
              <tr
                key={it.iteracion}
                className="border-b border-slate-700 text-center"
              >
                <td className="p-3">{it.iteracion}</td>
                <td className="p-3">{it.a.toFixed(6)}</td>
                <td className="p-3">{it.b.toFixed(6)}</td>
                <td className="p-3">{it.c.toFixed(6)}</td>
                <td className="p-3">{it.fc.toFixed(6)}</td>
                <td className="p-3">
                  {typeof it.error === "number"
                    ? it.error.toFixed(6)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}