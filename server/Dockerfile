FROM node:20-slim

WORKDIR /app

# Copy package.json files and install both dependencies and devDependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally (optional but common for dev inside Docker)
RUN npm install -g nodemon

# Copy the rest of the server code
COPY . .

# Expose the backend port
EXPOSE 5000

# Use nodemon for development
CMD ["nodemon", "server.js"]
