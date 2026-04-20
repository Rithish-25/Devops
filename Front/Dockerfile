# Stage 1: Build React app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build arguments for environment variables
ARG REACT_APP_EMAILJS_SERVICE_ID
ARG REACT_APP_EMAILJS_TEMPLATE_ID
ARG REACT_APP_EMAILJS_PUBLIC_KEY

# Set them as environment variables for the build process
ENV REACT_APP_EMAILJS_SERVICE_ID=$REACT_APP_EMAILJS_SERVICE_ID
ENV REACT_APP_EMAILJS_TEMPLATE_ID=$REACT_APP_EMAILJS_TEMPLATE_ID
ENV REACT_APP_EMAILJS_PUBLIC_KEY=$REACT_APP_EMAILJS_PUBLIC_KEY

# Build the application
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:stable-alpine

# Copy the built files from Stage 1 into Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (since Nginx listens on 80 by default)
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
