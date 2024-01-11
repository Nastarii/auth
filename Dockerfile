FROM node:20.10.0-alpine3.18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nodemon Globally
RUN npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY . .