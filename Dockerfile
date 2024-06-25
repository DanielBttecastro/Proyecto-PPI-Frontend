# Usa una imagen de Node.js como base
FROM node:latest

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si exist) al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyect
RUN npm install

# Copia el resto de los archivos al directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará dentro del contenedor (si es necesario)
EXPOSE 3000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["npm", "start"]
