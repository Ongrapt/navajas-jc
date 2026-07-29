import { Filo } from "./Filo";

export function Herencia() {
  return (
    <section id="herencia" className="border-y border-steel-line/60 bg-steel-panel/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brass">Desde 1955</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-tight text-bone sm:text-4xl">
            Tres generaciones<br />de oficio
          </h2>
          <Filo className="mt-6 max-w-[200px]" />
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-bone-dim">
          <p>
            Lo que empezó en 1955 como un taller familiar es hoy una casa que
            fusiona el saber artesanal con la metalurgia más avanzada. Tres
            generaciones perfeccionando el forjado a mano y entendiendo el
            comportamiento íntimo del acero.
          </p>
          <p>
            Cada navaja se forja pieza por pieza en acero M35, con matriz de
            cobalto al 5% que resiste el calor de la fricción, y un
            tratamiento térmico digital que sitúa cada filo en el punto exacto
            de dureza: 64 a 66 HRC. Ni tan blando que se doble, ni tan frágil
            que se quiebre. El balance perfecto entre dureza y resistencia.
          </p>
          <p>No vendemos misterio. Vendemos precisión que se hereda.</p>
        </div>
      </div>
    </section>
  );
}
