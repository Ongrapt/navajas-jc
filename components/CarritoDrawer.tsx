"use client";

import Link from "next/link";
import { useCarrito } from "./CarritoProvider";
import { precioMXN, formatoDocenas } from "@/lib/formato";

export function CarritoDrawer() {
  const { items, abierto, setAbierto, totalCentavos, cambiarCantidad, quitar } = useCarrito();

  return (
    <>
      {/* Fondo */}
      <div
        onClick={() => setAbierto(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-steel-line bg-steel-base transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-steel-line px-5 py-4">
          <h2 className="font-display text-lg uppercase tracking-[0.15em] text-bone">Tu carrito</h2>
          <button onClick={() => setAbierto(false)} className="text-bone-dim hover:text-bone" aria-label="Cerrar">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-bone-dim">
              Tu carrito está vacío.<br />Elige una pieza del catálogo.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={`${i.producto.slug}-${i.medida}`} className="flex gap-3 border-b border-steel-line/60 pb-4">
                  <div className="flex-1">
                    <p className="font-display text-sm uppercase tracking-wide text-bone">
                      {i.producto.nombre} — {i.medida}
                    </p>
                    <p className="text-xs text-bone-dim">{precioMXN(i.producto.precio)} / docena (12 piezas)</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => cambiarCantidad(i.producto.slug, i.medida, i.cantidad - 1)} className="h-6 w-6 border border-steel-line text-bone-dim hover:border-brass hover:text-brass">−</button>
                      <span className="min-w-[5.5rem] text-center text-sm text-bone">{formatoDocenas(i.cantidad)}</span>
                      <button onClick={() => cambiarCantidad(i.producto.slug, i.medida, i.cantidad + 1)} className="h-6 w-6 border border-steel-line text-bone-dim hover:border-brass hover:text-brass">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-display text-sm text-bone">{precioMXN(i.producto.precio * i.cantidad)}</span>
                    <button onClick={() => quitar(i.producto.slug, i.medida)} className="text-[11px] uppercase tracking-wide text-bone-dim hover:text-oxblood">Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-steel-line px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-bone-dim">Total</span>
              <span className="font-display text-xl text-bone">{precioMXN(totalCentavos)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setAbierto(false)}
              className="block w-full rounded-sm bg-brass py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:bg-brass-bright"
            >
              Continuar compra
            </Link>
            <p className="mt-3 text-center text-[10px] text-bone-dim">
              Elige tu envío y paga de forma segura con Mercado Pago.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
