import { NextRequest, NextResponse } from "next/server";
import { cotizarEstafeta } from "@/lib/skydropx";

type Body = {
  cp?: string;
  estado?: string;
  municipio?: string;
  colonia?: string;
};

// Cotiza con Skydropx las opciones reales de envío por Estafeta (Terrestre,
// Servicio Express, etc.) para el CP/colonia del cliente. No hay "gratis":
// cada opción trae su precio real.
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const { cp, estado, municipio, colonia } = body;
  if (!cp || !estado || !municipio || !colonia) {
    return NextResponse.json(
      { error: "Faltan datos de dirección (CP, estado, municipio o colonia)." },
      { status: 400 }
    );
  }

  try {
    const resultado = await cotizarEstafeta({
      postal_code: cp,
      area_level1: estado,
      area_level2: municipio,
      area_level3: colonia,
    });
    return NextResponse.json(resultado);
  } catch (e) {
    console.error("Error cotizando envío Skydropx:", e);
    return NextResponse.json(
      { error: "No se pudo cotizar el envío en este momento." },
      { status: 502 }
    );
  }
}
