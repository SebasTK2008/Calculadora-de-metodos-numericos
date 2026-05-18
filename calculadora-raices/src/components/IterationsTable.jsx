import React from "react";

export default function IterationsTable({ iteraciones, metodoActual }) {
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

                <td className="p-3">{it.a.toFixed(6)}</td>

                <td className="p-3">{it.b.toFixed(6)}</td>

                <td className="p-3">{it.c.toFixed(6)}</td>

                <td className="p-3">{it.fc.toFixed(6)}</td>

                <td className="p-3">{typeof it.error === "number" ? it.error.toFixed(6) : "-"}</td>
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

                <td className="p-3">{it.x0.toFixed(6)}</td>

                <td className="p-3">{it.fx.toFixed(6)}</td>

                <td className="p-3">{it.dfx.toFixed(6)}</td>

                <td className="p-3">{it.x1.toFixed(6)}</td>

                <td className="p-3">{it.error.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
