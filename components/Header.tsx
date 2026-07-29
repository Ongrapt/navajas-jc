"use client";

import { useCarrito } from "./CarritoProvider";

export function Header() {
  const { totalItems, setAbierto } = useCarrito();
  return (
    <header className="sticky top-0 z-40 border-b border-steel-line/70 bg-steel-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#inicio" className="group leading-none">
          <span className="block font-display text-lg uppercase tracking-[0.18em] text-bone">
            Navajas Javier Calleros
          </span>
          <span className="block text-[10px] uppercase tracking-[0.4em] text-brass">
            Est. 1955 · Hechas a mano
          </span>
        </a>
        <button
          onClick={() => setAbierto(true)}
          className="relative rounded-sm border border-steel-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-bone transition hover:border-brass hover:text-brass"
        >
          Carrito
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 text-[11px] font-semibold text-steel-base">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
