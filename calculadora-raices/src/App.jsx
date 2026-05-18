import { useState } from "react";
import { compile, derivative, simplify } from "mathjs";

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

import InputPanel from "./components/InputPanel";
import Graph from "./components/Graph";
import IterationsTable from "./components/IterationsTable";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

// =========================
// NORMALIZADOR DE FUNCIONES
// =========================
export const normalizarFuncion = (expr) => {
  let r = expr.trim();

  // PASO 1: Multiplicación implícita PRIMERO
  // (para que \b funcione en pasos siguientes)
  r = r.replace(/(\d)([a-df-zA-DF-Z])/g, "$1*$2"); // 5x→5*x (excluye e/E)
  r = r.replace(/(\d)(e)(?!\d)/gi, "$1*$2");         // 2e^x→2*e^x (no 1e5)
  r = r.replace(/\)([a-zA-Z(])/g, ")*$1");           // )x→)*x

  // PASO 2: Nombres en español → mathjs (más largos primero)
  const traducciones = [
    ["arcsen", "asin"],
    ["arccos", "acos"],
    ["arctg",  "atan"],
    ["senh",   "sinh"],
    ["tgh",    "tanh"],
    ["sen",    "sin"],
    ["tg",     "tan"],
    ["ctg",    "cot"],
    ["ln",     "log"],
  ];
  traducciones.forEach(([sp, en]) => {
    r = r.replace(new RegExp(`\\b${sp}`, "gi"), en);
  });

  // PASO 3: Funciones sin paréntesis → agregar paréntesis (más largos primero)
  const funciones = [
    "asin","acos","atan","sinh","cosh","tanh",
    "log10","sqrt","abs","exp","log",
    "sin","cos","tan","cot",
  ];
  funciones.forEach((fn) => {
    r = r.replace(new RegExp(`\\b${fn}(x)`,   "g"), `${fn}($1)`);
    r = r.replace(new RegExp(`\\b${fn}(\\d)`, "g"), `${fn}($1)`);
  });

  return r;
};

// Compilación pura: sin setState (evita bucle infinito en render)
const compilar = (raw) => {
  const normalizada = normalizarFuncion(raw);

  try {
    // SIMPLIFICAR EXPRESIÓN
    const simplificada = simplify(normalizada).toString();

    // COMPILAR
    const expr = compile(simplificada);

    return {
      expr,
      normalizada: simplificada,
      error: null,
    };

  } catch (err) {
    return {
      expr: null,
      normalizada,
      error: err.message,
    };
  }
};

