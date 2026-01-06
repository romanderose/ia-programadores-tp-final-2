# Proyecto de Gestión de Mascotas

Este repositorio contiene el código fuente del trabajo final de IA para Programadores.

## Estructura de Carpetas

- **app-de-gestion-de-mascotas/**: Contiene el código fuente de la aplicación.
  - **backend/**: API REST desarrollada con Node.js y Express.
  - **frontend/**: Interfaz de usuario desarrollada con React y Vite.

## Instalación de Dependencias

Es necesario instalar las dependencias tanto en el backend como en el frontend.

### Backend
```bash
cd app-de-gestion-de-mascotas/backend
npm install
```

### Frontend
```bash
cd app-de-gestion-de-mascotas/frontend
npm install
```

## Ejecución del Proyecto

Para correr el proyecto, se deben ejecutar ambos servicios (idealmente en terminales separadas).

### Iniciar Backend
Desde la carpeta `backend`:
```bash
npm run dev
```
El servidor correrá en el puerto configurado (por defecto suele ser 3000 o 3001).

### Iniciar Frontend
Desde la carpeta `frontend`:
```bash
npm run dev
```
Configuración para Despliegue (Deploy)

Este proyecto ha sido preparado para ser desplegado en plataformas como Render, Railway o Vercel.

### Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en producción, configure las siguientes variables de entorno en su servicio de hosting:

**Backend:**
- `PORT`: El puerto donde correrá el servidor (generalmente asignado automáticamente por el hosting).
- (Otras variables ya existentes como credenciales de DB deben mantenerse).

**Frontend:**
- `VITE_API_URL`: La URL completa de su backend desplegado (ej: `https://mi-backend.onrender.com/api`).
  *Nota: Si su backend se despliega en una URL raíz diferente, asegúrese de incluir `/api` al final si así lo requieren sus rutas.*

### Scripts de Ejecución en Producción

**Backend:**
- Comando de Start: `npm start`
- Comando de Build: No requiere (Node.js nativo).

**Frontend:**
- Comando de Build: `npm run build`
- Comando de Start: Dependerá del servicio de hosting (generalmente se sirven los archivos estáticos de la carpeta `dist`).
