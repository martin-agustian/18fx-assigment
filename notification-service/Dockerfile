# Gunakan Node versi 18
FROM node:18

# Set direktori kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Build aplikasi NestJS
RUN npm run build

# Jalankan app
CMD ["node", "dist/main"]
