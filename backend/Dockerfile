# Base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy and install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:dev"]