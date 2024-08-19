# Välj en basbild från Docker Hub
FROM node:16-alpine

# Ange arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och installera beroenden
COPY package.json package-lock.json ./
RUN npm install

# Kopiera resten av applikationen
COPY . .

# Bygg applikationen
RUN npm run build

# Exponera porten applikationen kommer att köras på
EXPOSE 3000

# Starta applikationen
CMD ["npm", "start"]
