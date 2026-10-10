# Guía Paso a Paso: Despliegue de Sistema de Bodas en Neon y Render

Esta guía está diseñada paso a paso para que cualquier persona, incluso sin experiencia previa en despliegue en la nube, pueda poner en funcionamiento la aplicación **Frontend (React)** y **Backend (Spring Boot / Java 21)** conectada a **Neon (PostgreSQL Serverless)**.

---

## Índice
1. [Paso 1: Crear la Base de Datos en Neon (PostgreSQL)](#paso-1-crear-la-base-de-datos-en-neon)
2. [Paso 2: Subir el Proyecto a GitHub](#paso-2-subir-el-proyecto-a-github)
3. [Paso 3: Desplegar en Render](#paso-3-desplegar-en-render)
   - [Opción A: Despliegue Automático con 1 Clic (Blueprint `render.yaml`)](#opción-a-despliegue-automático-con-blueprint-recomendado)
   - [Opción B: Despliegue Manual Paso a Paso](#opción-b-despliegue-manual-paso-a-paso)
4. [Paso 4: Verificación y Creación del Usuario Administrador](#paso-4-verificación-y-creación-del-usuario-administrador)
5. [Resolución de Dudas Frecuentes](#resolución-de-dudas-frecuentes)

---

## Paso 1: Crear la Base de Datos en Neon

**Neon** es un servicio gratuito de PostgreSQL en la nube.

1. Ve a [https://neon.tech](https://neon.tech) y haz clic en **Sign Up** (puedes iniciar sesión con tu cuenta de GitHub o Google).
2. Haz clic en **Create Project** (Crear proyecto):
   - **Project name:** `boda-planner` (o el nombre que gustes)
   - **Postgres version:** Deja la que viene seleccionada (16 o superior)
   - **Region:** Elige la más cercana (por ejemplo `US East (Ohio)` o `US East (N. Virginia)`)
3. Haz clic en **Create Project**.
4. En el panel principal del proyecto, verás una sección llamada **Connection Details** con una caja de texto:
   - Selecciona en el selector el formato **Postgres** o **Connection string**.
   - Verás algo similar a:
     ```text
     postgresql://alexander:tu_password_aqui@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - **Copia y guarda esta URL**, la necesitarás en el paso de Render.

> 💡 **Nota sobre las tablas:**
> Tu backend en Spring Boot está configurado con `ddl-auto=update`, lo que significa que **creará automáticamente todas las tablas al iniciar**.
> Si prefieres crearlas tú mismo antes en Neon: ve a la pestaña **SQL Editor** en la consola de Neon, abre el archivo `docs/schema-completo-neon.sql`, copia todo el contenido, pégalo en el editor y presiona **Run**.

---

## Paso 2: Subir el Proyecto a GitHub

Render necesita conectarse a un repositorio de GitHub para descargar tu código y desplegarlo.

1. Abre tu terminal en la carpeta del proyecto (`/Users/alexander/Documents/Boda Web`).
2. Crea tu repositorio en [https://github.com/new](https://github.com/new):
   - Nombre: `boda-web` (o el que prefieras).
   - Puedes dejarlo **Público** o **Privado** (Render funciona con ambos).
   - **No** marques la opción de inicializar con README ni `.gitignore` (ya los creamos localmente).
3. En tu terminal ejecuta los siguientes comandos:

```bash
# 1. Agregar todos los archivos preparados
git add .

# 2. Hacer el primer commit
git commit -m "Configuracion completa para despliegue en Neon y Render"

# 3. Renombrar la rama a main si es necesario
git branch -M main

# 4. Vincular con tu repositorio de GitHub (reemplaza TU_USUARIO y TU_REPO con los tuyos)
git remote add origin https://github.com/TU_USUARIO/boda-web.git

# 5. Subir a GitHub
git push -u origin main
```

---

## Paso 3: Desplegar en Render

Crea una cuenta gratuita en [https://render.com](https://render.com) (inicia sesión con tu cuenta de GitHub para que todo sea más fácil).

### Opción A: Despliegue Automático con Blueprint (Recomendado)

Ya hemos creado el archivo `render.yaml` en la raíz de tu proyecto. Este archivo le dice a Render exactamente cómo configurar tanto el backend como el frontend de una sola vez.

1. En el panel de Render, haz clic en **New +** (arriba a la derecha) y selecciona **Blueprint**.
2. Conecta tu repositorio de GitHub `boda-web`.
3. Render leerá el archivo `render.yaml` y te mostrará:
   - **boda-planner-backend** (Servicio Web Docker)
   - **boda-planner-frontend** (Sitio Estático React)
4. Te pedirá completar las variables que marcamos como manuales:
   - `DATABASE_URL`: Pega la URL de conexión que copiaste de Neon (ej: `postgresql://...`).
   - `APP_ADMIN_EMAIL`: Tu correo para el administrador (ej: `admin@boda.com`).
   - `APP_ADMIN_PASSWORD`: Una contraseña segura para tu administrador.
   - `VITE_API_BASE_URL`: Puedes dejarlo temporalmente vacío o completarlo una vez que se genere la URL del backend.
5. Haz clic en **Apply**. Render comenzará a compilar y desplegar ambos servicios.

---

### Opción B: Despliegue Manual Paso a Paso

Si prefieres tener el control total creando servicio por servicio:

#### A. Desplegar el Backend (Spring Boot API)
1. En Render, clic en **New +** -> **Web Service**.
2. Selecciona tu repositorio de GitHub.
3. Configura los siguientes campos:
   - **Name:** `boda-planner-backend`
   - **Region:** La misma que elegiste en Neon (ej: `Oregon` u `Ohio`).
   - **Branch:** `main`
   - **Root Directory:** (déjalo vacío o pon `planner`)
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./planner/Dockerfile`
   - **Docker Context:** `./planner`
   - **Instance Type:** `Free`
4. En la sección **Environment Variables** (Variables de Entorno), añade:
   - `DATABASE_URL`: Tu URL copiada de Neon (`postgresql://usuario:clave@host/neondb?sslmode=require`)
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
   - `PORT`: `8080`
   - `APP_JWT_SECRET`: Una clave larga aleatoria (ej: `mi-clave-super-secreta-jwt-boda-2026-prod`)
   - `APP_FRONTEND_ORIGIN`: `*` (permite peticiones del frontend)
   - `APP_ADMIN_EMAIL`: Tu correo de administrador (ej: `admin@boda.com`)
   - `APP_ADMIN_PASSWORD`: Tu clave de administrador (ej: `Admin1234!`)
5. Haz clic en **Deploy Web Service**.
6. Render empezará a compilar el contenedor Docker. Al finalizar te dará una URL pública tipo:
   `https://boda-planner-backend.onrender.com`

---

#### B. Desplegar el Frontend (React + Vite)
1. En Render, clic en **New +** -> **Static Site**.
2. Selecciona tu repositorio de GitHub.
3. Configura los siguientes campos:
   - **Name:** `boda-planner-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. En **Environment Variables**:
   - `VITE_API_BASE_URL`: La URL pública de tu backend con `/api` al final:
     Ejemplo: `https://boda-planner-backend.onrender.com/api`
5. En la sección **Redirects/Rewrites**:
   - (El archivo `public/_redirects` ya lo hace automáticamente, pero puedes verificarlo en Render):
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
6. Haz clic en **Create Static Site**.
7. En unos segundos tu frontend estará publicado en su propia URL (ej: `https://boda-planner-frontend.onrender.com`).

---

## Paso 4: Verificación y Creación del Usuario Administrador

1. Una vez desplegados ambos servicios, abre la URL de tu frontend en el navegador.
2. Ingresa a la ruta `/login` (ej: `https://boda-planner-frontend.onrender.com/login`).
3. Ingresa con el correo y contraseña que configuraste en `APP_ADMIN_EMAIL` y `APP_ADMIN_PASSWORD`.
4. ¡Listo! Ya estás dentro del panel de administración del gestor de boda, conectado a tu base de datos Neon.

---

## Resolucion de Dudas Frecuentes

### ¿El plan gratuito de Render "duerme" el servicio?
Sí, en el plan gratuito de Render, si el backend pasa 15 minutos sin recibir visitas, entra en modo de reposo. Cuando alguien entra a la web, la primera petición tardará unos 30-50 segundos en despertar el servidor Java, y luego funcionará con total rapidez. Esto es completamente normal en el plan gratuito de Render.

### ¿Qué pasa si la base de datos de Neon se suspende por inactividad?
Neon también apaga los recursos tras unos minutos de inactividad para no consumir cuotas. Hemos configurado el backend (`DataSourceConfig.java`) para que reconecte automáticamente en cuanto reciba una petición, reactivando la base de datos en 1 o 2 segundos de forma transparente.
