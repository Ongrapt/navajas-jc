import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Webhook de Mercado Pago (notification_url de la preferencia).
//
// Mercado Pago llama aquí cada vez que un pago cambia de estado. Nunca se
// confía en lo que dice la notificación: se usa solo el id para CONSULTAR el
// pago directo a la API de Mercado Pago y leer su estado real.
//
// Firma (recomendado): en el panel de Mercado Pago → Tu aplicación →
// Webhooks, copia la "clave secreta" y ponla en MP_WEBHOOK_SECRET. Con ella
// se rechazan notificaciones que no vengan de Mercado Pago.

export const dynamic = "force-dynamic";

function firmaValida(req: NextRequest, dataId: string, secreto: string): boolean {
  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";
  const partes = Object.fromEntries(
    xSignature.split(",").map((p) => p.trim().split("=", 2) as [string, string])
  );
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;

  // Plantilla oficial: id:[data.id];request-id:[x-request-id];ts:[ts];
  // (data.id en minúsculas si es alfanumérico; se omite cada parte que no venga)
  let manifiesto = "";
  if (dataId) manifiesto += `id:${dataId.toLowerCase()};`;
  if (xRequestId) manifiesto += `request-id:${xRequestId};`;
  manifiesto += `ts:${ts};`;

  const esperado = createHmac("sha256", secreto).update(manifiesto).digest("hex");
  const a = Buffer.from(esperado);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await req.json();
  } catch {
    // Algunas notificaciones (formato IPN viejo) llegan sin cuerpo, solo con query.
  }

  const tipo = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic") ?? "";
  const dataId = String(body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");

  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (secreto && !firmaValida(req, url.searchParams.get("data.id") ?? dataId, secreto)) {
    console.warn("[webhook MP] Firma inválida, notificación rechazada.", { tipo, dataId });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Solo nos interesan los pagos; el resto se confirma con 200 para que
  // Mercado Pago no lo reintente.
  if (tipo !== "payment" || !dataId) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    console.error("[webhook MP] Falta MP_ACCESS_TOKEN.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const pago = await new Payment(new MercadoPagoConfig({ accessToken: token })).get({ id: dataId });

    // Registro del pago (se ve en los logs de Vercel → Functions).
    // Aquí es donde, en el futuro, se guardaría el pedido o se mandaría un aviso.
    console.log("[webhook MP] Pago", {
      pedido: pago.external_reference,
      payment_id: pago.id,
      estado: pago.status, // approved | pending | in_process | rejected | cancelled | refunded | charged_back
      detalle: pago.status_detail,
      monto: pago.transaction_amount,
      comprador: pago.payer?.email,
      items: pago.additional_info?.items?.map((i) => `${i.quantity} × ${i.title}`),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    // Error al consultar: se responde 500 para que Mercado Pago lo reintente.
    console.error("[webhook MP] No se pudo consultar el pago", dataId, e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
