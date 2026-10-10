# Modelo de Base de Datos - Boda Planner

Este modelo esta pensado para una primera version realista de una app de gestion de bodas con Spring Boot, React y PostgreSQL.

## Modelo Logico

Entidades principales:

- `app_user`: usuario que administra una o mas bodas.
- `wedding`: boda creada por un usuario.
- `guest_group`: invitacion enviada a una persona o familia. Aqui se limita cuantos invitados puede registrar y se genera un enlace privado unico.
- `guest`: invitado individual registrado dentro de un grupo de invitacion.
- `wedding_task`: tareas de planificacion.
- `vendor`: proveedores.
- `budget_item`: conceptos del presupuesto.
- `reception_table`: mesas de recepcion.
- `schedule_item`: cronograma del dia de la boda. En la interfaz actual se gestiona desde el editor de contenido de la boda.

Relaciones:

- Un `app_user` puede tener muchas `wedding`.
- Una `wedding` tiene muchos `guest_group`.
- Un `guest_group` tiene muchos `guest`.
- Una `wedding` tiene muchas tareas, proveedores, items de presupuesto, mesas y eventos de cronograma.
- Un `guest` puede estar asignado a una `reception_table`.
- Un `budget_item` puede estar asociado opcionalmente a un `vendor`.

## Landing Page / Invitacion

La landing page no necesita una tabla separada al inicio. Puede salir de `wedding` usando:

- `invitation_slug`: URL publica, por ejemplo `/invitacion/ana-y-luis`.
- `is_invitation_public`: permite activar o desactivar la invitacion.
- `max_registered_guests`: limite global de invitados registrados para esa boda.

El limite por invitacion esta en `guest_group.max_guests_allowed`.

Ejemplo:

- Los novios crean un grupo para "Familia Perez".
- El grupo tiene `max_guests_allowed = 4`.
- La familia recibe un enlace privado con token y solo puede registrar hasta 4 personas.

## Flujo Sugerido para Programar

Primera vertical:

1. Crear `app_user`.
2. Crear `wedding`.
3. Crear landing publica por `invitation_slug`.
4. Crear `guest_group` con `max_guests_allowed`; el sistema genera un enlace privado unico.
5. Registrar invitados en `guest`, validando que no excedan el limite.

Despues agrega:

- Tareas.
- Presupuesto.
- Proveedores.
- Mesas.
- Cronograma.

## Pistas para Spring Boot

No empieces creando todas las entidades a la vez. Hazlo asi:

1. `User`
2. `Wedding`
3. `GuestGroup`
4. `Guest`

Cuando eso funcione, sigue con los modulos administrativos.

Validaciones importantes:

- `invitation_slug` debe ser unico.
- `email` de usuario debe ser unico.
- `guest_group.access_token` debe ser unico.
- No permitir registrar mas invitados que `guest_group.max_guests_allowed`.
- No permitir registrar mas invitados que `wedding.max_registered_guests`, si usas limite global.

## Endpoints Iniciales Sugeridos

Administracion:

```text
POST /api/auth/register
POST /api/auth/login

POST /api/weddings
GET  /api/weddings
GET  /api/weddings/{id}

POST /api/weddings/{weddingId}/guest-groups
GET  /api/weddings/{weddingId}/guest-groups
```

Landing publica:

```text
GET  /api/public/invitations/{slug}
POST /api/public/guest-groups/{guestGroupId}/guests
```

La parte publica debe permitir responder invitaciones, pero no debe exponer datos privados de administracion.
