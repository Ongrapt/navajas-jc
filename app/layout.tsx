import type { Metadata } from "next";
import "./globals.css";
import { CarritoProvider } from "@/components/CarritoProvider";
import { BotonWhatsappFlotante } from "@/components/BotonWhatsappFlotante";

export const metadata: Metadata = {
  title: "Navajas Javier Calleros — Navajas artesanales desde 1955",
  description:
    "Navajas artesanales para gallos, forjadas a mano. Tradición familiar desde 1955. Tienda en línea con pago seguro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <CarritoProvider>
          {children}
          <BotonWhatsappFlotante />
        </CarritoProvider>
      </body>
    </html>
  );
}
