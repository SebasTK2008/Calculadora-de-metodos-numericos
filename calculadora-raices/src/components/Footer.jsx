import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-700 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-sm text-left">
          <div className="font-medium text-white">Hecho por <span className="font-semibold">Sebastian Alcendra</span></div>
          <div className="text-xs text-slate-400">Calculadora de Raíces</div>
        </div>

        <div className="text-sm text-right">
          <a href="tel:+573241704274" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <span className="text-lg">📞</span>
            <span>3241704274</span>
          </a>
          <div className="text-xs text-slate-500 mt-1">© {year} Sebastian Alcendra</div>
        </div>
      </div>
    </footer>
  );
}
