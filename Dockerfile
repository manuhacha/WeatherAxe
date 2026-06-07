FROM node:22.14.0

WORKDIR /app

# Copiar dependencias primero (mejor cache)
COPY package*.json ./

RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Build de Angular (producción)
RUN npm run build -- --configuration production

# Servir app con un servidor simple
RUN npm install -g serve

# Cambia "your-app-name" por el nombre real en angular.json (dist/)
CMD ["serve", "-s", "dist/WeatherAxe", "-l", "3000"]