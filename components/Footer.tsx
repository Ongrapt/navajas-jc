const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;

function formatearWhatsapp(numero: string) {
  // Espera un número mexicano con lada de país: 52 + 10 dígitos.
  const sinLada = numero.startsWith("52") ? numero.slice(2) : numero;
  if (sinLada.length !== 10) return numero;
  return `${sinLada.slice(0, 2)} ${sinLada.slice(2, 6)} ${sinLada.slice(6)}`;
}

export function Footer() {
  return (
    <footer className="border-t border-steel-line/60">
      <div className="mx-auto max-w-6xl px-5 py-10 text-xs text-bone-dim">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display uppercase tracking-[0.18em] text-bone">Navajas Javier Calleros</p>
            <p className="mt-1">Est. 1955 · navajasjaviercalleros.com.mx</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p>
              Correo:{" "}
              <a href="mailto:navajascalleros@gmail.com" className="text-bone transition hover:text-brass">
                navajascalleros@gmail.com
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              {WHATSAPP ? (
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone transition hover:text-brass"
                >
                  {formatearWhatsapp(WHATSAPP)}
                </a>
              ) : (
                "(configura NEXT_PUBLIC_WHATSAPP)"
              )}
            </p>
            <p>Envíos a todo México · Pago seguro con Mercado Pago</p>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] text-bone-dim/50">
          Sitio desarrollado por Antoniozone
        </p>
      </div>
    </footer>
  );
}
