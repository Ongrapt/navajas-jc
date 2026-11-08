import { promoActiva } from "@/lib/productos";

// Banner de la promoción Buen Fin: video. Se oculta solo cuando
// termina la promo (misma fecha que los precios: FIN_PROMO en lib/productos.ts).
// Archivos:
//   public/videos/promo-buen-fin.mp4         (video vertical 9:16)
//   public/videos/promo-buen-fin-poster.jpg  (cuadro que se ve antes de reproducir)
export function PromoBuenFin() {
  if (!promoActiva()) return null;

  return (
    <section id="promocion" className="border-b border-steel-line/60 px-5 py-14">
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
        aria-label="Video de la promoción Buen Fin: 20% de descuento, de $2,300 a $1,840 MXN la docena"
        className="mx-auto block aspect-[9/16] max-h-[80vh] w-full max-w-sm rounded-sm border border-brass/50 bg-black object-contain"
      />

      <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-bone-dim">
        Válida hasta el 16 de noviembre de 2026
      </p>
    </section>
  );
}
