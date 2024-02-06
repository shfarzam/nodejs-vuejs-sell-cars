# Use the official Node.js image as a base image
FROM node:14 AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Vue.js application
RUN npm run build

# Use a lightweight Nginx image as the production image
FROM nginx:alpine

# Copy the built Vue.js app from the build stage to the nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE ${PORT}

# Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
