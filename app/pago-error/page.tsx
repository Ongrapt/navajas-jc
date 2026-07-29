import Link from "next/link";

export default function Error() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-oxblood">Pago no completado</p>
      <h1 className="mt-4 font-display text-4xl uppercase text-bone">El pago no se realizó</h1>
      <p className="mt-4 text-sm text-bone-dim">
        No se completó la transacción. Puedes intentarlo de nuevo; tu carrito sigue guardado.
      </p>
      <Link href="/" className="mt-8 rounded-sm border border-brass px-6 py-3 text-xs uppercase tracking-[0.2em] text-brass hover:bg-brass hover:text-steel-base">
        Volver a la tienda
      </Link>
    </main>
  );
}
