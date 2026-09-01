# Stage 1: Build the Angular project
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the project for production
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular files to the Nginx html directory
# Note: In newer Angular versions, the build output is placed in the 'browser' directory.
# If the 'browser' directory doesn't exist in your output, remove '/browser' from the line below.
COPY --from=build /app/dist/research-vault-ui/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]