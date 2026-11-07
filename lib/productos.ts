// ─────────────────────────────────────────────────────────────
// CATÁLOGO — Navajas Javier Calleros (10 modelos)
//
// REVISA ANTES DE PUBLICAR:
//  • precio: en CENTAVOS.
//  • medida: los tamaños son de RELLENO. Pon las medidas reales.
//  • imagen: apuntan a /public/fotos/navaja-<slug>.jpg (los nombres reales
//    de tus archivos). Ajusta la línea "imagen" si renombras algo.
//  • patentado: true marca la Cobra como pieza destacada y aparte.
// ─────────────────────────────────────────────────────────────

export type Producto = {
  slug: string;
  nombre: string;
  linea: string;
  precio: number;       // en centavos MXN
  medida: string;
  material: string;
  descripcion: string;
  imagen?: string;
  patentado?: boolean;  // pieza destacada / exclusiva
  tiempoProduccion: string;
  oculto?: boolean;     // no aparece en el catálogo público, pero sí es comprable por su slug
  precioPromo?: number;    // en centavos; precio mientras la promoción está vigente
  precioAnterior?: number; // lo calcula precioVigente(); se muestra tachado (no llenar a mano)
};

const M35 = "Acero M35, forjado y afilado a mano";
const S705 = "Acero S705, forjado y afilado a mano";
const TIEMPO_PRODUCCION =
  "Fabricación artesanal por pedido. Tu navaja estará lista en 3 a 5 días hábiles antes del envío.";

// Medida (líneas) que el cliente elige al comprar — obligatoria, mismo precio
// para las 5 opciones. Se usa en el selector de cada modelo.
export const MEDIDAS_DISPONIBLES = ["1 línea", "2 líneas", "3 líneas", "4 líneas", "5 líneas"] as const;
export type MedidaSeleccionable = (typeof MEDIDAS_DISPONIBLES)[number];

export const productos: Producto[] = [
  {
    slug: "cobra",
    nombre: "Cobra",
    linea: "Modelo Patentado",
    precio: 300000,
    medida: "1 pulgada",
    material: S705,
    descripcion: "De curva pronunciada y ataque envolvente, golpea como el reptil que le da nombre. Forjada a mano en acero S705, templada para un filo agresivo y duradero.",
    imagen: "/fotos/navaja-cobra.jpg",
    patentado: true,
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "destripadora",
    nombre: "Destripadora",
    linea: "Línea Clásica",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "De filo profundo y agresivo, concebida para el desgarre certero. Forjada y templada a mano para sostener el corte pelea tras pelea.",
    imagen: "/fotos/navaja-destripadora.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "bayoneta",
    nombre: "Bayoneta",
    linea: "Línea Clásica",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "De perfil recto y firme, privilegia la entrada directa y la penetración certera. Forjada a mano y templada para conservar el filo.",
    imagen: "/fotos/navaja-bayoneta.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "cola-de-rata",
    nombre: "Cola de Rata",
    linea: "Línea Heritage",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "Afinada hacia la punta, concentra la fuerza en un extremo fino y penetrante. Acero trabajado a mano con temple controlado para máxima resistencia.",
    imagen: "/fotos/navaja-cola-de-rata.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "especial-jalon",
    nombre: "Especial Jalón",
    linea: "Línea Heritage",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "Diseñada para el corte de jalón: su perfil acompaña el movimiento natural del gallo para un tajo limpio y profundo. Forjada y afilada a mano, pieza por pieza.",
    imagen: "/fotos/navaja-especial-jalon.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "especial-calleros",
    nombre: "Especial Calleros",
    linea: "Línea Heritage",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "El modelo insignia: la síntesis de setenta años de oficio en una sola navaja. Balance y temple que han ganado peleas por generaciones.",
    imagen: "/fotos/navaja-especial-calleros.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "guadana",
    nombre: "Guadaña",
    linea: "Línea Maestra",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "Inspirada en la hoz: su curva amplia ejecuta un corte de barrido, largo y limpio. Acero trabajado a mano con temple preciso para un filo que perdura.",
    imagen: "/fotos/navaja-guadana.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "m35",
    nombre: "M35",
    linea: "Línea Maestra",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "Forjada en acero M35 de alta velocidad, reconocido por su dureza y retención de filo excepcionales. Tratamiento térmico de precisión y acabado a mano.",
    imagen: "/fotos/navaja-m35.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "media-luna",
    nombre: "Media Luna",
    linea: "Línea Maestra",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "De curva equilibrada, une alcance y control en un solo perfil. Forjada pieza por pieza y templada para mantener el filo.",
    imagen: "/fotos/navaja-media-luna.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "taconuda",
    nombre: "Taconuda",
    linea: "Línea Maestra",
    precio: 230000,
    precioPromo: 184000, // Buen Fin -20%
    medida: "1 pulgada con 1 hasta 5 líneas",
    material: M35,
    descripcion: "Su tacón reforzado le da cuerpo y equilibrio en la base, para un montaje firme y un golpe con respaldo. Hecha a mano con el cuidado de tres generaciones.",
    imagen: "/fotos/navaja-taconuda.jpg",
    tiempoProduccion: TIEMPO_PRODUCCION,
  },
  {
    slug: "prueba",
    nombre: "PRODUCTO DE PRUEBA - NO COMPRAR",
    linea: "Prueba interna",
    precio: 100, // $1.00 MXN — para probar el flujo completo sin gastar de más
    medida: "N/A (producto de prueba)",
    material: "N/A — no es una navaja real",
    descripcion:
      "Producto interno para verificar el flujo completo de compra (carrito, checkout, dirección y pago con Mercado Pago) sin usar navajas reales. No aparece en el catálogo público.",
    tiempoProduccion: "No aplica — producto de prueba.",
    oculto: true,
  },
];

// ─────────────────────────────────────────────────────────────
// PROMOCIÓN BUEN FIN — 20% de descuento ($2,300 → $1,840 la docena).
// Termina sola al final del 16 de noviembre de 2026, hora del centro de
// México (UTC-6). Después de esa fecha todos los productos regresan a su
// `precio` normal sin tocar nada. Para otra promo: cambia `precioPromo` en
// cada producto y la fecha de FIN_PROMO.
// ─────────────────────────────────────────────────────────────
export const FIN_PROMO = new Date("2026-11-17T00:00:00-06:00");

export function promoActiva(ahora: Date = new Date()): boolean {
  return ahora < FIN_PROMO;
}

// Devuelve el producto con el precio que aplica en este momento. Si la promo
// está vigente, `precio` pasa a ser el de promoción y `precioAnterior` el normal.
export function precioVigente(p: Producto, ahora: Date = new Date()): Producto {
  if (p.precioPromo !== undefined && promoActiva(ahora)) {
    return { ...p, precio: p.precioPromo, precioAnterior: p.precio };
  }
  return { ...p, precioAnterior: undefined };
}

// Lo que se muestra en el catálogo público: excluye productos ocultos
// (como el producto de prueba) aunque sí sigan siendo comprables por su slug.
export function obtenerProductosVisibles(ahora: Date = new Date()): Producto[] {
  return productos.filter((p) => !p.oculto).map((p) => precioVigente(p, ahora));
}

export function buscarProducto(slug: string, ahora: Date = new Date()): Producto | undefined {
  const p = productos.find((p) => p.slug === slug);
  return p ? precioVigente(p, ahora) : undefined;
}
