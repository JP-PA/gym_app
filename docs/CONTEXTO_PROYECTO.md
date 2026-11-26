# Contexto para retomar el proyecto

Última actualización: 18 de noviembre de 2026, zona America/Bogota.
Este documento resume la sesión de trabajo. El código y README.md son la fuente
para comprobar el comportamiento actual; no asumir que las pruebas aquí indicadas
siguen vigentes tras cambios posteriores.

## Cómo retomar

1. Leer AGENTS.md, este documento y README.md antes de modificar código.
2. Revisar `git status --short`: existen muchos cambios y archivos nuevos sin commit,
   además de eliminaciones intencionales. No restaurarlos ni sobrescribirlos.
3. Revisar especialmente búsquedas/filtros, último trabajo implementado.
4. Probar con el usuario las pantallas reales; aún falta validación visual en navegador
   y pruebas de punta a punta contra MySQL de los formularios y filtros.
5. La tercera fase del plan todavía no se ha definido. Preguntar por su alcance
   cuando se retome esa planificación, sin inventar requisitos.

El usuario quiere cambios concretos y explicaciones claras en español. Prefiere
reutilizar el diseño actual, evitar dependencias innecesarias y no añadir todavía
campos a la base de datos. No realizar commits/push automáticamente.

## Arquitectura

- Backend: Node.js con módulos ES, Express 5, mysql2, Joi, bcryptjs y jsonwebtoken.
- Capas: rutas → controladores → servicios → modelos; SQL en modelos.
- MySQL mediante pool y variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
- Frontend: React 19, Vite 8, React Router 7, Axios, React Icons y CSS propio.
- API por defecto http://localhost:3000, configurable con VITE_API_URL.
- JWT_SECRET obligatorio; se conservó el secreto ya configurado. Nunca imprimir
  ni copiar credenciales, hashes, tokens o el contenido de backend/.env.
- Tablas existentes: usuarios, productos, membresias, ventas y detalle_ventas.
- No se modificó el esquema durante esta sesión.

## Trabajo realizado

### Diseño del frontend

- Navegación oscura, acentos naranja, sección activa, salida de sesión y adaptación móvil.
- Login/registro en español, validaciones y estados de guardado.
- Dashboard con conteos reales y accesos rápidos, sin cifras inventadas.
- Componentes compartidos de tarjetas, tablas, formularios y modales.
- Estilos centralizados en frontend/src/styles/global.css y estilos de componentes.

### Paginación

- Usuarios, productos, membresías, ventas y listas personales.
- 10 filas inicialmente, opciones 25/50 y Anterior/Siguiente.
- Backend valida page/limit y usa ORDER BY por ID descendente, LIMIT y OFFSET.
- Respuesta paginada: `{ data, pagination: { page, limit, total, totalPages } }`.
- Una página inexistente se ajusta a la última; sin resultados: page=1, totalPages=0.
- Sin parámetros de paginación ni filtros se mantienen contratos anteriores para
  selectores: arrays, salvo productos que devuelve `{ productos }`.
- Dashboard solicita limit=1 y usa pagination.total para evitar descargar colecciones.
- Base: backend/src/utils/pagination.js, frontend/src/hooks/usePaginatedList.js y
  frontend/src/components/Pagination.jsx.

### Altas funcionales

- Productos: nombre, precio y stock; stock cero permitido.
- Clientes: son usuarios en la tabla actual; nombre, correo y contraseña bcrypt.
- Membresías: cliente, plan y precio; el servidor calcula fechas.
- Ventas: cliente, productos, cantidades, agregar/quitar líneas y total estimado.
- Servidor calcula el total con los precios de MySQL, agrupa productos repetidos,
  bloquea filas en orden y guarda venta/detalles/descuento de stock en una transacción.
- Descuento condicional de stock y rollback ante errores.
- Importes ajustados a DECIMAL(10,2); nombres/correos a los límites del esquema.
- Se conservan formularios ante errores y se bloquean envíos mientras se guarda.
- Tras crear se recarga la primera página del listado.
- Archivos principales: CreateRecordModal.jsx, CrearVentaModal.jsx, FormModal.jsx,
  utils/saleTransaction.js y validators/venta.validator.js.

### Renovación de membresías vencidas

- Acción Renovar solo en filas vencidas, con plan y precio precargados.
- PUT /membresias/:id exige administrador y admite tipo/precio; no permite reasignar cliente.
- Conserva ID y usuario_id, reemplaza las fechas anteriores y activa la membresía.
- Inicio: CURDATE() de MySQL; duración: mensual 30, trimestral 90, semestral 180,
  anual 365 días. Son días fijos, no meses calendario.
