// Script de prueba independiente — NO toca el checkout ni Mercado Pago.
// Solo autentica con Skydropx PRO y cotiza un envío a un código postal,
// para ver qué responde la API antes de conectarlo al sitio.
//
// Uso:
//   node scripts/test-skydropx.mjs <codigoPostalDestino>
//   node scripts/test-skydropx.mjs 44100

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

function leerEnv(ruta) {
  const env = {};
  const texto = readFileSync(ruta, "utf8");
  for (const linea of texto.split("\n")) {
    const l = linea.trim();
    if (!l || l.startsWith("#")) continue;
    const idx = l.indexOf("=");
    if (idx === -1) continue;
    env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
  }
  return env;
}

const env = leerEnv(envPath);
const CLIENT_ID = env.SKYDROPX_CLIENT_ID;
const CLIENT_SECRET = env.SKYDROPX_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Faltan SKYDROPX_CLIENT_ID / SKYDROPX_CLIENT_SECRET en el archivo .env");
  process.exit(1);
}

const BASE = "https://pro.skydropx.com/api/v1";

// Dirección de origen fija: taller en Iztapalapa, CDMX.
const ORIGEN = {
  country_code: "MX",
  postal_code: "09060",
  area_level1: "Ciudad de México",
  area_level2: "Iztapalapa",
  area_level3: "Sector Popular",
};

// Paquete estándar de las navajas: 16 x 6 x 11 cm, 0.5 kg.
const PAQUETE = { weight: 0.5, length: 16, width: 6, height: 11 };

async function obtenerToken() {
  const res = await fetch(`${BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`No se pudo autenticar (HTTP ${res.status}): ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function crearCotizacion(token, cpDestino) {
  const res = await fetch(`${BASE}/quotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quotation: {
        address_from: ORIGEN,
        address_to: { country_code: "MX", postal_code: cpDestino },
        parcels: [PAQUETE],
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando cotización (HTTP ${res.status}): ${JSON.stringify(data, null, 2)}`);
  }
  return data;
}

async function consultarCotizacion(token, id) {
  const res = await fetch(`${BASE}/quotations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error consultando cotización (HTTP ${res.status}): ${JSON.stringify(data, null, 2)}`);
  }
  return data;
}

// Estafeta "cubre" el CP solo si alguna de sus tarifas vino con success: true.
// (Puede aparecer en la lista con success: false, p. ej. un servicio de
// carga que no aplica por peso — eso NO cuenta como cobertura real.)
function tarifasEstafeta(cot) {
  return (cot.rates || []).filter((r) => r.provider_name === "estafeta" && r.success === true);
}

async function main() {
  const cpDestino = process.argv[2];
  if (!cpDestino) {
    console.error("Uso: node scripts/test-skydropx.mjs <codigoPostalDestino>");
    process.exit(1);
  }

  console.log(`\n1) Autenticando con Skydropx PRO...`);
  const token = await obtenerToken();
  console.log("   OK, token obtenido.");

  console.log(`\n2) Creando cotización de ${ORIGEN.postal_code} (Iztapalapa) a ${cpDestino}...`);
  let cot = await crearCotizacion(token, cpDestino);
  console.log(`   id: ${cot.id} — is_completed: ${cot.is_completed}`);

  console.log(`\n3) Consultando tarifas...`);
  let intentos = 0;
  while (!cot.is_completed && intentos < 10) {
    await new Promise((r) => setTimeout(r, 2000));
    cot = await consultarCotizacion(token, cot.id);
    intentos++;
    console.log(`   intento ${intentos} — is_completed: ${cot.is_completed}`);
  }

  console.log("\n──────── TODAS LAS TARIFAS ────────");
  console.log(JSON.stringify(cot.rates, null, 2));

  console.log("\n──────── RESULTADO ────────");
  const estafeta = tarifasEstafeta(cot);
  if (estafeta.length > 0) {
    console.log("✅ Estafeta SÍ cubre este CP. Opciones encontradas:");
    for (const r of estafeta) {
      console.log(`   - ${r.provider_service_name}: $${r.total} MXN, ${r.days} días`);
    }
  } else {
    console.log("❌ Estafeta NO cubre este CP (no hay tarifas con success: true).");
  }
}

main().catch((e) => {
  console.error("\nERROR:", e.message);
  process.exit(1);
});
