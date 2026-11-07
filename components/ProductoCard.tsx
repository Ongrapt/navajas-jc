"use client";

import { useState } from "react";
import { MEDIDAS_DISPONIBLES, type Producto } from "@/lib/productos";
import { precioMXN } from "@/lib/formato";
import { useCarrito } from "./CarritoProvider";
import { MarcadorFilo } from "./MarcadorFilo";

export function ProductoCard({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [medida, setMedida] = useState("");

  function manejarAgregar() {
    if (!medida) return;
    agregar(producto, medida);
  }

  return (
    <article className="group flex flex-col border border-steel-line/70 bg-steel-panel transition hover:border-brass/60">
      <div className="aspect-[4/3] w-full border-b border-steel-line/70">
        {producto.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
        ) : (
          <MarcadorFilo etiqueta={producto.nombre} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brass">{producto.linea}</span>
        <h3 className="mt-2 font-display text-xl uppercase tracking-wide text-bone">{producto.nombre}</h3>
        <p className="mt-1 text-xs text-bone-dim">{producto.medida} · {producto.material}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-bone-dim/90">{producto.descripcion}</p>
        <p className="mt-3 text-[11px] italic leading-relaxed text-bone-dim/70">{producto.tiempoProduccion}</p>

        <div className="mt-4">
          <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">
            Medida
          </label>
          <select
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
            className="w-full border border-steel-line bg-steel-base px-3 py-2 text-sm text-bone focus:border-brass focus:outline-none"
          >
            <option value="">Selecciona una medida</option>
            {MEDIDAS_DISPONIBLES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {!medida && <p className="mt-1 text-[11px] text-bone-dim">Selecciona una medida para agregar.</p>}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {producto.precioAnterior && (
              <span className="text-xs text-bone-dim line-through">De {precioMXN(producto.precioAnterior)}</span>
            )}
            <span className="font-display text-lg text-bone">{precioMXN(producto.precio)}</span>
            <span className="text-[10px] uppercase tracking-wide text-bone-dim">/ docena (12 piezas)</span>
          </div>
          <button
            onClick={manejarAgregar}
            disabled={!medida}
            className="rounded-sm border border-brass px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass transition hover:bg-brass hover:text-steel-base disabled:cursor-not-allowed disabled:border-steel-line disabled:text-bone-dim disabled:hover:bg-transparent"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
