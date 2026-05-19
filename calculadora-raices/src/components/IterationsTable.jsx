import React from "react";

export default function IterationsTable({ iteraciones, metodoActual, theme }) {
  const fmt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(6) : "-";
  };

  const isDark = theme === "dark";

  return (
    <>
      {/* =========================
          MÉTODO DE BISECCIÓN
      ========================= */}
      {metodoActual === "biseccion" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
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
                className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} text-center`}
              >
                <td className="p-3">{it.iteracion}</td>

                <td className="p-3">{fmt(it.a)}</td>

                <td className="p-3">{fmt(it.b)}</td>

                <td className="p-3">{fmt(it.c)}</td>

                <td className="p-3">{fmt(it.fc)}</td>

                <td className="p-3">{fmt(it.error)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================
          MÉTODO NEWTON-RAPHSON
      ========================= */}
      {metodoActual === "newton" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <th className="p-3">i</th>
              <th className="p-3">x₀</th>
              <th className="p-3">f(x₀)</th>
              <th className="p-3">f'(x₀)</th>
              <th className="p-3">x₁</th>
              <th className="p-3">Error</th>
            </tr>
          </thead>

          <tbody>
            {iteraciones.map((it) => (
              <tr
                key={it.iteracion}
                className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} text-center`}
              >
                <td className="p-3">{it.iteracion}</td>

                <td className="p-3">{fmt(it.x0)}</td>

                <td className="p-3">{fmt(it.fx)}</td>

                <td className="p-3">{fmt(it.dfx)}</td>

                <td className="p-3">{fmt(it.x1)}</td>

                <td className="p-3">{fmt(it.error)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================
          MÉTODO DE LA SECANTE
      ========================= */}
      {metodoActual === "secante" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <th className="p-3">i</th>
              <th className="p-3">x₀</th>
              <th className="p-3">x₁</th>
              <th className="p-3">f(x₀)</th>
              <th className="p-3">f(x₁)</th>
              <th className="p-3">x₂</th>
              <th className="p-3">Error</th>
            </tr>
          </thead>

          <tbody>
            {iteraciones.map((it) => (
              <tr
                key={it.iteracion}
                className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} text-center`}
              >
                <td className="p-3">{it.iteracion}</td>

                <td className="p-3">{fmt(it.x0)}</td>

                <td className="p-3">{fmt(it.x1)}</td>

                <td className="p-3">{fmt(it.fx0)}</td>

                <td className="p-3">{fmt(it.fx1)}</td>

                <td className="p-3">{fmt(it.x2)}</td>

                <td className="p-3">{fmt(it.error)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================
          MÉTODO FALSA POSICIÓN
      ========================= */}
      {metodoActual === "falsaPosicion" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
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
                className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} text-center`}
              >
                <td className="p-3">{it.iteracion}</td>

                <td className="p-3">{fmt(it.a)}</td>

                <td className="p-3">{fmt(it.b)}</td>

                <td className="p-3">{fmt(it.c)}</td>

                <td className="p-3">{fmt(it.fc)}</td>

                <td className="p-3">{fmt(it.error)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}