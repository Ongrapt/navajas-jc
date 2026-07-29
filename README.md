# Navajas Javier Calleros — Tienda en línea

Tienda de 12 productos hecha en **Next.js 14** con carrito y cobro vía
**Mercado Pago (Checkout Pro)**. El cliente paga en el entorno seguro de
Mercado Pago, así que este sitio **nunca maneja datos de tarjeta**.

---

## 1. Correr en tu máquina

Necesitas Node.js 18+ instalado.

```bash
npm install
cp .env.example .env      # y edita el archivo .env (ver abajo)
npm run dev
```

Abre http://localhost:3000

---

## 2. Configurar el cobro (Mercado Pago)

**Antes de vender, haz esto:**

1. Crea tu cuenta de negocio en https://www.mercadopago.com.mx
2. **Confirma con Mercado Pago que aceptan tu categoría de producto.**
   Descríbelo con honestidad (navajas/espuelas artesanales para gallos).
   Es legal en México, pero conviene tenerlo por escrito para que no te
   congelen la cuenta después de la primera venta.
3. Entra a **Tus integraciones → Credenciales** y copia el
   **Access Token**.
   - Para probar usa el token de **PRUEBA** (empieza con `TEST-`)
   - Para vender de verdad usa el de **PRODUCCIÓN** (empieza con `APP_USR-`)
4. Pega el token en el archivo `.env`:

```
MP_ACCESS_TOKEN=APP_USR-tu-token-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Con el token puesto, el botón "Pagar con Mercado Pago" ya redirige al
checkout real.

> Seguridad: los precios se validan **en el servidor** (`lib/productos.ts`),
> nunca se confía en el precio que manda el navegador. Nadie puede alterar
> el importe desde el cliente.

---

## 3. Poner tus 12 productos

Edita **`lib/productos.ts`**. Cada producto lleva:

- `nombre`, `linea` (colección), `medida`, `material`, `descripcion`
- `precio` **en centavos** (ej. $1,250.00 → `125000`) para evitar
  errores de redondeo
- `imagen` (opcional): pon la foto en la carpeta `public/` y usa
  `imagen: "/fotos/mi-navaja.jpg"`. Si no pones foto, se dibuja un
  marcador temporal.

También personaliza los textos en:
- `components/Hero.tsx` (título y frase principal)
- `components/Herencia.tsx` (historia de la casa Calleros desde 1955)
- `components/Footer.tsx` (contacto / WhatsApp)

---

## 4. Publicar en internet

La vía más simple con Next.js es **Vercel** (gratis para empezar):

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a https://vercel.com, importa el repo.
3. En Vercel → Settings → Environment Variables, agrega
   `MP_ACCESS_TOKEN` (el de producción) y `NEXT_PUBLIC_SITE_URL`
   con `https://navajasjaviercalleros.com.mx`.
4. En Vercel → Domains, conecta tu dominio
   **navajasjaviercalleros.com.mx** (Vercel te da los registros DNS
   que debes poner con tu proveedor del dominio).

---

## Estructura

```
app/
  page.tsx              Página principal (una sola vista con scroll)
  layout.tsx            Estructura base + fuentes
  api/checkout/route.ts Crea el cobro en Mercado Pago (servidor)
  gracias/ pago-error/ pago-pendiente/   Regreso desde Mercado Pago
components/             Header, Hero, Catálogo, Carrito, etc.
lib/
  productos.ts          TUS 12 PRODUCTOS (edita aquí)
  formato.ts            Formato de precios en pesos
```

---

## Pendientes recomendados (para más adelante)

- **Webhook de Mercado Pago** para confirmar el pago del lado del servidor
  y llevar registro de pedidos (hoy la confirmación es solo la redirección).
- Cálculo de **envío** por región.
- Correo de confirmación al comprador.
- Página con foto grande por producto (hoy el catálogo va en una sola vista).
