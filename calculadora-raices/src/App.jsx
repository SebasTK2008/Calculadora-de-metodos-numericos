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

  const [metodoActual, setMetodoActual] = useState("");

  const evaluar = (expr, x) => {
    return expr.evaluate({ x });
  };

  // =========================
  // MÉTODO DE BISECCIÓN
  // =========================
  const biseccion = () => {
  try {
    setErrorMsg("");
    setMetodoActual("biseccion");

    const expr = compile(funcion);

    let ai = parseFloat(a);
    let bi = parseFloat(b);

    let fa = evaluar(expr, ai);
    let fb = evaluar(expr, bi);

    // Validar intervalo
    if (fa * fb > 0) {
      setErrorMsg(
        "f(a) y f(b) deben tener signos opuestos."
      );
      return;
    }

    let pasos = [];

    let c;
    let fc;

    let error = Infinity;

    let anterior = null;

    let i = 1;

    while (error > tol && i <= 100) {
      // Punto medio
      c = (ai + bi) / 2;

      fc = evaluar(expr, c);

      // Error
      if (anterior !== null) {
        error = Math.abs(c - anterior);
      }

      pasos.push({
        iteracion: i,
        a: ai,
        b: bi,
        c,
        fc,
        error:
          error === Infinity ? 0 : error,
      });

      // Si ya encontró raíz
      if (Math.abs(fc) < tol) {
        break;
      }

      // Elegir nuevo intervalo
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
  // =========================
  // MÉTODO NEWTON-RAPHSON
  // =========================
  const newtonRaphson = () => {
    try {
      setErrorMsg("");
      setMetodoActual("newton");

      const expr = compile(funcion);

      // derivada numérica
      const derivada = (x) => {
        const h = 0.000001;

        return (
          (evaluar(expr, x + h) - evaluar(expr, x - h)) /
          (2 * h)
        );
      };

      let x0 = parseFloat(a);

      let pasos = [];

      let error = 100;

      let i = 1;

      while (error > tol && i < 100) {
        const fx = evaluar(expr, x0);

        const dfx = derivada(x0);

        if (Math.abs(dfx) < 1e-10) {
          setErrorMsg("La derivada es cero.");
          return;
        }

        const x1 = x0 - fx / dfx;

        error = Math.abs(x1 - x0);

        pasos.push({
          iteracion: i,
          x0,
          fx,
          dfx,
          x1,
          error,
        });

        x0 = x1;

        i++;
      }

      setIteraciones(pasos);

      setRaiz(x0);
    } catch (err) {
      setErrorMsg("Función inválida.");
    }
  };

  // =========================
  // GRÁFICA
  // =========================
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
        {/* PANEL IZQUIERDO */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Datos
          </h2>

          {/* FUNCIÓN */}
          <div className="mb-4">
            <label>Función</label>

            <input
              type="text"
              value={funcion}
              onChange={(e) =>
                setFuncion(e.target.value)
              }
              className="w-full p-3 rounded bg-slate-700 mt-2"
            />
          </div>

          {/* VALORES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>a / x0</label>

              <input
                type="number"
                value={a}
                onChange={(e) =>
                  setA(e.target.value)
                }
                className="w-full p-3 rounded bg-slate-700 mt-2"
              />
            </div>

            <div>
              <label>b</label>

              <input
                type="number"
                value={b}
                onChange={(e) =>
                  setB(e.target.value)
                }
                className="w-full p-3 rounded bg-slate-700 mt-2"
              />
            </div>
          </div>

          {/* TOLERANCIA */}
          <div className="mt-4">
            <label>Tolerancia</label>

            <input
              type="number"
              value={tol}
              step="0.0001"
              onChange={(e) =>
                setTol(e.target.value)
              }
              className="w-full p-3 rounded bg-slate-700 mt-2"
            />
          </div>

          {/* BOTONES */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={biseccion}
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold"
            >
              Bisección
            </button>

            <button
              onClick={newtonRaphson}
              className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold"
            >
              Newton
            </button>
          </div>

          {/* RESULTADO */}
          {raiz !== null && (
            <div className="mt-6 bg-green-700 p-4 rounded-xl">
              <h3 className="text-xl font-bold">
                Raíz Aproximada
              </h3>

              <p>{raiz}</p>
            </div>
          )}

          {/* ERROR */}
          {errorMsg && (
            <div className="mt-6 bg-red-700 p-4 rounded-xl">
              {errorMsg}
            </div>
          )}
        </div>

        {/* GRÁFICA */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Gráfica
          </h2>

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

      {/* TABLA */}
      <div className="mt-10 bg-slate-800 p-6 rounded-2xl shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-4">
          Iteraciones
        </h2>

        {/* TABLA BISECCIÓN */}
        {metodoActual === "biseccion" && (
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
                  <td className="p-3">
                    {it.iteracion}
                  </td>

                  <td className="p-3">
                    {it.a.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.b.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.c.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.fc.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {typeof it.error === "number"
                      ? it.error.toFixed(6)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TABLA NEWTON */}
        {metodoActual === "newton" && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-700">
                <th className="p-3">i</th>
                <th className="p-3">x0</th>
                <th className="p-3">f(x0)</th>
                <th className="p-3">f'(x0)</th>
                <th className="p-3">x1</th>
                <th className="p-3">Error</th>
              </tr>
            </thead>

            <tbody>
              {iteraciones.map((it) => (
                <tr
                  key={it.iteracion}
                  className="border-b border-slate-700 text-center"
                >
                  <td className="p-3">
                    {it.iteracion}
                  </td>

                  <td className="p-3">
                    {it.x0.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.fx.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.dfx.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.x1.toFixed(6)}
                  </td>

                  <td className="p-3">
                    {it.error.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}