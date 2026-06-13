FROM node:22.14.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM node:22.14.0

RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/dist /app/dist

CMD ["serve", "-s", "dist/WeatherAxe/browser", "-l", "3000"]
