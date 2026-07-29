import { Filo } from "./Filo";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[70vh] overflow-hidden border-b border-steel-line/60">
      {/* Fondo: imagen de la fragua.
          Coloca la imagen en:  public/fotos/forja.jpg  */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fotos/forja.jpg"
          alt=""
          className="h-full w-full object-cover object-right-bottom"
        />
        {/* Capa oscura degradada para que el texto se lea bien */}
        <div className="absolute inset-0 bg-gradient-to-r from-steel-base/90 via-steel-base/50 to-transparent" />
      </div>

      {/* Contenido (tu texto, sin cambios) */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-24">
        <p className="mb-6 text-xs uppercase tracking-[0.45em] text-brass">
          Fundada en 1955 · Tradición familiar
        </p>
        <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] text-bone sm:text-7xl">
          El filo que<br />define la casta
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-bone/90">
          Navajas artesanales forjadas pieza por pieza, con más de seis décadas de
          oficio. Precisión, temple y un acabado que se hereda.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#catalogo"
            className="rounded-sm bg-brass px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:bg-brass-bright"
          >
            Ver catálogo
          </a>
          <a
            href="#herencia"
            className="text-xs uppercase tracking-[0.2em] text-bone-dim transition hover:text-bone"
          >
            Nuestra historia →
          </a>
        </div>
        <Filo className="mt-16 max-w-md" />
      </div>
    </section>
  );
}
