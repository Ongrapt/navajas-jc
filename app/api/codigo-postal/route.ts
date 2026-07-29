import { NextRequest, NextResponse } from "next/server";
import { buscarCP } from "@/lib/codigoPostal";

// Resuelve un código postal contra el catálogo local (SEPOMEX) para obtener
// estado, municipio y las colonias posibles — datos que Skydropx exige
// además del CP para poder cotizar.
export async function GET(req: NextRequest) {
  const cp = req.nextUrl.searchParams.get("cp")?.trim() ?? "";

  if (!/^\d{5}$/.test(cp)) {
    return NextResponse.json({ error: "Código postal inválido." }, { status: 400 });
  }

  const entrada = buscarCP(cp);
  if (!entrada) {
    return NextResponse.json({ error: "No encontramos ese código postal." }, { status: 404 });
  }

  return NextResponse.json(entrada);
}
