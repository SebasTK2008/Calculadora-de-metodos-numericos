import React, { useState } from "react";

const EJEMPLOS = [
  "x^3 - x - 2",
  "e^x + x^2 + 5*x - sin(x)",
  "cos(x) - x",
  "log(x) - 1",
  "x^2 - 4",
];

const HINTS = [
  { entrada: "sen(x)  →  sin(x)",  desc: "Notación española aceptada" },
  { entrada: "tg(x)   →  tan(x)",  desc: "Tangente en español" },
  { entrada: "ln(x)   →  log(x)",  desc: "Logaritmo natural" },
  { entrada: "5x      →  5*x",     desc: "Multiplicación implícita" },
  { entrada: "sinx    →  sin(x)",  desc: "Función sin paréntesis" },
  { entrada: "e^x",                desc: "Número de Euler al exponente" },
];

export default function InputPanel({
  funcion,
  setFuncion,
  a,
  setA,
  b,
  setB,
  tol,
  setTol,
  onBiseccion,
  onNewton,
  onSecante,
  onFalsaPosicion,
  onReset,
  raiz,
  errorMsg,
  funcionNormalizada,
  theme,
}) {
  const [mostrarHints, setMostrarHints] = useState(false);
  const isDark = theme === "dark";

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg ${
        isDark ? "bg-slate-800" : "bg-white border border-slate-200"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Datos</h2>

      {/* ── Función ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Función f(x)</label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarHints(!mostrarHints)}
              className={`text-xs underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              {mostrarHints ? "Ocultar ayuda" : "¿Cómo escribir funciones?"}
            </button>

            <button
              onClick={onReset}
              className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
              title="Refrescar"
            >
              Refrescar
            </button>
          </div>
        </div>

        <input
          type="text"
          value={funcion}
          onChange={(e) => setFuncion(e.target.value)}
          className={`w-full p-3 rounded mt-2 font-mono ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
          placeholder="Ej: x^3 - x - 2"
        />

        {/* Función normalizada (lo que se interpreta) */}
        {funcionNormalizada && funcionNormalizada !== funcion && (
          <p className="mt-1 text-xs text-slate-400">
            Interpretado como:{" "}
            <span className="text-yellow-300 font-mono">{funcionNormalizada}</span>
          </p>
        )}
      </div>

      {/* ── Panel de ayuda ── */}
        {mostrarHints && (
        <div className={`mb-4 p-4 rounded-xl text-sm ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
          <p className={`font-bold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Sintaxis aceptada</p>
          <table className="w-full text-xs">
            <tbody>
              {HINTS.map((h, i) => (
                <tr key={i} className={`border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <td className={`py-1 pr-3 font-mono ${isDark ? 'text-green-300' : 'text-green-700'}`}>{h.entrada}</td>
                  <td className={`py-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{h.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-bold text-blue-300 mt-3 mb-2">Ejemplos rápidos</p>
            <div className="flex flex-wrap gap-2">
            {EJEMPLOS.map((ej) => (
              <button
                key={ej}
                onClick={() => setFuncion(ej)}
                className={`${isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'} px-2 py-1 rounded font-mono text-xs`}
              >
                {ej}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Intervalos / punto inicial ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">a / x₀</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className={`w-full p-3 rounded mt-2 ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
          />
        </div>
        <div>
          <label className="font-semibold">b</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className={`w-full p-3 rounded mt-2 ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
          />
        </div>
      </div>

      {/* ── Tolerancia ── */}
      <div className="mt-4">
        <label className="font-semibold">Tolerancia</label>
        <input
          type="number"
          value={tol}
          step="0.0001"
          onChange={(e) => setTol(e.target.value)}
          className={`w-full p-3 rounded mt-2 ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
        />
      </div>

      {/* ── Botones ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <button
          onClick={onSecante}
          className={`p-4 rounded-xl font-bold transition-colors ${isDark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
        >
          Secante
        </button>

        <button
          onClick={onFalsaPosicion}
          className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl font-bold transition-colors"
        >
          Falsa Posición
        </button>
        <button
          onClick={onBiseccion}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold transition-colors"
        >
          Bisección
        </button>
        <button
          onClick={onNewton}
          className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold transition-colors"
        >
          Newton-Raphson
        </button>
      </div>

      {/* ── Resultado ── */}
      {raiz !== null && (
        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-green-700 text-white' : 'bg-green-100 text-slate-900'}`}>
          <h3 className="text-xl font-bold">Raíz Aproximada</h3>
          <p className="font-mono text-lg mt-1">{raiz}</p>
        </div>
      )}

      {/* ── Error ── */}
      {errorMsg && (
        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-red-800 border border-red-500 text-red-100' : 'bg-red-100 border border-red-300 text-red-800'}`}>
          <p className={`font-bold mb-1 ${isDark ? 'text-red-200' : 'text-red-700'}`}>⚠ Error</p>
          <p className="text-sm font-mono">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}