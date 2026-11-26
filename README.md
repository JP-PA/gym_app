# Continuidad del proyecto

Para retomar el trabajo, consulta [el contexto de la sesión](docs/CONTEXTO_PROYECTO.md),
con las decisiones, cambios, verificaciones y pendientes del 18 de noviembre de 2026.

# Gym Management Backend

Backend API for gym administration.

## Features

- User management
- Membership management
- Product management
- Sales management

## Technologies

- Node.js
- Express
- MariaDB

## Installation

npm install

## Run

npm run dev

## Paginación de listados

Las interfaces de usuarios, productos, membresías y ventas muestran 10 filas
por página y permiten seleccionar 25 o 50. Los listados usan orden descendente
por ID y muestran el total de registros.

Los endpoints `GET /usuarios`, `GET /productos`, `GET /membresias` y
`GET /ventas` aceptan `?page=2&limit=10`. Si se proporciona cualquiera de los
parámetros, la respuesta tiene este formato:

```json
{
  "data": [],
  "pagination": { "page": 2, "limit": 10, "total": 23, "totalPages": 3 }
}
```

`page` admite enteros entre 1 y 1000000; `limit`, entre 1 y 100. Sus valores
predeterminados son 1 y 10. Los parámetros inválidos producen HTTP 400.
Una página posterior a la última se ajusta a la última disponible. Con cero
registros se devuelve página 1, `totalPages: 0` y `data: []`.

Sin estos parámetros se conservan los formatos anteriores para los consumidores
existentes, incluidos los selectores de la venta. El listado de usuarios devuelve
solo `id`, `nombre`, `correo` y `created_at`. El dashboard utiliza el total de
la respuesta paginada y solicita una sola fila por colección.

Pruebas de validación y cálculo de páginas, sin conexión a MySQL:

```bash
node --test backend/test/pagination.test.js
```


## Registrar clientes, productos, membresías y ventas

1. Inicia el backend con `cd backend && npm run dev` y el frontend con
   `cd frontend && npm run dev` en otra terminal. MySQL se configura con
   `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` en `backend/.env`.
2. Inicia sesión. Las altas de productos, membresías y ventas requieren un JWT;
   Axios adjunta el token de la sesión. Un token vencido requiere iniciar sesión
   nuevamente. El registro público de cuentas se conserva.
3. En Usuarios, **Nuevo cliente** crea un usuario con nombre, correo único y
   contraseña (8–40 caracteres con mayúscula, minúscula, número y símbolo).
   Los clientes utilizan la tabla `usuarios`, sin un nuevo esquema de clientes.
4. En Productos, registra nombre, precio y stock inicial (se permite cero).
5. En Membresías, elige un cliente, plan y precio. El servidor calcula las fechas:
   mensual 30 días, trimestral 90, semestral 180 y anual 365.
6. En Ventas, selecciona el cliente, agrega productos y cantidades y pulsa
   **Registrar venta**. Puedes quitar líneas antes de guardar. El total mostrado
   es estimado; el servidor usa los precios de MySQL y comprueba el stock dentro
   de la transacción. Si falla un detalle o el descuento de stock, se revierte
   toda la venta. La base debe utilizar tablas con soporte de transacciones.

Al guardar, se cierra el formulario y el listado se recarga en la primera página.
Los errores conservan el formulario abierto. Mientras se guarda se deshabilitan
los controles para evitar envíos repetidos.

Las altas usan `POST /usuarios`, `POST /productos`, `POST /membresias` y
`POST /ventas`. El frontend permite configurar el servidor con `VITE_API_URL`;
por defecto usa `http://localhost:3000`. No se requieren nuevas tablas ni columnas.

Pruebas sin escrituras en la base configurada:

```bash
node backend/test/creation.test.js
node backend/test/creation-flow.test.js
node backend/test/pagination.test.js
```

`creation-flow.test.js` prueba controladores, servicios y modelos reales con una
conexión SQL simulada; usa `registerHooks` de Node.js (entorno verificado: Node 24).