export default function App() {
  const [funcion, setFuncion] = useState("x^3 - x - 2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [tol, setTol] = useState(0.0001);

  const [iteraciones, setIteraciones] = useState([]);
  const [raiz, setRaiz] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [funcionNormalizada, setFuncionNormalizada] = useState("");
  const [metodoActual, setMetodoActual] = useState("");

  const evaluar = (expr, x) => expr.evaluate({ x });

  // =========================
  // MÉTODO DE BISECCIÓN
  // =========================
  const biseccion = () => {
    setErrorMsg("");
    setMetodoActual("biseccion");

    const { expr, normalizada, error } = compilar(funcion);
    setFuncionNormalizada(normalizada);

    if (error) { setErrorMsg(`Error de sintaxis: ${error}`); return; }

    let ai = parseFloat(a);
    let bi = parseFloat(b);
    let fa, fb;

    try {
      fa = evaluar(expr, ai);
      fb = evaluar(expr, bi);
    } catch (err) {
      setErrorMsg(`Error al evaluar la función: ${err.message}`);
      return;
    }

    if (fa * fb > 0) {
      setErrorMsg("f(a) y f(b) deben tener signos opuestos para garantizar una raíz en el intervalo.");
      return;
    }

    let pasos = [];
    let c, fc;
    let error2 = Infinity;
    let anterior = null;
    let i = 1;

    while (error2 > tol && i <= 100) {
      c = (ai + bi) / 2;
      try { fc = evaluar(expr, c); }
      catch (err) { setErrorMsg(`Error al evaluar en c=${c}: ${err.message}`); return; }

      if (anterior !== null) error2 = Math.abs(c - anterior);
      pasos.push({ iteracion: i, a: ai, b: bi, c, fc, error: error2 === Infinity ? 0 : error2 });

      if (Math.abs(fc) < tol) break;
      if (fa * fc < 0) { bi = c; fb = fc; }
      else             { ai = c; fa = fc; }

      anterior = c;
      i++;
    }

    setIteraciones(pasos);
    setRaiz(c);
  };

  // =========================
  // MÉTODO NEWTON-RAPHSON
  // =========================
  const newtonRaphson = () => {
  setErrorMsg("");
  setMetodoActual("newton");

  const { expr, normalizada, error } = compilar(funcion);

  setFuncionNormalizada(normalizada);

  if (error) {
    setErrorMsg(`Error de sintaxis: ${error}`);
    return;
  }

  try {
    // DERIVADA SIMBÓLICA
    const derivadaExpr = derivative(normalizada, "x");

    const derivadaCompilada = derivadaExpr.compile();

    let x0 = parseFloat(a);

    let pasos = [];

    let errorVal = Infinity;

    let i = 1;

    while (errorVal > tol && i <= 100) {

      const fx = evaluar(expr, x0);

      const dfx = derivadaCompilada.evaluate({ x: x0 });

      if (Math.abs(dfx) < 1e-12) {
        setErrorMsg(
          "La derivada es cero o muy cercana a cero."
        );
        return;
      }

      const x1 = x0 - fx / dfx;

      errorVal = Math.abs(x1 - x0);

      pasos.push({
        iteracion: i,
        x0,
        fx,
        dfx,
        x1,
        error: errorVal,
      });

      if (Math.abs(fx) < tol) {
        x0 = x1;
        break;
      }

      x0 = x1;

      i++;
    }

    setIteraciones(pasos);

    setRaiz(x0);

  } catch (err) {
    setErrorMsg(`Error: ${err.message}`);
  }
};

  // =========================
  // GRÁFICA
  // =========================
  const generarGrafica = () => {
    const { expr, error } = compilar(funcion);
    if (error) return null;

    // Rango centrado en el origen, con paso fino para mayor precisión
    const XMIN  = -10;
    const XMAX  = 10;
    const PASO  = 0.1;
    // Umbral de corte para discontinuidades (asíntotas, saltos)
    const YCLAMP = 80;

    const xs = [];
    const ys = [];

    for (let x = XMIN; x <= XMAX + 1e-9; x += PASO) {
      const xr = Math.round(x * 10) / 10; // evitar acumulación de punto flotante
      xs.push(xr);
      try {
        const y = evaluar(expr, xr);
        // null genera un "gap" en la curva → correcto para asíntotas
        ys.push(isFinite(y) && Math.abs(y) <= YCLAMP ? y : null);
      } catch {
        ys.push(null);
      }
    }

    // Detectar saltos bruscos (posibles discontinuidades) y forzar null
    for (let i = 1; i < ys.length - 1; i++) {
      if (ys[i] !== null && ys[i - 1] !== null && ys[i + 1] !== null) {
        const salto1 = Math.abs(ys[i] - ys[i - 1]);
        const salto2 = Math.abs(ys[i + 1] - ys[i]);
        if (salto1 > 20 || salto2 > 20) {
          ys[i] = null; // rompe la línea en discontinuidades
        }
      }
    }

    const datasets = [
      {
        label: "f(x)",
        data: ys,
        borderColor: "#60a5fa",       // azul
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,               // sin puntos individuales
        tension: 0.2,
      },
    ];

    // ── Marcador de raíz ──────────────────────────────────────────────
    if (raiz !== null && raiz >= XMIN && raiz <= XMAX) {
      // Encontrar el índice más cercano a la raíz en nuestro array xs
      const idx = xs.reduce(
        (best, x, i) => (Math.abs(x - raiz) < Math.abs(xs[best] - raiz) ? i : best),
        0
      );

      // Punto en (raiz, 0) — la raíz es donde f(x)≈0
      const rootData = xs.map(() => null);
      rootData[idx] = 0;

      datasets.push({
        label: `Raíz ≈ ${raiz.toFixed(5)}`,
        data: rootData,
        borderColor: "#f87171",
        backgroundColor: "#f87171",   // rojo
        pointRadius: xs.map((_, i) => (i === idx ? 9 : 0)),
        pointHoverRadius: 12,
        pointStyle: "circle",
        showLine: false,
        spanGaps: false,
      });
    }

    return { labels: xs, datasets };
  };

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Calculadora de Raíces</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <InputPanel
          funcion={funcion}
          setFuncion={setFuncion}
          a={a}
          setA={setA}
          b={b}
          setB={setB}
          tol={tol}
          setTol={setTol}
          onBiseccion={biseccion}
          onNewton={newtonRaphson}
          raiz={raiz}
          errorMsg={errorMsg}
          funcionNormalizada={funcionNormalizada}
        />

        <Graph data={generarGrafica()} />
      </div>

      <div className="mt-10 bg-slate-800 p-6 rounded-2xl shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Iteraciones</h2>
        <IterationsTable iteraciones={iteraciones} metodoActual={metodoActual} />
      </div>
    </div>
  );
}