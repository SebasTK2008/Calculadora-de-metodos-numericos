import { useState, useEffect } from "react";
import { compile, derivative, simplify } from "mathjs";

import ConvergenceGraph from "./components/ConvergenceGraph";
import InputPanel from "./components/InputPanel";
import Graph from "./components/Graph";
import IterationsTable from "./components/IterationsTable";

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

  // Multiplicación implícita
  r = r.replace(/(\d)([a-df-zA-DF-Z])/g, "$1*$2");
  r = r.replace(/(\d)(e)(?!\d)/gi, "$1*$2");
  r = r.replace(/\)([a-zA-Z(])/g, ")*$1");

  // Traducciones
  const traducciones = [
    ["arcsen", "asin"],
    ["arccos", "acos"],
    ["arctg", "atan"],
    ["senh", "sinh"],
    ["tgh", "tanh"],
    ["sen", "sin"],
    ["tg", "tan"],
    ["ctg", "cot"],
    ["ln", "log"],
  ];

  traducciones.forEach(([sp, en]) => {
    r = r.replace(new RegExp(`\\b${sp}`, "gi"), en);
  });

  // Funciones sin paréntesis
  const funciones = [
    "asin",
    "acos",
    "atan",
    "sinh",
    "cosh",
    "tanh",
    "log10",
    "sqrt",
    "abs",
    "exp",
    "log",
    "sin",
    "cos",
    "tan",
    "cot",
  ];

  funciones.forEach((fn) => {
    r = r.replace(new RegExp(`\\b${fn}(x)`, "g"), `${fn}($1)`);
    r = r.replace(new RegExp(`\\b${fn}(\\d)`, "g"), `${fn}($1)`);
  });

  return r;
};

