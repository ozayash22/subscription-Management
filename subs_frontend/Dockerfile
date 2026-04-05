# ---------- BUILD STAGE ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Build app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]