## Renovar una membresía vencida

En Membresías, las filas con estado **vencida** muestran **Renovar**. El formulario
precarga el plan y el precio; al confirmar usa `PUT /membresias/:id` con
`{ "tipo": "mensual", "precio": 80000 }` y requiere una sesión JWT válida.
El cliente y el ID se conservan. La fecha de inicio pasa a `CURDATE()` de MySQL
y el vencimiento se calcula a 30, 90, 180 o 365 días según el plan. Las fechas
del período anterior se reemplazan; este flujo no crea un historial de renovaciones.

Una membresía activa no se renueva por esta operación (HTTP 409); un ID inexistente
produce 404. Una actualización condicional evita renovar dos veces la misma fila
si llegan solicitudes simultáneas. Tras guardar se recarga la página actual del listado.


## Roles y espacio personal

El backend exige `JWT_SECRET` configurado; no utiliza un secreto de respaldo.
Cada petición autenticada consulta la cuenta y su rol actual en MySQL. Los JWT
vencen en una hora. Si se elimina una cuenta o se retira su rol, sus tokens no
conservan el acceso anterior. El frontend comprueba `/mi/perfil` al recuperar una
sesión y vuelve al login cuando el servidor responde 401.

- `admin`: acceso a las rutas administrativas `/usuarios`, `/productos`,
  `/membresias` y `/ventas`. El login dirige a `/dashboard`.
- `user`: interfaz `/mi`, `/mi/perfil`, `/mi/membresias` y `/mi/compras`, con el
  mismo diseño. El registro siempre crea este rol, aunque el cliente intente
  enviar otro. No hay endpoints para elevar roles.
- Permanecen públicos únicamente el registro `POST /usuarios` y el login
  `POST /usuarios/login`.

Los endpoints personales `GET /mi/perfil`, `GET /mi/membresias`,
`GET /mi/compras` y `GET /mi/compras/:id` toman la identidad de la sesión.
Las listas tienen paginación y filtran en SQL por `usuario_id`. Consultar una
compra ajena devuelve 404 antes de consultar sus detalles. El perfil personal
es de consulta; las renovaciones se gestionan con el administrador.

La columna `usuarios.role` ya existe: no hace falta cambiar el esquema.
Para designar una única cuenta administradora de forma controlada:

```bash
cd backend
node scripts/set-admin.js correo-de-la-cuenta-existente
```

Este comando modifica datos: comprueba la cuenta, requiere InnoDB, usa una
transacción y un bloqueo para serializar asignaciones, retira el rol de otros
administradores y verifica que quede exactamente uno. No crea cuentas y no se
ejecuta durante el arranque. Las modificaciones manuales externas de MySQL
pueden cambiar esta condición; no hay una restricción nueva en el esquema.
La cuenta administradora no se elimina ni se edita desde la gestión de clientes.

Pruebas de autorización y aislamiento sin utilizar la base real:

```bash
node backend/test/access.test.js
```


## Recuperar una contraseña borrada o NULL

Desde una terminal local interactiva, ejecuta:

```bash
cd backend
node scripts/reset-password.js correo-de-la-cuenta
```

El comando solicita la contraseña dos veces con entrada oculta, valida la política
existente y guarda únicamente su hash bcrypt dentro de una transacción. Conserva
el rol y los demás datos. Requiere las variables de conexión en `backend/.env`.
No pases la contraseña por argumentos ni la escribas directamente en MySQL.

## Correo único

Registro, edición y login normalizan el correo con espacios exteriores eliminados
y minúsculas. Registro y edición rechazan correos ocupados con HTTP 409. El índice
único `unique_correo` de MySQL protege también frente a inserciones simultáneas.
La búsqueda detecta correos equivalentes antiguos y, si hay más de una cuenta,
rechaza la operación en lugar de elegir arbitrariamente una identidad.

Para revisar índices y duplicados sin modificar datos:

```bash
cd backend
node scripts/check-email-uniqueness.js correo-a-verificar
```

