import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Catalogo } from "@/components/Catalogo";
import { Herencia } from "@/components/Herencia";
import { ComoComprar } from "@/components/ComoComprar";
import { VentaMayoreo } from "@/components/VentaMayoreo";
import { EnviosInternacionales } from "@/components/EnviosInternacionales";
import { Footer } from "@/components/Footer";
import { CarritoDrawer } from "@/components/CarritoDrawer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
