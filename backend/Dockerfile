FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/index.js" ]
