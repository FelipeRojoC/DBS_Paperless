# 🚀 DBS Paperless - Sistema Integral

Bienvenido al repositorio oficial de DBS Paperless. Este sistema digitaliza los formularios de operaciones (R3, R7, AST) y gestiona el flujo de trabajo entre técnicos y supervisores.

---

## 🛠️ Arquitectura

*   **Frontend**: React + Vite + TailwindCSS (Carpeta `/client`)
*   **Backend**: Node.js + Express + JWT (Carpeta `/server`)
*   **Base de Datos**: PostgreSQL (Gestionada con Docker)

---

## 💻 Guía de Instalación Local

### 1. Iniciar Base de Datos 🐳
(Requiere Docker Desktop instalado)
```bash
cd server
docker-compose up -d
```
*Si no tienes Docker, instala PostgreSQL localmente, crea una BD llamada `dbs_paperless` y ejecuta el script `server/init.sql`.*

### 2. Configurar Backend ⚙️
```bash
cd server
npm install
node seed.js    # Carga usuarios y roles de prueba
node index.js   # Inicia el servidor en http://localhost:3000
```

### 3. Configurar Frontend 🎨
En una **nueva terminal**:
```bash
cd client
npm install
npm run dev
```
*   Abre el navegador en `http://localhost:5173`.
*   **Usuario Prueba**: `mecanico.especialista@example.com`
*   **Contraseña**: `password123`

---

## 📡 API Endpoints & Postman

Para probar en Postman, configura una colección con la variable `{{url}}` = `http://localhost:3000/api`.

### 1. Login (Obtener Token) 🔑
*   **Método**: `POST`
*   **URL**: `http://localhost:3000/api/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "mecanico.especialista@example.com",
      "password": "password123"
    }
    ```
*   **Respuesta**: Copia el `token` para usarlo en las siguientes peticiones (Authorization: Bearer <token>).

### 2. Registro (Crear Usuario) 👤
*   **Método**: `POST`
*   **URL**: `http://localhost:3000/api/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "email": "nuevo.usuario@dbs.com",
      "password": "password123",
      "full_name": "Pedro Pérez",
      "role": "Soldador"
    }
    ```

### 3. Enviar Formulario 📝
*   **Método**: `POST`
*   **URL**: `http://localhost:3000/api/forms`
*   **Headers**: `Authorization: Bearer TU_TOKEN_AQUI`
*   **Body (JSON)**:
    ```json
    {
      "technician_id": "ID_DEL_USUARIO", 
      "form_data": {
          "title": "Mantenimiento Preventivo",
          "area": "Mecánica",
          "risks": [
              {"description": "Ruido excesivo", "severity": "Alta", "control": "Uso de orejeras"}
          ]
      }
    }
    ```

### 4. Ver Mis Formularios 📋
*   **Método**: `GET`
*   **URL**: `http://localhost:3000/api/forms`
*   **Headers**: `Authorization: Bearer TU_TOKEN_AQUI`

---

## 🌍 Guía de Despliegue (Hosting)

Para llevar este proyecto a producción (Internet), te recomiendo esta arquitectura moderna y económica:

### 1. Base de Datos (La Nube) ☁️
No uses Docker en producción si no tienes un VPS propio. Usa un servicio gestionado.
*   **Opción A (Recomendada)**: **Railway** o **Supabase** (Postgres Gratis).
    1.  Crea una cuenta en Railway/Supabase.
    2.  Crea un nuevo proyecto PostgreSQL.
    3.  Obtén la `CONNECTION_STRING` (ej: `postgres://user:pass@host:5432/db`).
    4.  Copia y pega el contenido de `server/init.sql` en la consola SQL de la nube para crear las tablas.

### 2. Backend (Servidor Node) ⚙️
*   **Recomendado**: **Railway** o **Render**.
    1.  Sube tu carpeta `/server` a GitHub.
    2.  Conecta tu repo a Railway/Render.
    3.  Configura las Variables de Entorno:
        *   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc. (Usa los datos del paso 1).
        *   `JWT_SECRET`: Crea una clave segura.

### 3. Frontend (Cliente React) 🎨
*   **Recomendado**: **Vercel** o **Netlify**.
    1.  Sube tu carpeta `/client` a GitHub.
    2.  Importa el proyecto en Vercel.
    3.  **Importante**: Antes de subir, edita `client/src/services/api.js`.
        *   Cambia `const API_URL = 'http://localhost:3000/api';`
        *   Por la URL real de tu backend (ej: `https://mi-api-dbs.up.railway.app/api`).

### 4. Dominio (Opcional) 🌐
*   Compra tu dominio (ej: `dbspaperless.com`) en **Namecheap** o **GoDaddy**.
*   En Vercel, ve a Settings > Domains y añade tu dominio.
*   Configura los registros DNS según te indique Vercel.

---

### Mantenimiento
Para reiniciar todo desde cero en local (borrar datos):
```bash
docker-compose down -v
docker-compose up -d
node server/seed.js
```
