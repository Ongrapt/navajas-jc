import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromoBuenFin } from "@/components/PromoBuenFin";
import { Catalogo } from "@/components/Catalogo";
import { Herencia } from "@/components/Herencia";
import { ComoComprar } from "@/components/ComoComprar";
import { VentaMayoreo } from "@/components/VentaMayoreo";
import { EnviosInternacionales } from "@/components/EnviosInternacionales";
import { Footer } from "@/components/Footer";
import { CarritoDrawer } from "@/components/CarritoDrawer";

// La página se regenera cada minuto para que los precios de promoción
// (lib/productos.ts → FIN_PROMO) cambien solos al terminar la promo.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PromoBuenFin />
        <Catalogo />
        <Herencia />
        <ComoComprar />
        <VentaMayoreo />
        <EnviosInternacionales />
      </main>
      <Footer />
      <CarritoDrawer />
    </>
  );
}
