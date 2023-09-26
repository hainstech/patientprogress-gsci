# Use an official Node.js runtime as the base image
FROM node:16

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Copy all app source code to the container
COPY . .

# Define the command to run your application
CMD [ "node", "server.js" ]
