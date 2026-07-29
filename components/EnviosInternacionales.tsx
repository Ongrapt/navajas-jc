const WHATSAPP_MAYOREO = process.env.NEXT_PUBLIC_WHATSAPP_MAYOREO;

const MENSAJE = encodeURIComponent(
  "Hello, I'm interested in international shipping. Could you give me a quote?"
);

export function EnviosInternacionales() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="border border-steel-line/70 bg-steel-panel p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.4em] text-brass">Worldwide</p>
        <h2 className="mt-2 font-display text-xl uppercase text-bone sm:text-3xl">
          Envíos internacionales / International Shipping
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone-dim">
          Realizamos envíos a USA, Centro y Sudamérica, y Filipinas. Para cotizar tu envío
          internacional, contáctanos por WhatsApp.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone-dim/80">
          We ship to the USA, Central and South America, and the Philippines. For international
          shipping, contact us via WhatsApp.
        </p>
        {WHATSAPP_MAYOREO ? (
          <a
            href={`https://wa.me/${WHATSAPP_MAYOREO}?text=${MENSAJE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-sm bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:opacity-90"
          >
            Escribir por WhatsApp
          </a>
        ) : (
          <p className="mt-6 text-xs text-bone-dim">
            (Falta configurar NEXT_PUBLIC_WHATSAPP_MAYOREO en .env para mostrar el botón de WhatsApp.)
          </p>
        )}
      </div>
    </section>
  );
}
