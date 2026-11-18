# Utilizar Node.js 24
FROM node:24-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar únicamente dependencias de producción
RUN npm ci --omit=dev

# Copiar el código del proyecto
COPY . .

# Puerto de la aplicación
EXPOSE 10000

# Iniciar el servidor
CMD ["npm", "start"]