- WHERE fecha_fin < CURDATE() evita renovaciones duplicadas concurrentes.
- 404 si no existe; 409 si está activa o otra solicitud ya la renovó.
- No existe historial de renovaciones: las fechas anteriores se sobrescriben.
- Componente: RenewMembershipModal.jsx; backend en archivos de membresías.

### Separación administrador/usuario — primera fase del plan

- Se reutiliza usuarios.role, con valores admin y user.
- Registro público siempre inserta user; Joi rechaza role enviado por el cliente.
- Todas las rutas de gestión requieren sesión y requireAdmin, excepto registro y login.
- auth.middleware.js verifica JWT HS256 y consulta la cuenta/rol actual en MySQL
  en cada petición. Una cuenta eliminada o un rol retirado no conserva permisos.
- Frontend recupera la sesión con GET /mi/perfil, maneja 401 y protege rutas por rol.
- Administrador: /dashboard y las pantallas de gestión.
- Usuario: /mi, /mi/perfil, /mi/membresias y /mi/compras, con diseño compartido.
- Endpoints: GET /mi/perfil, /mi/membresias, /mi/compras y /mi/compras/:id.
- SQL filtra por el ID de la sesión; nunca por un usuario_id elegido en el navegador.
- Compra ajena devuelve 404 antes de consultar sus detalles.
- Perfil personal es de consulta; renovaciones quedan a cargo del administrador.
- No se puede borrar ni editar la cuenta administradora desde la gestión de clientes.
- Archivos: backend/src/{models,services,controllers,routes}/personal.*, frontend/src/auth,
  pages/personal.jsx, services/personal.service.js y components/protectedRoute.jsx.

### Cuenta administradora y recuperación

- El usuario autorizó designar perezarevalojuanpablo17@gmail.com como único administrador.
- Se ejecutó scripts/set-admin.js con éxito sobre MySQL: cuenta ID 1, rol admin.
- El comando serializa asignaciones con GET_LOCK y usa una transacción InnoDB.
  No hay una restricción nueva de esquema que impida cambios manuales externos.
- El usuario borró accidentalmente password y quedó NULL. Se añadió un comando
  interactivo con entrada oculta y bcrypt; el usuario informó que lo ejecutó.
  No se conoce, guardó ni pidió su nueva contraseña en el chat.
- Login con password NULL devuelve 401, no un fallo interno.
- Comando desde backend:
  `node scripts/reset-password.js perezarevalojuanpablo17@gmail.com`
- Recuperación en services/passwordRecovery.service.js y models/passwordRecovery.model.js.

### Correo único

- Se consultó MySQL en modo solo lectura: existe UNIQUE unique_correo.
- Al verificar no había grupos duplicados por LOWER(TRIM(correo)); el correo del
  administrador coincidía con una sola cuenta, ID 1. No se borraron usuarios.
- Registro, edición y login normalizan espacios exteriores y minúsculas.
- Registro/edición rechazan correos ocupados con 409; se captura ER_DUP_ENTRY
  para cubrir carreras entre inserciones concurrentes.
- Búsqueda de identidad detecta duplicados equivalentes antiguos y no elige una
  cuenta arbitraria. No se normalizaron registros existentes mediante escrituras masivas.
- Diagnóstico de solo lectura desde backend:
  `node scripts/check-email-uniqueness.js correo-a-verificar`

### Búsquedas y filtros — segunda fase del plan, último trabajo

Se implementaron con campos existentes. No se añadió cédula ni otra columna.

| Listado | Filtros |
| --- | --- |
| Usuarios | q (nombre/correo); API también nombre y correo |
| Productos | q (nombre), precioMin/precioMax, stock disponible/agotado |
| Membresías | q (cliente/correo), tipo, estado, fechaCampo, fechaDesde/Hasta, precioMin/Max |
| Ventas | q (cliente/correo), fechaDesde/Hasta, totalMin/Max |
| Mis membresías | Plan, estado, fechas y precio, conservando propietario |
| Mis compras | q (producto o número de compra), fechas y total, conservando propietario |

- Texto: espera de 300 ms; otros filtros se aplican al cambiar.
- Limpiar filtros, número de resultados y reinicio a página 1 conservando limit.
- Cambiar página o cantidad de filas conserva los filtros; peticiones se cancelan
  al ser reemplazadas y al desmontar.
