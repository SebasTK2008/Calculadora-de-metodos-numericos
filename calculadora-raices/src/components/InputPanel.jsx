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
  funcion, setFuncion,
  a, setA,
  b, setB,
  tol, setTol,
  onBiseccion, onNewton,
  raiz, errorMsg,
  funcionNormalizada,
}) {
  const [mostrarHints, setMostrarHints] = useState(false);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Datos</h2>

      {/* ── Función ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Función f(x)</label>
          <button
            onClick={() => setMostrarHints(!mostrarHints)}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            {mostrarHints ? "Ocultar ayuda" : "¿Cómo escribir funciones?"}
          </button>
        </div>

        <input
          type="text"
          value={funcion}
          onChange={(e) => setFuncion(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 mt-2 font-mono"
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
        <div className="mb-4 p-4 bg-slate-700 rounded-xl text-sm">
          <p className="font-bold text-blue-300 mb-2">Sintaxis aceptada</p>
          <table className="w-full text-xs">
            <tbody>
              {HINTS.map((h, i) => (
                <tr key={i} className="border-b border-slate-600">
                  <td className="py-1 pr-3 font-mono text-green-300">{h.entrada}</td>
                  <td className="py-1 text-slate-300">{h.desc}</td>
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
                className="bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded font-mono text-xs"
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
            className="w-full p-3 rounded bg-slate-700 mt-2"
          />
        </div>
        <div>
          <label className="font-semibold">b</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 mt-2"
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
          className="w-full p-3 rounded bg-slate-700 mt-2"
        />
      </div>

      {/* ── Botones ── */}
      <div className="grid grid-cols-2 gap-4 mt-6">
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
        <div className="mt-6 bg-green-700 p-4 rounded-xl">
          <h3 className="text-xl font-bold">Raíz Aproximada</h3>
          <p className="font-mono text-lg mt-1">{raiz}</p>
        </div>
      )}

      {/* ── Error ── */}
      {errorMsg && (
        <div className="mt-6 bg-red-800 border border-red-500 p-4 rounded-xl">
          <p className="font-bold text-red-200 mb-1">⚠ Error</p>
          <p className="text-sm font-mono text-red-100">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}