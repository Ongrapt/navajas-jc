"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCarrito } from "@/components/CarritoProvider";
import { precioMXN, formatoDocenas } from "@/lib/formato";

type EntradaCP = { estado: string; municipio: string; colonias: string[] };
type OpcionEnvio = { codigo: string; servicio: string; total: number; dias: number | null };
type ResultadoCotizacion = { disponible: boolean; opciones: OpcionEnvio[] };

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;

export default function CheckoutPage() {
  const { items, totalCentavos } = useCarrito();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [calle, setCalle] = useState("");
  const [cp, setCp] = useState("");

  const [direccionCP, setDireccionCP] = useState<EntradaCP | null>(null);
  const [colonia, setColonia] = useState("");
  const [cpEstado, setCpEstado] = useState<"idle" | "buscando" | "ok" | "no-encontrado">("idle");

  const [cotizacionEnvio, setCotizacionEnvio] = useState<"idle" | "cargando" | "error" | ResultadoCotizacion>(
    "idle"
  );
  const [envioSeleccionado, setEnvioSeleccionado] = useState<OpcionEnvio | null>(null);

  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  // Buscar el CP en el catálogo local en cuanto el cliente termina de escribir 5 dígitos.
  useEffect(() => {
    setDireccionCP(null);
    setColonia("");
    setCotizacionEnvio("idle");
    setEnvioSeleccionado(null);
    if (!/^\d{5}$/.test(cp)) {
      setCpEstado("idle");
      return;
    }
    let cancelado = false;
    setCpEstado("buscando");
    fetch(`/api/codigo-postal?cp=${cp}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: EntradaCP) => {
        if (cancelado) return;
        setDireccionCP(data);
        setCpEstado("ok");
        if (data.colonias.length === 1) setColonia(data.colonias[0]);
      })
      .catch(() => {
        if (!cancelado) setCpEstado("no-encontrado");
      });
    return () => {
      cancelado = true;
    };
  }, [cp]);

  // En cuanto haya CP + colonia, cotizar las opciones reales de Estafeta con Skydropx.
  useEffect(() => {
    setEnvioSeleccionado(null);
    if (!direccionCP || !colonia) {
      setCotizacionEnvio("idle");
      return;
    }
    let cancelado = false;
    setCotizacionEnvio("cargando");
    fetch("/api/cobertura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cp,
        estado: direccionCP.estado,
        municipio: direccionCP.municipio,
        colonia,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ResultadoCotizacion) => {
        if (cancelado) return;
        setCotizacionEnvio(data);
        // Preseleccionamos la opción más barata para no obligar a pensar de más.
        if (data.disponible && data.opciones.length > 0) setEnvioSeleccionado(data.opciones[0]);
      })
      .catch(() => {
        if (!cancelado) setCotizacionEnvio("error");
      });
    return () => {
      cancelado = true;
    };
  }, [cp, colonia, direccionCP]);

  const hayOpcionesEnvio = typeof cotizacionEnvio === "object" && cotizacionEnvio.disponible;
  const sinCobertura = typeof cotizacionEnvio === "object" && !cotizacionEnvio.disponible;

  // Si hay opciones de envío disponibles, el cliente debe elegir una antes de pagar.
  const datosCompletos = Boolean(
    nombre.trim() &&
      telefono.trim() &&
      email.trim() &&
      calle.trim() &&
      direccionCP &&
      colonia &&
      (!hayOpcionesEnvio || envioSeleccionado)
  );

  const totalEnvioCentavos = envioSeleccionado ? Math.round(envioSeleccionado.total * 100) : 0;
  const totalConEnvioCentavos = totalCentavos + totalEnvioCentavos;

  async function pagar() {
    setPagando(true);
    setErrorPago(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.producto.slug,
            nombre: i.producto.nombre,
            precio: i.producto.precio,
            cantidad: i.cantidad,
            medida: i.medida,
          })),
          ...(direccionCP
            ? {
                comprador: {
                  nombre,
                  telefono,
                  email,
                  calle,
                  cp,
                  colonia,
                  estado: direccionCP.estado,
                  municipio: direccionCP.municipio,
                },
              }
            : {}),
          ...(envioSeleccionado && direccionCP
            ? {
                envio: {
                  cp,
                  estado: direccionCP.estado,
                  municipio: direccionCP.municipio,
                  colonia,
                  servicioCodigo: envioSeleccionado.codigo,
                },
              }
            : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }
      // Mismo flujo que ya funcionaba: redirige al checkout alojado de Mercado Pago.
      window.location.href = data.init_point;
    } catch (e) {
      setErrorPago(e instanceof Error ? e.message : "Error inesperado.");
      setPagando(false);
    }
  }

  const resumenPedido = items
    .map((i) => `${formatoDocenas(i.cantidad)} de ${i.producto.nombre} (${i.medida})`)
    .join(", ");
  const mensajeWhatsapp = encodeURIComponent(
    `Hola, quiero comprar en Navajas Javier Calleros.\n` +
      `Mi pedido: ${resumenPedido || "(carrito vacío)"}\n` +
      `Mi dirección: ${calle}, ${colonia}, ${direccionCP?.municipio ?? ""}, ${direccionCP?.estado ?? ""}, CP ${cp}.\n` +
      `Estafeta no cubre mi zona, ¿podemos coordinar el envío?`
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-bone">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-bone-dim">Elige una pieza del catálogo antes de pagar.</p>
        <Link
          href="/#catalogo"
          className="mt-8 inline-block rounded-sm bg-brass px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base hover:bg-brass-bright"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl uppercase text-bone">Finalizar compra</h1>

      {/* Resumen del pedido */}
      <section className="mt-8 border border-steel-line/70 bg-steel-panel p-5">
        <h2 className="text-xs uppercase tracking-[0.3em] text-brass">Tu pedido</h2>
        <ul className="mt-4 space-y-2">
          {items.map((i) => (
            <li key={`${i.producto.slug}-${i.medida}`} className="flex justify-between text-sm text-bone-dim">
              <span>
                {formatoDocenas(i.cantidad)} de {i.producto.nombre} — {i.medida}
              </span>
              <span>{precioMXN(i.producto.precio * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-steel-line/60 pt-4">
          <div className="flex justify-between text-sm text-bone-dim">
            <span>Subtotal</span>
            <span>{precioMXN(totalCentavos)}</span>
          </div>
          <div className="flex justify-between text-sm text-bone-dim">
            <span>Envío</span>
            <span>{envioSeleccionado ? precioMXN(totalEnvioCentavos) : "—"}</span>
          </div>
          <div className="flex justify-between text-bone">
            <span className="text-xs uppercase tracking-[0.2em] text-bone-dim">Total</span>
            <span className="font-display text-lg">{precioMXN(totalConEnvioCentavos)}</span>
          </div>
        </div>
      </section>

      {/* Datos del cliente */}
      <section className="mt-8 border border-steel-line/70 bg-steel-panel p-5">
        <h2 className="text-xs uppercase tracking-[0.3em] text-brass">Tus datos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre completo" value={nombre} onChange={setNombre} />
          <Campo label="Teléfono" value={telefono} onChange={setTelefono} />
          <Campo label="Correo" value={email} onChange={setEmail} type="email" className="sm:col-span-2" />
          <Campo label="Calle y número" value={calle} onChange={setCalle} className="sm:col-span-2" />
          <Campo
            label="Código postal"
            value={cp}
            onChange={(v) => setCp(v.replace(/\D/g, "").slice(0, 5))}
          />
          {direccionCP && direccionCP.colonias.length > 1 && (
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">
                Colonia
              </label>
              <select
                value={colonia}
                onChange={(e) => setColonia(e.target.value)}
                className="w-full border border-steel-line bg-steel-base px-3 py-2 text-sm text-bone focus:border-brass focus:outline-none"
              >
                <option value="">Elige tu colonia</option>
                {direccionCP.colonias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {cpEstado === "buscando" && (
          <p className="mt-3 text-xs text-bone-dim">Buscando código postal…</p>
        )}
        {cpEstado === "no-encontrado" && (
          <p className="mt-3 text-xs text-oxblood">
            No reconocemos ese código postal. Verifica que esté bien escrito.
          </p>
        )}
        {direccionCP && (
          <p className="mt-3 text-xs text-bone-dim">
            {direccionCP.municipio}, {direccionCP.estado}
          </p>
        )}
      </section>

      {/* Opciones de envío */}
      {colonia && (
        <section className="mt-8 border border-steel-line/70 bg-steel-panel p-5">
          <h2 className="text-xs uppercase tracking-[0.3em] text-brass">Envío</h2>

          {cotizacionEnvio === "cargando" && (
            <p className="mt-3 text-sm text-bone-dim">Cotizando envío con Estafeta…</p>
          )}

          {cotizacionEnvio === "error" && (
            <p className="mt-3 text-sm text-oxblood">
              No pudimos cotizar el envío ahora mismo. Puedes continuar y de todas formas
              coordinamos el envío contigo.
            </p>
          )}

          {hayOpcionesEnvio && typeof cotizacionEnvio === "object" && (
            <div className="mt-3 space-y-2">
              {cotizacionEnvio.opciones.map((o) => (
                <label
                  key={o.codigo}
                  className={`flex cursor-pointer items-center justify-between border px-4 py-3 text-sm transition ${
                    envioSeleccionado?.codigo === o.codigo
                      ? "border-brass bg-steel-base"
                      : "border-steel-line text-bone-dim hover:border-brass/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="envio"
                      checked={envioSeleccionado?.codigo === o.codigo}
                      onChange={() => setEnvioSeleccionado(o)}
                      className="accent-brass"
                    />
                    <span className="text-bone">
                      Estafeta {o.servicio}
                      {o.dias ? ` — ${o.dias} día${o.dias === 1 ? "" : "s"}` : ""}
                    </span>
                  </span>
                  <span className="font-display text-base text-bone">{precioMXN(Math.round(o.total * 100))}</span>
                </label>
              ))}
            </div>
          )}

          {sinCobertura && (
            <div className="mt-3">
              <p className="text-sm text-bone">
                No hay Estafeta en tu zona, coordinamos el envío contigo.
              </p>
              {WHATSAPP ? (
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${mensajeWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-sm bg-[#25D366] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:opacity-90"
                >
                  Escribir por WhatsApp
                </a>
              ) : (
                <p className="mt-3 text-xs text-bone-dim">
                  (Falta configurar NEXT_PUBLIC_WHATSAPP en .env para mostrar el botón de WhatsApp.)
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {errorPago && <p className="mt-6 text-sm text-oxblood">{errorPago}</p>}

      <button
        onClick={pagar}
        disabled={!datosCompletos || pagando}
        className="mt-8 w-full rounded-sm bg-brass py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:bg-brass-bright disabled:opacity-50"
      >
        {pagando ? "Redirigiendo…" : "Pagar con Mercado Pago"}
      </button>
      <p className="mt-3 text-center text-[10px] text-bone-dim">
        Pago protegido. Serás redirigido a Mercado Pago para completar la compra.
      </p>
    </main>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-bone-dim">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-steel-line bg-steel-base px-3 py-2 text-sm text-bone focus:border-brass focus:outline-none"
      />
    </div>
  );
}
