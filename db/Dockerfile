# One-shot job for local Docker Compose: apply migrations, then load content/*.json.
FROM node:24-alpine
WORKDIR /app
COPY db/package.json db/package-lock.json db/
RUN npm ci --prefix db --omit=dev
COPY content/ content/
COPY db/ db/
CMD ["sh", "-c", "node db/migrate.mjs && node db/seed.mjs"]
