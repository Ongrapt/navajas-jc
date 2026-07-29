export function precioMXN(centavos: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(centavos / 100);
}

// La venta es siempre por docena (12 piezas): cada "cantidad" del carrito es
// una cantidad de docenas, no de piezas sueltas.
export function formatoDocenas(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "docena" : "docenas"}`;
}
