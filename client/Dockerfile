# Use official Node image (slim is fine for React dev)
FROM node:20-slim

# Set working directory inside the container
WORKDIR /app

# Copy only the package metadata first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app
COPY . .

# Expose the port that Vite dev server runs on
EXPOSE 5173

# Start Vite in development mode and expose it to the network
CMD ["npm", "run", "dev", "--", "--host"]
