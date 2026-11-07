"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { buscarProducto, type Producto } from "@/lib/productos";

export type ItemCarrito = { producto: Producto; medida: string; cantidad: number };

type CarritoCtx = {
  items: ItemCarrito[];
  totalItems: number;
  totalCentavos: number;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  agregar: (p: Producto, medida: string) => void;
  quitar: (slug: string, medida: string) => void;
  cambiarCantidad: (slug: string, medida: string, cantidad: number) => void;
  vaciar: () => void;
};

const Ctx = createContext<CarritoCtx | null>(null);
const CLAVE = "njc_carrito_v2";

function esItemValido(i: unknown): i is ItemCarrito {
  return (
    typeof i === "object" &&
    i !== null &&
    "producto" in i &&
    "medida" in i &&
    "cantidad" in i &&
    typeof (i as ItemCarrito).medida === "string" &&
    (i as ItemCarrito).medida.length > 0
  );
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);

  // Cargar de localStorage al montar. Los renglones de un carrito viejo sin
  // medida (versión anterior) se descartan: la medida ahora es obligatoria.
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      // Se refresca el producto desde el catálogo para que el precio guardado
      // no quede viejo (ej. un carrito armado durante una promo ya terminada).
      if (guardado)
        setItems(
          (JSON.parse(guardado) as unknown[]).filter(esItemValido).flatMap((i) => {
            const actual = buscarProducto(i.producto.slug);
            return actual ? [{ ...i, producto: actual }] : [];
          })
        );
    } catch {}
  }, []);

  // Persistir en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Cada renglón del carrito se identifica por slug + medida: el mismo
  // modelo en dos medidas distintas son dos renglones separados.
  const agregar = useCallback((p: Producto, medida: string) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.producto.slug === p.slug && i.medida === medida);
      if (existe) {
        return prev.map((i) =>
          i.producto.slug === p.slug && i.medida === medida ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { producto: p, medida, cantidad: 1 }];
    });
    setAbierto(true);
  }, []);

  const quitar = useCallback((slug: string, medida: string) => {
    setItems((prev) => prev.filter((i) => !(i.producto.slug === slug && i.medida === medida)));
  }, []);

  const cambiarCantidad = useCallback((slug: string, medida: string, cantidad: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.producto.slug === slug && i.medida === medida ? { ...i, cantidad } : i))
        .filter((i) => i.cantidad > 0)
    );
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);
  const totalCentavos = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);

  return (
    <Ctx.Provider
      value={{ items, totalItems, totalCentavos, abierto, setAbierto, agregar, quitar, cambiarCantidad, vaciar }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
