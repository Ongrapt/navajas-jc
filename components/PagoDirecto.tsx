"use client";

import { useState } from "react";
import { MEDIDAS_DISPONIBLES, type Producto } from "@/lib/productos";
import { precioMXN } from "@/lib/formato";
import { FormularioPago } from "@/components/FormularioPago";

// Link de pago directo de un modelo (/pagar/[slug]): el cliente elige medida
// y cantidad aquí mismo y paga, sin pasar por el catálogo ni el carrito.
// No toca el carrito guardado del navegador.
export function PagoDirecto({ producto }: { producto: Producto }) {
  const [medida, setMedida] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const items = medida ? [{ producto, medida, cantidad }] : [];

  return (
    <FormularioPago items={items} totalCentavos={producto.precio * cantidad} titulo={`Comprar ${producto.nombre}`}>
      <section className="mt-8 flex flex-col gap-5 border border-steel-line/70 bg-steel-panel p-5 sm:flex-row">
        {producto.imagen && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="aspect-square w-full rounded-sm object-cover sm:w-40"
          />
        )}
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-brass">{producto.linea}</p>
          <h2 className="mt-1 font-display text-2xl uppercase text-bone">{producto.nombre}</h2>
          <p className="mt-1 text-xs text-bone-dim">{producto.material}</p>

          <div className="mt-3 flex flex-col">
            {producto.precioAnterior && (
              <span className="text-sm text-bone-dim line-through">De {precioMXN(producto.precioAnterior)}</span>
            )}
            <span className="font-display text-2xl text-bone">{precioMXN(producto.precio)}</span>
            <span className="text-[10px] uppercase tracking-wide text-bone-dim">/ docena (12 piezas)</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">Medida</label>
              <select
                value={medida}
                onChange={(e) => setMedida(e.target.value)}
                className="w-full border border-steel-line bg-steel-base px-3 py-2 text-sm text-bone focus:border-brass focus:outline-none"
              >
                <option value="">Elegir</option>
                {MEDIDAS_DISPONIBLES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">Docenas</label>
              <div className="flex items-center border border-steel-line bg-steel-base">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-2 text-bone-dim hover:text-bone"
                  aria-label="Una docena menos"
                >
                  −
                </button>
                <span className="flex-1 text-center text-sm text-bone">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(99, c + 1))}
                  className="px-3 py-2 text-bone-dim hover:text-bone"
                  aria-label="Una docena más"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {!medida && <p className="mt-2 text-[11px] text-bone-dim">Elige la medida para poder pagar.</p>}
        </div>
      </section>
    </FormularioPago>
  );
}
