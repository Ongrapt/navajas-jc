import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { buscarProducto, MEDIDAS_DISPONIBLES } from "@/lib/productos";
import { cotizarEstafeta } from "@/lib/skydropx";

// Checkout Pro: creamos una "preferencia" en el servidor y devolvemos el
// init_point (la URL alojada de Mercado Pago). El cliente NUNCA ve datos de
// tarjeta: todo ocurre en el dominio seguro de Mercado Pago.

type ItemEntrada = { slug: string; cantidad: number; medida?: string };
type EnvioEntrada = {
  cp: string;
  estado: string;
  municipio: string;
  colonia: string;
  servicioCodigo: string;
};

export async function POST(req: NextRequest) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token || token.startsWith("APP_USR-xxxx")) {
    return NextResponse.json(
      { error: "Falta configurar MP_ACCESS_TOKEN en el archivo .env" },
      { status: 500 }
    );
  }

  let body: { items?: ItemEntrada[]; envio?: EnvioEntrada };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const entrada = body.items ?? [];
  if (entrada.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  // IMPORTANTE: los precios se toman del servidor (lib/productos.ts),
  // nunca del cliente. Así nadie puede alterar el importe desde el navegador.
  // La medida (líneas) no cambia el precio, pero es obligatoria y viaja en el
  // título del ítem para que se vea en el panel de Mercado Pago.
  const items = [];
  for (const it of entrada) {
    const p = buscarProducto(it.slug);
    if (!p) {
      return NextResponse.json({ error: `Producto no encontrado: ${it.slug}` }, { status: 400 });
    }
    if (!it.medida || !MEDIDAS_DISPONIBLES.includes(it.medida as (typeof MEDIDAS_DISPONIBLES)[number])) {
      return NextResponse.json(
        { error: `Falta elegir la medida para ${p.nombre}.` },
        { status: 400 }
      );
    }
    const cantidad = Math.max(1, Math.floor(Number(it.cantidad) || 1));
    items.push({
      id: p.slug,
      title: `${p.nombre} — ${p.linea} — ${it.medida}`,
      description: `Medida: ${it.medida}`,
      quantity: cantidad,
      unit_price: p.precio / 100, // centavos -> pesos
      currency_id: "MXN",
    });
  }

  // Envío (opcional): igual que con los productos, el precio NUNCA se toma
  // del navegador — se vuelve a cotizar con Skydropx en el servidor y se usa
  // el precio de la opción elegida solo si sigue existiendo.
  if (body.envio) {
    const { cp, estado, municipio, colonia, servicioCodigo } = body.envio;
    if (!cp || !estado || !municipio || !colonia || !servicioCodigo) {
      return NextResponse.json({ error: "Datos de envío incompletos." }, { status: 400 });
    }
    let cotizacion;
    try {
      cotizacion = await cotizarEstafeta({
        postal_code: cp,
        area_level1: estado,
        area_level2: municipio,
        area_level3: colonia,
      });
    } catch (e) {
      console.error("Error revalidando envío con Skydropx:", e);
      return NextResponse.json(
        { error: "No se pudo confirmar el costo de envío. Intenta de nuevo." },
        { status: 502 }
      );
    }
    const opcion = cotizacion.opciones.find((o) => o.codigo === servicioCodigo);
    if (!opcion) {
      return NextResponse.json(
        { error: "El costo de envío cambió o ya no está disponible. Vuelve a verificar tu código postal." },
        { status: 409 }
      );
    }
    items.push({
      id: `envio-${opcion.codigo}`,
      title: `Envío — Estafeta ${opcion.servicio}`,
      quantity: 1,
      unit_price: opcion.total,
      currency_id: "MXN",
    });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Mercado Pago exige https en back_urls.success para poder usar auto_return.
  // En desarrollo local (http://localhost) lo omitimos para no romper la preferencia.
  const esHttps = site.startsWith("https://");

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${site}/gracias`,
          pending: `${site}/pago-pendiente`,
          failure: `${site}/pago-error`,
        },
        ...(esHttps ? { auto_return: "approved" as const } : {}),
        statement_descriptor: "NAVAJAS JC",
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (e) {
    console.error("Error creando preferencia MP:", e);
    return NextResponse.json(
      { error: "No se pudo conectar con Mercado Pago. Revisa tu token." },
      { status: 502 }
    );
  }
}
