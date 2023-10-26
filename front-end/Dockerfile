# Use a smaller base image for the build environment
FROM node:alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy only the necessary files to the container
COPY package*.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build --prod

# Use a smaller base image for the production environment
FROM nginx:alpine

# Copy the built application to the nginx directory
COPY --from=build /app/dist/front-end /usr/share/nginx/html

# Set environment variables for the API endpoint URL and API key
ENV API_ENDPOINT_URL=https://api.example.com
ENV API_KEY=your-api-key

# Expose port 80 for the nginx server
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]