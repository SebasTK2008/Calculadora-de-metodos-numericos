import React from "react";

export default function IterationsTable({ iteraciones, metodoActual }) {
  const fmt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(6) : "-";
  };
  return (
    <>
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
              <tr key={it.iteracion} className="border-b border-slate-700 text-center">
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
              <tr key={it.iteracion} className="border-b border-slate-700 text-center">
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
    </>
  );
}
