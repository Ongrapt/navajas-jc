"use client";

import Link from "next/link";
import { useCarrito } from "@/components/CarritoProvider";
import { FormularioPago } from "@/components/FormularioPago";

export default function CheckoutPage() {
  const { items, totalCentavos } = useCarrito();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-bone">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-bone-dim">Elige una pieza del catálogo antes de pagar.</p>
        <Link
          href="/#catalogo"
          className="mt-8 inline-block rounded-sm bg-brass px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base hover:bg-brass-bright"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  return <FormularioPago items={items} totalCentavos={totalCentavos} />;
}
