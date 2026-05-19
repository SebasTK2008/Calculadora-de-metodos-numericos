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
    setIteraciones([]);

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
      setErrorMsg("f(a) o f(b) no es numérica en el intervalo dado.");
      return;
    }

    if (fa * fb > 0) {
      setErrorMsg("f(a) y f(b) deben tener signos opuestos para garantizar una raíz en el intervalo.");
      return;
    }

    setMetodoActual("biseccion");

    let pasos = [];
    let c = null;
    let fc = null;
    let error2 = Infinity;
    let anterior = null;
    let i = 1;

    const TOL = Number(tol) || 1e-8;
    const MAX_IT = 100;

    while (error2 > TOL && i <= MAX_IT) {
      c = (ai + bi) / 2;
      try {
        fc = Number(evaluar(expr, c));
      } catch (err) {
        setErrorMsg(`Error al evaluar en c=${c}: ${err.message}`);
        return;
      }

      if (!Number.isFinite(fc)) {
        setErrorMsg(`f(c) no es numérica en c=${c}`);
        return;
      }

      if (anterior !== null) error2 = Math.abs(c - anterior);

      pasos.push({ iteracion: i, a: ai, b: bi, c, fc, error: error2 === Infinity ? 0 : error2 });

      if (Math.abs(fc) < TOL) break;

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
  };

  // =========================
  // RESET / REFRESH
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
  // MÉTODO NEWTON-RAPHSON
  // =========================
  const newtonRaphson = () => {
    setErrorMsg("");
    setIteraciones([]);

    const { expr, normalizada, error } = compilar(funcion);
    setFuncionNormalizada(normalizada);

    if (error) {
      setErrorMsg(`Error de sintaxis: ${error}`);
      return;
    }

    setMetodoActual("newton");

    try {
      // DERIVADA SIMBÓLICA
      const derivadaExpr = derivative(normalizada, "x");
      const derivadaCompilada = derivadaExpr.compile();

      let x0 = Number(a);
      const TOL = Number(tol) || 1e-8;

      let pasos = [];
      let errorVal = Infinity;
      let i = 1;
      const MAX_IT = 100;
      const EPS_DERIV = 1e-12;

      while (errorVal > TOL && i <= MAX_IT) {
        let fx;
        try { fx = Number(evaluar(expr, x0)); }
        catch (err) { setErrorMsg(`Error al evaluar f en x=${x0}: ${err.message}`); return; }

        let dfxRaw;
        try {
          dfxRaw = derivadaCompilada.evaluate({ x: x0 });
        } catch (err) {
          setErrorMsg(`No se pudo evaluar la derivada en x=${x0}: ${err.message}`);
          return;
        }

        let dfx = Number(dfxRaw);

        // Si derivada muy pequeña o no numérica, intentar perturbar el punto inicial
        if (!Number.isFinite(dfx) || Math.abs(dfx) < EPS_DERIV) {
          let found = false;
          const deltas = [1e-6, 1e-4, 1e-3, 1e-2, 1e-1, 0.5, 1];

          for (const delta of deltas) {
            try {
              const dposRaw = derivadaCompilada.evaluate({ x: x0 + delta });
              const dpos = Number(dposRaw);
              if (Number.isFinite(dpos) && Math.abs(dpos) >= EPS_DERIV) {
                pasos.push({ iteracion: i, x0, fx, dfx: dpos, x1: x0 + delta, error: Math.abs(delta) });
                x0 = x0 + delta;
                dfx = dpos;
                found = true;
                i++;
                break;
              }

              const dnegRaw = derivadaCompilada.evaluate({ x: x0 - delta });
              const dneg = Number(dnegRaw);
              if (Number.isFinite(dneg) && Math.abs(dneg) >= EPS_DERIV) {
                pasos.push({ iteracion: i, x0, fx, dfx: dneg, x1: x0 - delta, error: Math.abs(delta) });
                x0 = x0 - delta;
                dfx = dneg;
                found = true;
                i++;
                break;
              }
            } catch (e) {
              // ignorar y seguir probando
            }
          }

          if (!found) {
            // Fallback: aproximar derivada con secante usando x0 y x0+delta
            const delta = 1e-3;
            const xPrev = x0 + delta;
            let fxPrev;
            try {
              fxPrev = Number(evaluar(expr, xPrev));
            } catch (err) {
              setErrorMsg(`No se pudo evaluar f(x) para fallback secante: ${err.message}`);
              return;
            }

            if (fxPrev === fx) {
              setErrorMsg("La derivada es cero y no se pudo aplicar un método alternativo.");
              return;
            }

            const approxD = (fx - fxPrev) / (x0 - xPrev);
            const x1 = x0 - (fx * (x0 - xPrev)) / (fx - fxPrev);

            errorVal = Math.abs(x1 - x0);
            pasos.push({ iteracion: i, x0, fx, dfx: approxD, x1, error: errorVal });
            x0 = x1;
            i++;
            continue;
          }
        }

        // Paso Newton normal
        const x1 = x0 - fx / dfx;
        errorVal = Math.abs(x1 - x0);

        pasos.push({ iteracion: i, x0, fx, dfx, x1, error: errorVal });

        if (Math.abs(fx) < TOL) {
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
// MÉTODO DE LA SECANTE
// =========================
const secante = () => {
  setErrorMsg("");
  setIteraciones([]);

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
  let errorVal = Infinity;
  let i = 1;

  while (errorVal > TOL && i <= MAX_IT) {
    let fx0, fx1;

    try {
      fx0 = Number(evaluar(expr, x0));
      fx1 = Number(evaluar(expr, x1));
    } catch (err) {
      setErrorMsg(`Error al evaluar la función: ${err.message}`);
      return;
    }

    if (!Number.isFinite(fx0) || !Number.isFinite(fx1)) {
      setErrorMsg("La función devolvió valores no numéricos.");
      return;
    }

    const denominador = fx1 - fx0;

    if (Math.abs(denominador) < 1e-14) {
      setErrorMsg("División por cero en el método de la secante.");
      return;
    }

    const x2 = x1 - (fx1 * (x1 - x0)) / denominador;

    errorVal = Math.abs(x2 - x1);

    pasos.push({
      iteracion: i,
      x0,
      x1,
      fx0,
      fx1,
      x2,
      error: errorVal,
    });

    if (Math.abs(fx1) < TOL) break;

    x0 = x1;
    x1 = x2;

    i++;
  }

  setIteraciones(pasos);
  setRaiz(x1);
};

// =========================
// MÉTODO DE FALSA POSICIÓN
// =========================
const falsaPosicion = () => {
  setErrorMsg("");
  setIteraciones([]);

  const { expr, normalizada, error } = compilar(funcion);
  setFuncionNormalizada(normalizada);

  if (error) {
    setErrorMsg(`Error de sintaxis: ${error}`);
    return;
  }

  setMetodoActual("falsaPosicion");

  let ai = Number(a);
  let bi = Number(b);

  const TOL = Number(tol) || 1e-8;
  const MAX_IT = 100;

  let fa, fb;

  try {
    fa = Number(evaluar(expr, ai));
    fb = Number(evaluar(expr, bi));
  } catch (err) {
    setErrorMsg(`Error al evaluar la función: ${err.message}`);
    return;
  }

  if (fa * fb > 0) {
    setErrorMsg("f(a) y f(b) deben tener signos opuestos.");
    return;
  }

  let pasos = [];
  let c = null;
  let errorVal = Infinity;
  let anterior = null;
  let i = 1;

  while (errorVal > TOL && i <= MAX_IT) {
    c = bi - (fb * (bi - ai)) / (fb - fa);

    let fc;

    try {
      fc = Number(evaluar(expr, c));
    } catch (err) {
      setErrorMsg(`Error al evaluar en c=${c}: ${err.message}`);
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

    if (Math.abs(fc) < TOL) break;

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
};

  // =========================
  // GRÁFICA
  // =========================
  const generarGrafica = () => {
  const { expr, error } = compilar(funcion);
  if (error) return null;

  const XMIN = -10;
  const XMAX = 10;

  // MÁS PRECISIÓN
  const PASO = 0.02;

  const YCLAMP = 80;

  const puntos = [];

  for (let x = XMIN; x <= XMAX; x += PASO) {
    try {
      const y = evaluar(expr, x);

      puntos.push({
        x,
        y: isFinite(y) && Math.abs(y) <= YCLAMP ? y : null,
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

  // MARCADOR DE RAÍZ EXACTO
  if (raiz !== null && isFinite(raiz)) {
    datasets.push({
      label: `Raíz ≈ ${raiz.toFixed(6)}`,
      data: [
        {
          x: raiz,
          y: 0,
        },
      ],
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
    <div className="min-h-screen flex flex-col p-8 bg-slate-900 text-white">
      <div className="flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center">Calculadora de Raíces</h1>
        <h3 className="text-2xl font-bold mb-2 text-center">(métodos numéricos)</h3>

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
          />

          <Graph data={generarGrafica()} />
        </div>

        <div className="mt-10 bg-slate-800 p-6 rounded-2xl shadow-lg overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Iteraciones</h2>
          <IterationsTable iteraciones={iteraciones} metodoActual={metodoActual} />
        </div>
      </div>

    
    </div>
  );
}