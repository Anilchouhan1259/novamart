# Stage 1: Build the Spring Boot Application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime Container
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the executable jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose standard port
EXPOSE 8080

# Run with container-friendly memory settings
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
