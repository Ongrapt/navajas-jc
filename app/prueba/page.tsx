import type { Metadata } from "next";
import Link from "next/link";
import { buscarProducto } from "@/lib/productos";
import { ProductoCard } from "@/components/ProductoCard";

// Página privada, no enlazada desde ningún menú ni catálogo público.
// Sirve para probar el flujo completo de compra (carrito, checkout,
// dirección y pago real con Mercado Pago) sin usar navajas reales.
export const metadata: Metadata = {
  title: "Producto de prueba",
  robots: { index: false, follow: false },
};

export default function PruebaPage() {
  const producto = buscarProducto("prueba");

  if (!producto) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-sm text-bone-dim">No se encontró el producto de prueba.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-brass">Página privada</p>
      <h1 className="mt-2 font-display text-2xl uppercase text-bone">Producto de prueba</h1>
      <p className="mt-2 text-sm text-bone-dim">
        Úsalo para verificar el flujo completo de compra (carrito, checkout con formulario de
        dirección y pago con Mercado Pago) sin gastar de más. No aparece en el catálogo público.
      </p>

      <div className="mt-8 max-w-sm">
        <ProductoCard producto={producto} />
      </div>

      <p className="mt-6 text-xs text-bone-dim">
        Esta página no tiene el panel de carrito (solo vive en la página de inicio). Después de
        agregar el producto, ve directo al checkout:
      </p>
      <Link
        href="/checkout"
        className="mt-3 inline-block rounded-sm border border-brass px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass transition hover:bg-brass hover:text-steel-base"
      >
        Ir al checkout →
      </Link>
    </main>
  );
}