Esta comprobación no elimina, fusiona ni cambia usuarios.


## Búsquedas y filtros

Los listados buscan en MySQL, no solo en la página visible. Los filtros se
combinan entre sí, conservan la paginación y vuelven a la página 1 al cambiar.
La búsqueda de texto se aplica tras 300 ms sin escribir; el resto se aplica al
cambiar. **Limpiar filtros** conserva la cantidad de filas elegida. No se agregó
ningún campo ni se modificó el esquema de la base de datos.

| Listado | Parámetros disponibles |
| --- | --- |
| Usuarios | `q` (nombre o correo), `nombre`, `correo` |
| Productos | `q` (nombre), `precioMin`, `precioMax`, `stock` (`disponible` o `agotado`) |
| Membresías | `q` (nombre o correo del cliente), `tipo`, `estado`, `fechaCampo`, `fechaDesde`, `fechaHasta`, `precioMin`, `precioMax` |
| Ventas | `q` (nombre o correo del cliente), `fechaDesde`, `fechaHasta`, `totalMin`, `totalMax` |
| Mis membresías | Los filtros de membresías, sin búsqueda de otros clientes |
| Mis compras | `q` (producto o número de compra), `fechaDesde`, `fechaHasta`, `totalMin`, `totalMax` |

`tipo` admite `mensual`, `trimestral`, `semestral` y `anual`; `estado`, `activa`
o `vencida`. Las fechas son `YYYY-MM-DD`. En membresías, `fechaCampo=inicio`
filtra la fecha de inicio; de forma predeterminada o con `vencimiento`, filtra
la fecha final. La fecha Hasta incluye el día completo. Los importes son
inclusivos y pueden ser cero. Un rango invertido o un filtro inválido produce
HTTP 400 con un mensaje visible en el listado.

Ejemplos:

```text
/usuarios?q=juan&page=1&limit=10
/productos?stock=disponible&precioMin=1000&precioMax=50000
/membresias?estado=vencida&fechaCampo=vencimiento&fechaDesde=2026-11-01&fechaHasta=2026-11-18
/ventas?totalMin=10000&fechaDesde=2026-11-01
/mi/compras?q=agua
```

Una consulta con filtros devuelve `{ data, pagination }` incluso sin `page` o
`limit`; sin filtros ni paginación se conservan las respuestas anteriores para
los selectores existentes. Las búsquedas tratan `%`, `_` y `!` como texto
literal. Los filtros personales nunca sustituyen la identidad de la sesión.
No se implementa búsqueda por cédula porque esa columna todavía no existe.

Pruebas de rangos, SQL parametrizado, contador y aislamiento:

```bash
node backend/test/listFilters.test.js
```

## Notificaciones de mensualidades vencidas

El administrador puede abrir **Notificaciones** desde el menú lateral o el
avatar. Allí se listan las mensualidades vencidas con paginación y la acción
**Renovar**. El listado consulta la base al abrirse y al renovar. Usa el mismo
criterio que Membresías: la fecha de fin cuenta como último día vigente.

El backend revisa diariamente a partir de las 8:00 a. m. (hora de Colombia)
si está en ejecución. Envía un correo por día a cada cliente con una mensualidad
vencida y sin otra membresía vigente. Si el proceso arranca después de esa hora,
intenta realizar la revisión del día. Los fallos se reintentan cada 15 minutos
durante el horario de envío. Resend usa una clave por cliente y fecha para
evitar duplicados al reintentar o reiniciar dentro del mismo día.

El centro funciona sin configuración de correo. Para activar el envío, configura
estas variables en el entorno del backend y reinícialo:

```dotenv
MEMBERSHIP_REMINDERS_ENABLED=true
MEMBERSHIP_REMINDERS_FROM=avisos@dominio-verificado.example
RESEND_API_KEY=
```

Usa un remitente de un dominio verificado en Resend y asigna la clave mediante
el entorno o el archivo local `backend/.env`. Conserva la activación deshabilitada
en entornos de desarrollo que apunten a clientes reales.
