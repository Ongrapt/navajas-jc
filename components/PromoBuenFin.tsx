import { promoActiva } from "@/lib/productos";

// Banner de la promoción Buen Fin: flyer + video. Se oculta solo cuando
// termina la promo (misma fecha que los precios: FIN_PROMO en lib/productos.ts).
// Archivos:
//   public/fotos/promo-buen-fin.jpg          (flyer)
//   public/videos/promo-buen-fin.mp4         (video vertical 9:16)
//   public/videos/promo-buen-fin-poster.jpg  (cuadro que se ve antes de reproducir)
export function PromoBuenFin() {
  if (!promoActiva()) return null;

  return (
    <section id="promocion" className="border-b border-steel-line/60 px-5 py-14">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-8 md:grid-cols-2">
        <a href="#catalogo" className="mx-auto block w-full max-w-md transition hover:opacity-90">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fotos/promo-buen-fin.jpg"
            alt="El Buen Fin: 20% de descuento. Precio de medio mayoreo desde 1 docena: de $2,300 a $1,840 MXN la docena, más gastos de envío."
            width={1080}
            height={1092}
            className="h-auto w-full rounded-sm border border-brass/50"
          />
        </a>

        <video
          src="/videos/promo-buen-fin.mp4"
          poster="/videos/promo-buen-fin-poster.jpg"
          width={720}
          height={1280}
          controls
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-label="Video de la promoción Buen Fin: M35 Especial Calleros con 20% de descuento"
          className="mx-auto aspect-[9/16] max-h-[80vh] w-full max-w-xs rounded-sm border border-brass/50 bg-black object-contain"
        />
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-bone-dim">
        Válida hasta el 16 de noviembre de 2026
      </p>
    </section>
  );
}
