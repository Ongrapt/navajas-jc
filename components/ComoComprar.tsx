const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;

export function ComoComprar() {
  return (
    <section id="como-comprar" className="mx-auto max-w-6xl px-5 py-20">
      <img
        src="/fotos/como-comprar.png"
        alt="Cómo comprar: 1) Elige tu navaja, 2) Completa tus datos y paga seguro con Mercado Pago, 3) Recibe tu pieza. Envío gratis por Estafeta; si no hay cobertura en tu zona, coordinamos por WhatsApp."
        className="w-full h-auto border border-steel-line/60"
      />
      <div className="mt-5 flex justify-center">
        {WHATSAPP ? (
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              "Hola, tengo una duda sobre el envío de mi pedido."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:opacity-90"
          >
            Coordinar envío por WhatsApp
          </a>
        ) : (
          <p className="text-xs text-bone-dim">
            (Falta configurar NEXT_PUBLIC_WHATSAPP en .env para mostrar el botón de WhatsApp.)
          </p>
        )}
      </div>
    </section>
  );
}
