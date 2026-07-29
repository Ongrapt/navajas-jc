"use client";

import { useState } from "react";
import { MEDIDAS_DISPONIBLES, type Producto } from "@/lib/productos";
import { precioMXN } from "@/lib/formato";
import { useCarrito } from "./CarritoProvider";
import { MarcadorFilo } from "./MarcadorFilo";

export function NavajaDestacada({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  const [medida, setMedida] = useState("");

  function manejarAgregar() {
    if (!medida) return;
    agregar(producto, medida);
  }

  return (
    <article className="overflow-hidden border border-brass/40 bg-steel-panel">
      <div className="grid md:grid-cols-2">
        <div className="aspect-square md:aspect-auto md:min-h-[420px]">
          {producto.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
          ) : (
            <MarcadorFilo etiqueta={producto.nombre} />
          )}
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-brass px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-brass">
            ◆ Modelo Patentado
          </span>
          <h3 className="mt-5 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
            {producto.nombre}
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brass">{producto.material}</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-dim">{producto.descripcion}</p>
          <p className="mt-3 text-xs text-bone-dim">Medida: {producto.medida}</p>
          <p className="mt-2 text-xs italic text-bone-dim/80">{producto.tiempoProduccion}</p>

          <div className="mt-6 max-w-xs">
            <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">
              Medida (líneas)
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

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex flex-col">
              <span className="font-display text-2xl text-bone">{precioMXN(producto.precio)}</span>
              <span className="text-[10px] uppercase tracking-wide text-bone-dim">/ docena (12 piezas)</span>
            </div>
            <button
              onClick={manejarAgregar}
              disabled={!medida}
              className="rounded-sm bg-brass px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:bg-brass-bright disabled:cursor-not-allowed disabled:bg-steel-line disabled:text-bone-dim"
            >
              Agregar al carrito
            </button>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-bone-dim/70">
            Diseño exclusivo y patentado de la casa Javier Calleros.
          </p>
        </div>
      </div>
    </article>
  );
}