- Fechas YYYY-MM-DD validadas como fechas reales; rangos invertidos devuelven 400.
- Membresías: fechaCampo=inicio o vencimiento; predeterminado vencimiento.
- Hasta incluye el día completo; importes inclusivos y cero permitido.
- SQL parametrizado; columnas y opciones permitidas se definen en código.
- %, _ y ! en texto se escapan para buscarlos literalmente.
- COUNT y SELECT comparten condiciones y parámetros.
- Consultas filtradas devuelven formato paginado aunque no se envíe page/limit.
- Archivos: backend/src/utils/listFilters.js, modelos/controladores de listados,
  frontend/src/components/SearchFilters.jsx y hooks/usePaginatedList.js.
- Se agregó la columna visual Precio en la tabla de membresías, usando el campo existente.

### Limpieza intencional

Se retiraron 15 archivos y 2 carpetas vacías confirmados sin uso:
- frontend/public/{index.html,app.js,styles.css,icons.svg}: interfaz antigua y recursos.
- components/Ventatable.jsx, components/button/{Button.jsx,Button.css},
  components/input/{Input.jsx,input.css}, layouts/MainLayout.jsx,
  services/dashboard.service.js.
- pages/{users,products,memberships,sells}.css: solo contenían comentarios.
- Se ajustaron los imports y retiraron consultas no utilizadas de membresías
  y detalle de ventas. No restaurar automáticamente estos archivos.

## Auditorías y pendientes conocidos

Se revisó arquitectura y autenticación; la skill local de seguridad está en
.agents/skills/security/skill.md (name: security-review). Las auditorías originales
se hicieron sin editar; varias vulnerabilidades se corrigieron posteriormente
con roles, filtros por propietario, correo único, eliminación del secreto JWT de
respaldo, hash en actualizaciones y mensajes de error controlados.

Pendientes o límites que deben revisarse antes de afirmar que todo está resuelto:
- Falta revisión visual en navegador y pruebas completas con cuentas reales.
- No se hicieron altas de prueba contra la base real: pruebas de flujos usan
  controladores/servicios/modelos reales con conexión SQL simulada.
- No se ejecutaron los filtros recientes contra MySQL real durante su implementación.
- Botones de editar/eliminar en algunas tablas siguen sin manejadores; no se
  implementó CRUD completo de edición/borrado para todos los recursos.
- Revisar productos.service.js: nombres de métodos del modelo incompatibles en
  detalle/actualización/eliminación, firma de actualización, typo lenght.
- Revisar productos.controller.js: detalle retorna objeto sin res.json, errores
  y mensajes antiguos en operaciones no abordadas.
- Revisar productos.model.js: orden de parámetros en el UPDATE genérico existente.
  Estos defectos no afectan el flujo de alta o venta probado, pero siguen pendientes.
- No se añadió limitación de intentos de login ni auditoría de dependencias por CVE.
- No hay migraciones/SQL de esquema versionado ni historial de renovaciones.
- Los selectores aún pueden cargar listas completas por compatibilidad.
- El índice unique_correo existe en el entorno verificado; revisar cada otro despliegue.
- CORS sigue configurado de forma amplia; revisar cuando se defina despliegue.
- El README menciona tecnologías/arranque antiguos al inicio; las secciones añadidas
  contienen los flujos y comandos vigentes. Revisar antes de publicar documentación.

## Verificaciones ejecutadas en la sesión

- `npm run build --prefix frontend`: correcto tras los filtros.
- ESLint de frontend/src (desde frontend): `./node_modules/.bin/eslint src`, correcto.
- `npm test --prefix backend`: correcto, seis archivos de pruebas al cierre funcional.
- Pruebas específicas ejecutadas directamente: access, creation-flow, creation,
  listFilters, pagination y passwordRecovery.
- `node --check` de archivos de backend: correcto.
- `git diff --check`: correcto al cierre funcional.
- Consultas reales de solo lectura: columnas/tipos, índice único, duplicados/cuenta.
- Escritura real autorizada: asignación de única cuenta administradora mediante script.
- La recuperación de contraseña fue ejecutada por el usuario, según su confirmación.

## Comandos habituales

```bash
# Dos terminales, desde la raíz del repositorio:
npm run dev --prefix backend
npm run dev --prefix frontend

# Verificaciones:
npm test --prefix backend
npm run build --prefix frontend
cd frontend
./node_modules/.bin/eslint src
```

Backend puerto 3000. Los permisos del entorno pueden bloquear conexiones MySQL;
si sucede, solicitar la aprobación correspondiente para ejecutar la operación.
No intentar evadir el bloqueo. No incluir backend/.env ni secretos en Git.
