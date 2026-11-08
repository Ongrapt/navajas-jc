import type { Metadata } from "next";
import Link from "next/link";
import { obtenerProductosVisibles } from "@/lib/productos";
import { precioMXN } from "@/lib/formato";

// Lista de links de pago directo por modelo (para copiarlos y mandarlos por
// WhatsApp). No se enlaza desde el menú ni la indexan los buscadores.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Links de pago | Navajas Javier Calleros",
  robots: { index: false, follow: false },
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navajasjaviercalleros.com.mx";

export default function LinksDePago() {
  const productos = obtenerProductosVisibles();
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-3xl uppercase text-bone">Links de pago</h1>
      <p className="mt-2 text-sm text-bone-dim">
        Copia el link del modelo y mándalo por WhatsApp. El cliente elige medida y docenas, pone su
        dirección y paga con Mercado Pago.
      </p>
      <ul className="mt-8 divide-y divide-steel-line/60 border border-steel-line/70 bg-steel-panel">
        {productos.map((p) => (
          <li key={p.slug} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-bone">
                {p.nombre} — {precioMXN(p.precio)}
                {p.precioAnterior && (
                  <span className="ml-2 text-xs text-bone-dim line-through">{precioMXN(p.precioAnterior)}</span>
                )}
              </p>
              <p className="select-all break-all text-xs text-brass">{`${SITE}/pagar/${p.slug}`}</p>
            </div>
            <Link href={`/pagar/${p.slug}`} className="text-[11px] uppercase tracking-[0.2em] text-bone-dim hover:text-bone">
              Abrir →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
