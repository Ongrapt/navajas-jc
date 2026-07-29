import datosCP from "./data/codigos-postales.json";

export type EntradaCP = {
  estado: string;
  municipio: string;
  colonias: string[];
};

const indice = datosCP as Record<string, EntradaCP>;

// Catálogo oficial SEPOMEX (offline, sin depender de ningún servicio externo).
export function buscarCP(cp: string): EntradaCP | null {
  return indice[cp] ?? null;
}
