---
name: taste
description: Criterio visual y de tono de la tienda Navajas Javier Calleros (Next.js + Tailwind). Úsala SIEMPRE antes de crear o modificar cualquier componente, página, sección, banner, promo, formulario, correo o texto visible de la tienda, y cuando pidan "que se vea mejor", "más profesional", "rediseño", "revisa el diseño" o una nueva sección/landing. También sirve para revisar un cambio y decir si respeta el estilo de la casa.
---

# Taste — Navajas Javier Calleros

La tienda debe sentirse como **un taller de forja con 70 años de oficio**:
acero oscuro, latón, poca decoración, letra condensada y seria. Es una casa
artesanal que vende precisión, no una tienda de ofertas. Cada decisión se
mide contra esta frase: **"No vendemos misterio. Vendemos precisión que se
hereda."**

Si algo se ve "bonito" pero podría estar en cualquier e-commerce genérico,
está mal. Si se ve sobrio, firme y preciso, está bien.

---

## 1. Paleta (solo estos tokens)

Definidos en `tailwind.config.ts`. **No uses colores de Tailwind por defecto**
(`gray-*`, `zinc-*`, `blue-*`, `green-*`, `white`…) ni hex sueltos en clases.

| Token | Hex | Uso |
|---|---|---|
| `steel-base` | #17191B | Fondo de página, texto sobre botón latón |
| `steel-panel` | #202325 | Tarjetas, paneles, secciones alternas (`/40` para franjas) |
| `steel-line` | #333739 | Bordes y divisores (`/60`–`/70` para más suaves) |
| `bone` | #ECE7DD | Títulos y texto principal |
| `bone-dim` | #9AA0A2 | Texto secundario, etiquetas, ayudas |
| `brass` | #C39A4E | Acento único: eyebrows, CTA principal, hover, foco |
| `brass-bright` | #D8B871 | Solo hover del botón latón relleno |
| `oxblood` | #7E2A22 | Acciones destructivas (Quitar) y errores |

Reglas:
- **El latón es escaso.** Por pantalla: un CTA relleno, eyebrows y detalles.
  Nunca fondos grandes de latón ni párrafos en latón.
- **Errores en oxblood**, no en `red-400`. Si el contraste no alcanza sobre
  fondo oscuro, usa `text-[#C9574B]` (oxblood aclarado) y agrégalo al config
  como `oxblood.bright` en lugar de repetir el hex.
- **Éxito / confirmación**: bone o latón con un ícono/texto claro. No verdes
  chillones; Mercado Pago ya trae su propia marca.
- Sin degradados de colores. Solo se permiten degradados de oscuridad
  (`from-steel-base/90 … to-transparent`) para leer texto sobre foto, y el
  filo latón de `<Filo />`.
- Sitio solo en modo oscuro (`color-scheme: dark`). No agregues modo claro.

## 2. Tipografía

- **Display — Anton** (`font-display`): siempre `uppercase`. Títulos,
  nombres de producto, precios, totales, nombre de la marca.
- **Texto — Inter** (`font-sans`): todo lo demás, en caja normal.
- Nunca Anton en párrafos ni Inter en mayúsculas grandes como título.

Escala (respétala, no inventes tamaños intermedios):

| Rol | Clases |
|---|---|
| Hero h1 | `font-display text-5xl sm:text-7xl uppercase leading-[0.95]` |
| Título de sección h2 | `font-display text-3xl sm:text-4xl uppercase` |
| Nombre de producto | `font-display text-xl uppercase tracking-wide` |
| Precio | `font-display text-lg` (tarjeta) / `text-xl` (total) |
| Eyebrow (sobre el título) | `text-xs uppercase tracking-[0.4em] text-brass` |
| Párrafo | `text-sm` o `text-base leading-relaxed text-bone-dim` (bone/90 en hero) |
| Etiqueta / botón | `text-[11px]` o `text-xs uppercase tracking-[0.2em]` |
| Microtexto | `text-[10px]` — solo para notas legales o "/ docena"; nunca info clave |

Tracking: usa solo **0.15em, 0.2em, 0.3em, 0.4em**. Etiquetas y botones
0.2em; eyebrows 0.4em. No mezcles 0.18/0.25/0.45 en código nuevo.

Patrón de encabezado de sección (úsalo siempre igual):

```tsx
<p className="text-xs uppercase tracking-[0.4em] text-brass">Desde 1955</p>
<h2 className="mt-3 font-display text-3xl uppercase leading-tight text-bone sm:text-4xl">
  Tres generaciones<br />de oficio
</h2>
<Filo className="mt-6 max-w-[200px]" />
```

## 3. Forma y espacio

- **Esquinas casi rectas**: `rounded-sm` en botones, inputs, video y
  avisos. Tarjetas sin redondeo. `rounded-full` solo para el contador del
  carrito y el botón flotante de WhatsApp. Nada de `rounded-xl/2xl`.
- **Bordes, no sombras.** Se separa con `border-steel-line`; el hover sube
  el borde a `border-brass/60`. No uses `shadow-*`, ni glow, ni glassmorphism
  (el único `backdrop-blur` es el header).
- Contenedor: `mx-auto max-w-6xl px-5`. Secciones `py-20`; promos y bloques
  cortos `py-14`. Header y footer ya están resueltos.
