// Integración con Skydropx PRO (cotizaciones de envío).
// Solo se usa del lado del servidor: lee las credenciales de .env,
// nunca las expone al navegador.

const BASE = "https://pro.skydropx.com/api/v1";

// Dirección de origen: taller en Iztapalapa, CDMX (fija para todos los envíos).
const ORIGEN = {
  country_code: "MX",
  postal_code: "09060",
  area_level1: "Ciudad de México",
  area_level2: "Iztapalapa",
  area_level3: "Sector Popular",
};

// Paquete estándar de las navajas: 16 x 6 x 11 cm, 0.5 kg.
const PAQUETE = { weight: 0.5, length: 16, width: 6, height: 11 };

type DestinoCotizacion = {
  postal_code: string;
  area_level1: string;
  area_level2: string;
  area_level3: string;
};

type TarifaSkydropx = {
  provider_name: string;
  provider_service_name: string;
  provider_service_code: string;
  success: boolean;
  total: string | null;
  days: number | null;
};

type RespuestaCotizacion = {
  id: string;
  is_completed: boolean;
  rates: TarifaSkydropx[];
};

export type OpcionEnvio = {
  codigo: string; // provider_service_code — se usa para revalidar el precio en el servidor al pagar
  servicio: string;
  total: number;
  dias: number | null;
};

export type ResultadoCotizacion = {
  disponible: boolean;
  opciones: OpcionEnvio[];
};

let tokenCache: { token: string; expiraEn: number } | null = null;

async function obtenerToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiraEn) {
    return tokenCache.token;
  }

  const clientId = process.env.SKYDROPX_CLIENT_ID;
  const clientSecret = process.env.SKYDROPX_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Falta configurar SKYDROPX_CLIENT_ID / SKYDROPX_CLIENT_SECRET en el archivo .env");
  }

  const res = await fetch(`${BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error("No se pudo autenticar con Skydropx. Revisa SKYDROPX_CLIENT_ID / SKYDROPX_CLIENT_SECRET.");
  }

  tokenCache = {
    token: data.access_token,
    // Renovamos 60s antes de que expire de verdad, por seguridad.
    expiraEn: Date.now() + Math.max((data.expires_in ?? 3600) - 60, 60) * 1000,
  };
  return tokenCache.token;
}

async function crearCotizacion(token: string, destino: DestinoCotizacion): Promise<RespuestaCotizacion> {
  const res = await fetch(`${BASE}/quotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      quotation: {
        address_from: ORIGEN,
        address_to: { country_code: "MX", ...destino },
        parcels: [PAQUETE],
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Skydropx rechazó la cotización (HTTP ${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function consultarCotizacion(token: string, id: string): Promise<RespuestaCotizacion> {
  const res = await fetch(`${BASE}/quotations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`No se pudo consultar la cotización (HTTP ${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

// Cotiza con Skydropx las opciones reales de Estafeta para el destino dado
// (p. ej. Terrestre y Servicio Express, cada una con su precio real — no hay
// envío "gratis": el costo se cobra siempre). Una tarifa puede aparecer en la
// lista con success: false (p. ej. un servicio de carga que no aplica por
// peso) — esa no cuenta como opción disponible.
export async function cotizarEstafeta(destino: DestinoCotizacion): Promise<ResultadoCotizacion> {
  const token = await obtenerToken();
  let cot = await crearCotizacion(token, destino);

  let intentos = 0;
  while (!cot.is_completed && intentos < 10) {
    await new Promise((r) => setTimeout(r, 1500));
    cot = await consultarCotizacion(token, cot.id);
    intentos++;
  }

  const opciones = (cot.rates || [])
    .filter((r) => r.provider_name === "estafeta" && r.success === true && r.total != null)
    .map((r) => ({
      codigo: r.provider_service_code,
      servicio: r.provider_service_name,
      total: Number(r.total),
      dias: r.days ?? null,
    }))
    .sort((a, b) => a.total - b.total);

  return { disponible: opciones.length > 0, opciones };
}