// =========================
// COMPILADOR
// =========================
const compilar = (raw) => {
  const normalizada = normalizarFuncion(raw);

  try {
    const simplificada = simplify(normalizada).toString();
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

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const evaluar = (expr, x) => expr.evaluate({ x });

  // =========================
  // RESET
  // =========================
  const resetAll = () => {
    setFuncion("");
    setIteraciones([]);
    setRaiz(null);
    setErrorMsg("");
    setFuncionNormalizada("");
    setMetodoActual("");
  };

  // =========================
  // BISECCIÓN
  // =========================
  const biseccion = () => {
    setErrorMsg("");
    setIteraciones([]);
    setRaiz(null);

    const { expr, normalizada, error } = compilar(funcion);

    setFuncionNormalizada(normalizada);

    if (error) {
      setErrorMsg(`Error de sintaxis: ${error}`);
      return;
    }

    let ai = Number(a);
    let bi = Number(b);

    if (!Number.isFinite(ai) || !Number.isFinite(bi)) {
      setErrorMsg("Intervalo inválido.");
      return;
    }

    let fa, fb;

    try {
      fa = Number(evaluar(expr, ai));
      fb = Number(evaluar(expr, bi));
    } catch (err) {
      setErrorMsg(`Error al evaluar la función: ${err.message}`);
      return;
    }

    if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
      setErrorMsg("f(a) o f(b) no es numérica.");
      return;
    }

    if (fa * fb > 0) {
      setErrorMsg(
        "No se garantiza raíz en el intervalo porque f(a) y f(b) tienen el mismo signo."
      );
      return;
    }

    setMetodoActual("biseccion");

    const pasos = [];

    const TOL = Number(tol) || 1e-8;
    const MAX_IT = 100;

    let c = null;
    let fc = null;
    let anterior = null;
    let errorVal = Infinity;

    for (let i = 1; i <= MAX_IT; i++) {
      c = (ai + bi) / 2;

      fc = Number(evaluar(expr, c));

      if (!Number.isFinite(fc)) {
        setErrorMsg("La función produjo valores inválidos.");
        return;
      }

      if (anterior !== null) {
        errorVal = Math.abs(c - anterior);
      }

      pasos.push({
        iteracion: i,
        a: ai,
        b: bi,
        c,
        fc,
        error: errorVal === Infinity ? 0 : errorVal,
      });

      if (Math.abs(fc) < TOL || errorVal < TOL) {
        setIteraciones(pasos);
        setRaiz(c);
        return;
      }

      if (fa * fc < 0) {
        bi = c;
        fb = fc;
      } else {
        ai = c;
        fa = fc;
      }

      anterior = c;
    }

    setErrorMsg("Bisección no convergió.");
  };

  // =========================
  // NEWTON-RAPHSON
  // =========================
  const newtonRaphson = () => {
    setErrorMsg("");
    setIteraciones([]);
    setRaiz(null);

    const { expr, normalizada, error } = compilar(funcion);

    setFuncionNormalizada(normalizada);

    if (error) {
      setErrorMsg(`Error de sintaxis: ${error}`);
      return;
    }

    setMetodoActual("newton");

    try {
      const derivadaExpr = derivative(normalizada, "x");
      const derivadaCompilada = derivadaExpr.compile();

      let x0 = Number(a);

      const TOL = Number(tol) || 1e-8;
      const MAX_IT = 100;
      const EPS = 1e-12;

      let pasos = [];

      for (let i = 1; i <= MAX_IT; i++) {
        const fx = Number(evaluar(expr, x0));
        const dfx = Number(derivadaCompilada.evaluate({ x: x0 }));

        if (!Number.isFinite(fx) || !Number.isFinite(dfx)) {
          setErrorMsg("La función o derivada devolvió valores inválidos.");
          return;
        }

        if (Math.abs(dfx) < EPS) {
          setErrorMsg("La derivada es cero o demasiado pequeña.");
          return;
        }

        const x1 = x0 - fx / dfx;

        // PROTECCIÓN CONTRA DIVERGENCIA
        if (!Number.isFinite(x1) || Math.abs(x1) > 1e12) {
          setErrorMsg(
            "Newton-Raphson diverge. La función podría no tener raíces reales."
          );
          return;
        }

        const errorVal = Math.abs(x1 - x0);

        pasos.push({
          iteracion: i,
          x0,
          fx,
          dfx,
          x1,
          error: errorVal,
        });

        if (errorVal < TOL || Math.abs(fx) < TOL) {
          const fxFinal = Number(evaluar(expr, x1));

          // VALIDACIÓN REAL
          if (
            !Number.isFinite(fxFinal) ||
            Math.abs(fxFinal) > Math.max(TOL * 10, 1e-6)
          ) {
            setErrorMsg(
              "Newton-Raphson no convergió a una raíz real."
            );
            return;
          }

          setIteraciones(pasos);
          setRaiz(x1);
          return;
        }

        x0 = x1;
      }

      setErrorMsg("Newton-Raphson no convergió.");
    } catch (err) {
      setErrorMsg(`Error: ${err.message}`);
    }
  };

  // =========================
  // SECANTE
  // =========================
  const secante = () => {
    setErrorMsg("");
    setIteraciones([]);
    setRaiz(null);

    const { expr, normalizada, error } = compilar(funcion);

    setFuncionNormalizada(normalizada);

    if (error) {
      setErrorMsg(`Error de sintaxis: ${error}`);
      return;
    }

    setMetodoActual("secante");

    let x0 = Number(a);
    let x1 = Number(b);

    const TOL = Number(tol) || 1e-8;
    const MAX_IT = 100;

    let pasos = [];

    for (let i = 1; i <= MAX_IT; i++) {
      const fx0 = Number(evaluar(expr, x0));
      const fx1 = Number(evaluar(expr, x1));

      if (!Number.isFinite(fx0) || !Number.isFinite(fx1)) {
        setErrorMsg("La función produjo valores inválidos.");
        return;
      }

      const denominador = fx1 - fx0;

      if (Math.abs(denominador) < 1e-14) {
        setErrorMsg("División por cero en secante.");
        return;
      }

      const x2 = x1 - (fx1 * (x1 - x0)) / denominador;

      if (!Number.isFinite(x2) || Math.abs(x2) > 1e12) {
        setErrorMsg(
          "El método de la secante diverge."
        );
        return;
      }

      const errorVal = Math.abs(x2 - x1);

      pasos.push({
        iteracion: i,
        x0,
        x1,
        fx0,
        fx1,
        x2,
        error: errorVal,
      });

      if (errorVal < TOL || Math.abs(fx1) < TOL) {
        const fxFinal = Number(evaluar(expr, x2));

        if (
          !Number.isFinite(fxFinal) ||
          Math.abs(fxFinal) > Math.max(TOL * 10, 1e-6)
        ) {
          setErrorMsg(
            "La secante no convergió a una raíz real."
          );
          return;
        }

        setIteraciones(pasos);
        setRaiz(x2);
        return;
      }

      x0 = x1;
      x1 = x2;
    }

    setErrorMsg("La secante no convergió.");
  };

  // =========================
  // FALSA POSICIÓN
  // =========================
  const falsaPosicion = () => {
    setErrorMsg("");
    setIteraciones([]);
    setRaiz(null);

    const { expr, normalizada, error } = compilar(funcion);

    setFuncionNormalizada(normalizada);

    if (error) {
      setErrorMsg(`Error de sintaxis: ${error}`);
      return;
    }

    setMetodoActual("falsaPosicion");

    let ai = Number(a);
    let bi = Number(b);

    let fa = Number(evaluar(expr, ai));
    let fb = Number(evaluar(expr, bi));

    if (fa * fb > 0) {
      setErrorMsg(
        "f(a) y f(b) deben tener signos opuestos."
      );
      return;
    }

    const pasos = [];

    const TOL = Number(tol) || 1e-8;
    const MAX_IT = 100;

    let anterior = null;

    for (let i = 1; i <= MAX_IT; i++) {
      const c = bi - (fb * (bi - ai)) / (fb - fa);

      const fc = Number(evaluar(expr, c));

      if (!Number.isFinite(fc)) {
        setErrorMsg("La función produjo valores inválidos.");
        return;
      }

      const errorVal =
        anterior === null ? 0 : Math.abs(c - anterior);

      pasos.push({
        iteracion: i,
        a: ai,
        b: bi,
        c,
        fc,
        error: errorVal,
      });

      if (Math.abs(fc) < TOL || errorVal < TOL) {
        setIteraciones(pasos);
        setRaiz(c);
        return;
      }

      if (fa * fc < 0) {
        bi = c;
        fb = fc;
      } else {
        ai = c;
        fa = fc;
      }

      anterior = c;
    }

    setErrorMsg("Falsa posición no convergió.");
  };

  // =========================
  // GRÁFICA
  // =========================
  const generarGrafica = () => {
    const { expr, error } = compilar(funcion);

    if (error) return null;

    const XMIN = -10;
    const XMAX = 10;
    const PASO = 0.02;
    const YCLAMP = 80;

    const puntos = [];

    for (let x = XMIN; x <= XMAX; x += PASO) {
      try {
        const y = evaluar(expr, x);

        puntos.push({
          x,
          y:
            isFinite(y) && Math.abs(y) <= YCLAMP
              ? y
              : null,
        });
      } catch {
        puntos.push({
          x,
          y: null,
        });
      }
    }

    const datasets = [
      {
        label: "f(x)",
        data: puntos,
        parsing: false,
        borderColor: "#60a5fa",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
        spanGaps: false,
      },
    ];

    if (raiz !== null && isFinite(raiz)) {
      datasets.push({
        label: `Raíz ≈ ${raiz.toFixed(6)}`,
        data: [{ x: raiz, y: 0 }],
        parsing: false,
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        pointRadius: 8,
        pointHoverRadius: 10,
        pointStyle: "circle",
        showLine: false,
      });
    }

    return {
      datasets,
    };
  };

  return (
    <div
      className={`min-h-screen flex flex-col p-8 ${
        theme === "dark"
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-900"
      }`}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Calculadora de Raíces
            </h1>

            <h3 className="text-2xl font-bold mt-2">
              (Métodos Numéricos)
            </h3>
          </div>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-200 hover:bg-slate-300"
            }`}
          >
            {theme === "dark"
              ? "🌙 Oscuro"
              : "☀️ Claro"}
          </button>
        </div>

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
            onSecante={secante}
            onFalsaPosicion={falsaPosicion}
            onReset={resetAll}
            raiz={raiz}
            errorMsg={errorMsg}
            funcionNormalizada={funcionNormalizada}
            theme={theme}
          />

          <Graph
            data={generarGrafica()}
            theme={theme}
          />
        </div>

        <div
          className={`mt-10 p-6 rounded-2xl shadow-lg overflow-auto ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-slate-100"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Iteraciones
          </h2>

          <IterationsTable
            iteraciones={iteraciones}
            metodoActual={metodoActual}
            theme={theme}
          />

          <ConvergenceGraph
            iteraciones={iteraciones}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}