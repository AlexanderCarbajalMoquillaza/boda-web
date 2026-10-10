# Roadmap de Implementacion

Este roadmap mantiene el proyecto ordenado para aprender sin mezclar demasiadas capas a la vez.

## Fase 1 - RSVP por grupo familiar

Objetivo: una persona responsable confirma los datos de todo su grupo.

Incluye:

- Crear grupos familiares por boda.
- Generar `access_token` UUID para cada grupo.
- Consultar RSVP publico por token.
- Registrar integrantes del grupo.
- Validar en backend que no se exceda `max_guests_allowed`.

Endpoints:

```text
POST /api/weddings/{weddingId}/guest-groups
GET  /api/weddings/{weddingId}/guest-groups

GET  /api/public/rsvp/{token}
POST /api/public/rsvp/{token}
```

## Fase 2 - Seguridad backend

Objetivo: proteger administracion y controlar abuso.

Incluye:

- JWT para administradores.
- Login administrativo.
- Proteccion de `/api/weddings/**` y `/api/admin/**`.
- CORS restringido.
- Rate limiting en endpoints publicos RSVP.

## Fase 3 - Docker

Objetivo: levantar backend y PostgreSQL con comandos repetibles.

Incluye:

- `Dockerfile` para Spring Boot.
- `docker-compose.yml` con backend y PostgreSQL.
- Variables de entorno para credenciales.

## Fase 4 - Frontend base

Objetivo: crear la app React.

Incluye:

- React + Vite.
- Tailwind CSS.
- React Router.
- Axios.
- React Hook Form.

Rutas:

```text
/invitacion/:slug
/rsvp/:token
/admin
/admin/weddings/:id
```

## Fase 5 - Frontend avanzado

Objetivo: mejorar experiencia visual y estado remoto.

Incluye:

- React Query para carga, error, cache y refetch.
- Framer Motion para transiciones y microinteracciones.
- Lazy loading de paginas pesadas.
- Toasts para feedback visual.

## Fase 6 - Mesas

Objetivo: administrar ubicacion de invitados.

Incluye:

- CRUD de mesas.
- Asignacion de invitados a mesas.
- Drag and drop para mover grupos o invitados individuales.
