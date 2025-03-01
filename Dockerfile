# 1. dependancies
FROM node:lts AS dependencies

# Set working directory
WORKDIR /app

# install dependencies from package files
COPY package.json package-lock.json ./
RUN npm ci --production

FROM dependencies AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . /app

ENV PORT=3000

RUN npm run build

# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

