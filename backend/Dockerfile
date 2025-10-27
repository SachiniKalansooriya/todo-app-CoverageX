FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install only production dependencies inside the backend image to avoid building native dev deps
# (sqlite3 and other build-time packages) which require python/build tools in the container.
RUN npm ci --omit=dev
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]
