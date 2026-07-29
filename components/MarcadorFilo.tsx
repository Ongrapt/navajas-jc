export function MarcadorFilo({ etiqueta }: { etiqueta: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#101214] to-[#24282b]">
      <svg viewBox="0 0 200 60" className="w-3/4 opacity-70" aria-hidden>
        <defs>
          <linearGradient id="acero" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#454b4f" />
            <stop offset="0.5" stopColor="#C9CFD3" />
            <stop offset="1" stopColor="#5a6165" />
          </linearGradient>
        </defs>
        <path d="M8 34 L150 22 L188 30 L150 38 L8 30 Z" fill="url(#acero)" />
        <path d="M8 30 L150 22 L188 30 Z" fill="#EDEFF0" opacity="0.5" />
        <circle cx="20" cy="30" r="3" fill="#17191B" />
      </svg>
      <span className="pointer-events-none absolute bottom-2 left-3 font-display text-[10px] uppercase tracking-[0.25em] text-bone-dim/50">
        {etiqueta}
      </span>
    </div>
  );
}
