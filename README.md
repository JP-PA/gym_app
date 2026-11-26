# Gestión de gimnasio

Aplicación para gestionar clientes, membresías, inventario y ventas. El backend usa Node.js, Express y MySQL. El frontend usa React y Vite.

- **Administración** permite registrar clientes, gestionar ventas y renovar membresías desde el centro de notificaciones.
- **Clientes** pueden consultar su perfil, sus membresías y sus compras.
- **Rutinas** ofrece ejercicios por grupo muscular con imágenes, videos y pasos. El catálogo está en el frontend.

## Inicio local

Necesitas Node.js 24, npm y una base MySQL con el esquema del proyecto ya instalado.

1. Crea `backend/.env` con los datos de tu entorno.

   ```dotenv
   DB_HOST=localhost
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   JWT_SECRET=
   ```

   Usa un valor aleatorio para `JWT_SECRET` y guarda el archivo solo en tu equipo.

2. Inicia el backend en una terminal.

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Inicia el frontend en otra terminal, desde la raíz del repositorio.

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

Abre la URL que muestra Vite. El frontend usa `http://localhost:3000` como API. Si cambia, configura `VITE_API_URL` en `frontend/.env`.

Para designar una cuenta existente como única administradora, ejecuta desde `backend`:

```bash
node scripts/set-admin.js correo-de-la-cuenta-existente
```

## Avisos por correo

El centro de notificaciones está disponible desde el menú del administrador. Para activar los correos, añade estas variables a `backend/.env` y reinicia el servidor.

```dotenv
MEMBERSHIP_REMINDERS_ENABLED=true
MEMBERSHIP_REMINDERS_FROM=avisos@dominio-verificado.example
RESEND_API_KEY=
```

Usa una clave de Resend y un remitente de un dominio verificado. Mientras el servidor esté en ejecución, revisa los vencimientos a partir de las 8:00 a. m. (hora de Colombia) y envía un aviso diario a cada cliente con una mensualidad vencida y sin otra membresía vigente.

## Verificación

Desde la raíz del repositorio:

```bash
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```
