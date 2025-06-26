# Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
# Copy frontend build into backend
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 4000
CMD ["node", "index.js"]
