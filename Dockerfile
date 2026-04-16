# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy package files first for better caching
COPY frontend/package*.json ./
RUN npm install
# Copy rest of frontend files
COPY frontend/ ./
# Build the frontend (outputs to ../dist as per vite.config.js)
RUN npm run build

# --- Stage 2: Build Backend ---
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder
WORKDIR /app
# Copy pom.xml and source
COPY pom.xml .
COPY src ./src
# Copy the frontend 'dist' output into Spring Boot's static resources
COPY --from=frontend-builder /app/dist ./src/main/resources/static
# Build the JAR
RUN mvn clean package -DskipTests

# --- Stage 3: Final Runtime ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the built JAR from stage 2
COPY --from=backend-builder /app/target/*.jar app.jar
# Expose port (Render uses PORT env variable, Spring Boot uses server.port)
EXPOSE 8080
# Run the app, mapping Render's PORT to Spring's port if provided
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
