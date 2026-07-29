import { productos } from "@/lib/productos";
import { ProductoCard } from "./ProductoCard";
import { NavajaDestacada } from "./NavajaDestacada";

export function Catalogo() {
  const destacadas = productos.filter((p) => p.patentado);
  const resto = productos.filter((p) => !p.patentado);

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-10 border border-brass/50 bg-steel-panel px-5 py-3 text-center text-sm text-brass">
        Venta exclusivamente por docena. Cada precio corresponde a 12 piezas.
      </div>

      {/* Pieza(s) destacada(s) */}
      {destacadas.map((p) => (
        <NavajaDestacada key={p.slug} producto={p} />
      ))}

      {/* Resto de la colección */}
      <div className="mb-10 mt-20 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brass">Catálogo</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
            La colección
          </h2>
        </div>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-bone-dim sm:block">
          {productos.length} modelos
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resto.map((p) => (
          <ProductoCard key={p.slug} producto={p} />
        ))}
      </div>
    </section>
  );
}
