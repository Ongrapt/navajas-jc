import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarProducto } from "@/lib/productos";
import { precioMXN } from "@/lib/formato";
import { PagoDirecto } from "@/components/PagoDirecto";

// Link de pago directo por modelo, para mandar por WhatsApp:
//   https://www.navajasjaviercalleros.com.mx/pagar/m35
// El precio se calcula en cada visita (respeta la promo y su fecha de fin).
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navajasjaviercalleros.com.mx";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = buscarProducto(params.slug);
  if (!p) return { title: "Producto no encontrado" };

  // Vista previa al pegar el link en WhatsApp / Facebook.
  const titulo = `${p.nombre} — ${precioMXN(p.precio)} la docena`;
  const descripcion = p.precioAnterior
    ? `Antes ${precioMXN(p.precioAnterior)}. ${p.material}. Paga seguro con Mercado Pago.`
    : `${p.material}. Paga seguro con Mercado Pago.`;
  return {
    title: `${titulo} | Navajas Javier Calleros`,
    description: descripcion,
    robots: { index: false, follow: false },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `${SITE}/pagar/${p.slug}`,
      siteName: "Navajas Javier Calleros",
      locale: "es_MX",
      type: "website",
      ...(p.imagen ? { images: [{ url: `${SITE}${p.imagen}`, alt: p.nombre }] } : {}),
    },
  };
}

export default function PagarPage({ params }: { params: { slug: string } }) {
  const producto = buscarProducto(params.slug);
  if (!producto) notFound();
  return <PagoDirecto producto={producto} />;
}