- Rejilla de productos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`.
- Diseña primero para celular (la mayoría compra desde WhatsApp/Facebook en
  el teléfono): botones de al menos 40px de alto, nada de scroll horizontal,
  textos clave de 12px o más.
- Separadores: `<Filo />` (línea latón con rombo) o un `border-t` sutil. No
  uses `<hr>` grueso, íconos decorativos ni ilustraciones.

## 4. Componentes

**Botón principal** (uno por vista):
`rounded-sm bg-brass px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-steel-base transition hover:bg-brass-bright`

**Botón secundario**:
`rounded-sm border border-brass px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass transition hover:bg-brass hover:text-steel-base`

**Botón fantasma / link**:
`text-xs uppercase tracking-[0.2em] text-bone-dim transition hover:text-bone` (con `→` si lleva a otra sección).

**Input / select**:
`w-full rounded-sm border border-steel-line bg-steel-base px-3 py-2 text-sm text-bone focus:border-brass focus:outline-none` con `<label>` arriba en `text-[11px] uppercase tracking-[0.15em] text-bone-dim`. Error: borde oxblood + mensaje debajo con `role="alert"`.

**Tarjeta**: `border border-steel-line/70 bg-steel-panel transition hover:border-brass/60`, imagen `aspect-[4/3]`, contenido `p-5`.

**Aviso informativo**: `border border-brass/50 bg-steel-panel px-5 py-3 text-sm text-brass` (como "Venta exclusivamente por docena").

Antes de crear un componente nuevo, revisa `components/`: casi siempre ya
existe el patrón (`Filo`, `MarcadorFilo`, `ProductoCard`, `NavajaDestacada`).

## 5. Fotos y video

- La foto del producto es la protagonista: fondo oscuro, luz lateral que
  saque el brillo del acero, la navaja completa y nítida. Sin fondos blancos
  de catálogo, sin montajes con fuego/rayos, sin marcas de agua grandes.
- Mismo encuadre y proporción (4:3) en todo el catálogo. Si falta foto, usa
  `<MarcadorFilo />`, nunca una imagen de stock.
- Fotos de fondo siempre con capa `bg-gradient-to-r from-steel-base/90 via-steel-base/50 to-transparent`
  para que el texto se lea.
- Video de promo: vertical 9:16, `muted playsInline`, con `poster`, marco
  `border-brass/50 rounded-sm`, centrado y con `max-w-sm`.
- `alt` descriptivo en todas las fotos de producto (nombre + medida si aplica).

## 6. Movimiento

Mínimo y funcional: `transition` en colores/bordes, el drawer del carrito
desliza (`duration-300`). Nada de animaciones de entrada al hacer scroll,
parallax, contadores animados ni carruseles automáticos. Respeta
`prefers-reduced-motion` (ya está en `globals.css`).

## 7. Voz y textos

Español de México, de usted a tú cercano pero sobrio ("Elige una pieza del
catálogo", "Selecciona una medida para continuar").

- **Frases cortas y concretas.** Datos reales en vez de adjetivos: "acero M35,
  cobalto 5%, 64–66 HRC" vale más que "la mejor calidad del mercado".
- Palabras de la casa: *forjada a mano, temple, filo, oficio, pieza, casta,
  precisión, se hereda, desde 1955*.
- Prohibido: "¡¡OFERTA!!", "increíble", "el mejor", "no te lo pierdas",
  signos dobles, emojis en la interfaz, MAYÚSCULAS en párrafos, urgencia falsa
  ("solo quedan 2").
- Precios siempre con `precioMXN()` (`lib/formato.ts`) y aclarando
  **"/ docena (12 piezas)"**: la venta es solo por docena y debe quedar claro
  en tarjeta, carrito y checkout.
- Promos: se anuncian con dignidad — precio anterior tachado en `bone-dim`,
  precio nuevo en Anton, fecha de vigencia visible. Un solo banner, nunca
  pop-ups ni barras parpadeantes.
- Confianza en cada paso de pago: "Pago seguro con Mercado Pago", envío y
  tiempos de producción explícitos, WhatsApp siempre a mano.

## 8. Accesibilidad mínima

- Contraste: texto importante en `bone`; `bone-dim` solo para secundario.
  No bajes de `bone-dim/70` en texto que el cliente necesite leer.
- Todo botón con texto o `aria-label` (p. ej. el ✕ del drawer).
- Foco visible: borde o texto latón en `focus:`/`focus-visible:`.
- `lang="es"`, jerarquía h1 → h2 → h3 sin saltos, un solo h1 por página.

## 9. Checklist antes de entregar

1. ¿Solo usa tokens `steel / bone / brass / oxblood`?
2. ¿Títulos en Anton mayúsculas y texto en Inter? ¿Tamaños y tracking de la escala?
3. ¿Esquinas `rounded-sm` o rectas, bordes en vez de sombras?
4. ¿Un solo CTA latón relleno por vista?
5. ¿Se ve y se usa bien a 375px de ancho?
6. ¿Los precios usan `precioMXN()` y dicen "/ docena"?
7. ¿El texto es sobrio, concreto y sin emojis ni urgencia falsa?
8. ¿Reutilizaste componentes existentes en vez de duplicar estilos?

Si puedes, levanta el sitio (`npm run dev`) y toma captura a 375px y a
1280px para comprobarlo visualmente antes de dar el cambio por terminado.

## Deudas actuales (corregir cuando se toque ese archivo)

- `ProductoCard.tsx` usa `red-400` para el error de medida → pasar a oxblood (aclarado).
- Tracking suelto `0.18em`, `0.25em`, `0.45em` en Header, Hero y MarcadorFilo → normalizar a la escala.
- Microtexto `text-[10px]` en información clave ("/ docena", ayuda del carrito) → considerar `text-[11px]`.
