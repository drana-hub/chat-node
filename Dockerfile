# Use the official Ubuntu base image
FROM ubuntu:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Node.js, npm, and git
RUN apt-get update && \
    apt-get install -y nodejs npm git

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Command to run the app
CMD ["npm", "start"]
