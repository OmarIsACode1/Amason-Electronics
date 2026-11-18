# Amason Electronics

Aplicación web para la gestión de productos de una tienda de electrónica. Permite a los usuarios registrarse, iniciar sesión y administrar sus propios productos mediante operaciones CRUD (crear, consultar, actualizar y eliminar).

La aplicación utiliza autenticación mediante JWT, almacenamiento de datos en MongoDB Atlas y un pipeline de integración continua con GitHub Actions.

## 1. Tecnologías utilizadas

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** Node.js y Express.
- **Base de datos:** MongoDB Atlas.
- **ODM:** Mongoose.
- **Autenticación:** JSON Web Token (JWT).
- **Encriptación de contraseñas:** bcryptjs.
- **Pruebas automatizadas:** Jest y Supertest.
- **Contenedores:** Docker.
- **Integración continua:** GitHub Actions.
- **Despliegue:** Render.

## 2. Funcionalidades principales

- Registro de nuevos usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante tokens JWT.
- Registro de productos.
- Consulta de productos.
- Edición de productos existentes.
- Eliminación de productos.
- Protección de rutas mediante autenticación.
- Asociación de productos con el usuario que los registra.
- Restricción de acceso para que cada usuario administre únicamente sus propios productos.

## 3. Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js (versión 24 o compatible).
- npm.
- Una cuenta y una base de datos configurada en MongoDB Atlas.

Para ejecutar la aplicación mediante contenedores también se necesita Docker.

## 4. Instalación del proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/OmarIsACode1/Amason-Electronics.git
   ```

2. Entrar a la carpeta del proyecto:

   ```bash
   cd Amason-Electronics
   ```

3. Instalar las dependencias:

   ```bash
   npm ci
   ```

## 5. Configuración de variables de entorno

En la carpeta principal del proyecto se debe crear un archivo llamado `.env`.

Agregar las siguientes variables:

```env
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
```

**Importante:** Los valores deben sustituirse por las credenciales correspondientes. El archivo `.env` contiene información sensible y no debe subirse al repositorio de GitHub.

En el entorno de producción, estas variables se configuran desde los ajustes del servicio en Render.

## 6. Ejecución local

Una vez instaladas las dependencias y configuradas las variables de entorno, ejecutar:

```bash
npm start
```

El servidor se iniciará utilizando el puerto configurado en el entorno o el puerto 3000 por defecto.

Abrir la siguiente dirección en el navegador:

http://localhost:3000/login.html

## 7. Ejecución mediante Docker

Primero, asegurarse de tener Docker instalado y el archivo `.env` configurado en la carpeta principal.

### Construir la imagen

```bash
docker build -t amason-electronics .
```

### Crear e iniciar el contenedor

```bash
docker run --name amason-electronics-app --env-file .env -p 3000:3000 amason-electronics
```

### Acceder a la aplicación

Abrir en el navegador:

http://localhost:3000/login.html

### Detener el contenedor

```bash
docker stop amason-electronics-app
```

### Eliminar el contenedor

```bash
docker rm amason-electronics-app
```

## 8. Ejecución de pruebas automatizadas

El proyecto utiliza Jest y Supertest para verificar el funcionamiento de la autenticación y las operaciones de productos.

Para ejecutar las pruebas:

```bash
npm test
```

La suite de pruebas contempla el registro, inicio de sesión, validación de credenciales, protección de rutas y operaciones CRUD de productos.

El proyecto cuenta con **13 pruebas automatizadas** distribuidas en dos suites.

## 9. Pipeline de CI/CD

El proyecto utiliza GitHub Actions para automatizar la ejecución de pruebas.

El archivo de configuración se encuentra en:

`.github/workflows/ci.yml`

El pipeline se ejecuta cuando se realiza un `push` o se crea un `pull request` dirigido a la rama `main`.

### Flujo de integración y despliegue

1. Se realiza un cambio en el código y se envía al repositorio de GitHub.
2. GitHub Actions descarga el repositorio.
3. Se configura el entorno de Node.js.
4. Se instalan las dependencias.
5. Se ejecutan las pruebas automatizadas mediante `npm test`.
6. Render espera a que las verificaciones de CI finalicen correctamente.
7. Si las verificaciones son satisfactorias, Render realiza el despliegue de la aplicación.

Este proceso permite comprobar el funcionamiento del proyecto antes de publicar los cambios en producción.

## 10. Aplicación desplegada

La aplicación se encuentra desplegada en Render y utiliza MongoDB Atlas como servicio de base de datos.

**Enlace de la aplicación:**

https://amason-electronics.onrender.com

## 11. Repositorio

**GitHub:** [AGREGAR AQUÍ EL ENLACE DEL REPOSITORIO]

El repositorio contiene el código fuente, los modelos, controladores, rutas, archivos de configuración, pruebas automatizadas y el archivo del pipeline de CI/CD.

---

**Proyecto académico:** Amason Electronics  
**Materia:** Desarrollo Full Stack