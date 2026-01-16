# 📄 DBS Paperless Backend

Bienvenido al servidor backend para la gestión de formularios y flujos de trabajo de DBS Paperless.

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener todo funcionando en minutos.

### 1️⃣ Requisitos Previos
Necesitas tener instalado:
*   🟢 **Node.js** (v18 o superior)
*   🐳 **Docker** y **Docker Compose** (Recomendado para la base de datos)

### 2️⃣ Instalación
Abre una terminal en la carpeta `server` e instala las dependencias:
```bash
npm install
```

### 3️⃣ Base de Datos (PostgreSQL)
La forma más fácil es usar Docker. Esto creará la base de datos y cargará las tablas automáticamente.
```bash
docker-compose up -d
```
*   Esto iniciará Postgres en el puerto `5432`.
*   También inicia **pgAdmin** en `http://localhost:5050` (Usuario: `admin@admin.com`, Clave: `admin`).

### 4️⃣ Cargar Datos de Prueba (Seed) 🌱
Una vez que la base de datos esté corriendo, carga los usuarios y roles iniciales:
```bash
node seed.js
```
*   ✅ Esto creará usuarios para cada rol (ej: `mecanico.especialista@example.com`).
*   🔑 La contraseña para todos es: `password123`.

### 5️⃣ Iniciar el Servidor ⚡
Levanta la API:
```bash
node index.js
```
*   El servidor estará disponible en: `http://localhost:3000`.

### 6️⃣ Verificar que todo funciona ✅
Con el servidor corriendo (paso 5), abre otra terminal y ejecuta el script de prueba automática:
```bash
node scripts/test_api.js
```
*   Esto probará el registro, inicio de sesión y envío de formularios automáticamente.

---

## 🛠️ Solución de Problemas
*   **Error de conexión a BD**: Verifica que Docker esté corriendo (`docker ps`).
*   **Puertos ocupados**: Asegúrate de que no tengas otro Postgres corriendo en el puerto 5432.
*   **Variables de Entorno**: Revisa el archivo `.env` si necesitas cambiar contraseñas o puertos.
