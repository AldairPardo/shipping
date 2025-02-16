# 📦 API de Paquetería

Este repositorio contiene la API de paquetería desarrollada con **Express** y **TypeScript**, siguiendo los principios de **Clean Architecture**. La API permite la gestión de envíos, rastreo de paquetes y autenticación de usuarios.

## Tecnologías Utilizadas

- **Framework:** Express
- **Lenguaje:** TypeScript
- **Base de Datos:** MySQL
- **Caching:** Redis
- **Autenticación y Seguridad:** JWT
- **Patrón de Arquitectura:** Clean Architecture
- **Documentación:** Swagger
- **Geolocalización:** node-geocoder

## Instalación y Configuración

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18+)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)

### Clonar el Repositorio

```bash
  git clone https://github.com/AldairPardo/shipping.git
  cd shipping
```

### Instalar Dependencias

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
  npm install
```

### Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=paqueteria
JWT_SECRET=tu_secreto_jwt
REDIS_HOST=localhost
REDIS_PORT=6379
GEOCODER_PROVIDER_NAME=XXXXX
GEOCODER_API_KEY=XXXXX
```

Si estás utilizando Docker, puedes modificar estas variables según tu configuración.

## Ejecución del Proyecto

### Compilar el Proyecto
Si estás utilizando TypeScript, primero compila el código con:

```bash
  npm run build
```

### Ejecutar en Modo Desarrollo
Para correr la API en modo desarrollo con recarga automática:

```bash
  npm run dev
```

### Ejecutar en Producción
Para ejecutar la API en producción:

```bash
  npm start
```

## 📖 Documentación con Swagger

La documentación de la API está disponible en:

```
http://localhost:{PORT}/api-docs
```