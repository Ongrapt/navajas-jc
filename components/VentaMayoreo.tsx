const WHATSAPP_MAYOREO = process.env.NEXT_PUBLIC_WHATSAPP_MAYOREO;

const MENSAJE = encodeURIComponent(
  "Hola, me interesa el mayoreo del modelo M35 (3 docenas o más). ¿Me pasan precio y condiciones?"
);

export function VentaMayoreo() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="border border-steel-line/70 bg-steel-panel p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.4em] text-brass">Distribuidores</p>
        <h2 className="mt-2 font-display text-2xl uppercase text-bone sm:text-3xl">Venta por mayoreo</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone-dim">
          ¿Eres distribuidor o compras por volumen? Tenemos precios especiales para pedidos grandes.
          Modelo M35 — desde 3 docenas · 20% de descuento. Envío gratis por Estafeta (a domicilio o a
          ocurre) en zonas con cobertura, previa verificación. Cada pedido se cotiza y coordina de
          forma personalizada.
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
