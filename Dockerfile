FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install || true
COPY . .
RUN npx prisma generate || true
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy || true && npm run db:seed || true && npm run dev"]
