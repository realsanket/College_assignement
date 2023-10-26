# Use an official Node.js runtime as a parent image
FROM node:14

RUN apt-get update && apt-get install -y ffmpeg
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install any needed dependencies specified in the package.json
RUN npm install

# Bundle your app source code into the container
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "app.js"]
