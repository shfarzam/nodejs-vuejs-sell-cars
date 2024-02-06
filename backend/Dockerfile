# Use an official Node runtime as a parent image
FROM node:20
# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents to /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE ${BACKEND_PORT:-3000}

# Define environment variable
#ENV NODE_ENV=production

# Run server.js when the container launches
CMD ["npm","run", "start"]
