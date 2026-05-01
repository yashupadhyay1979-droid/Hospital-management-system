FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Make sure mvnw is executable
RUN chmod +x ./mvnw
# Download dependencies
RUN ./mvnw dependency:go-offline

COPY src ./src
# Build the application
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# HL7 Port
EXPOSE 2575 
ENTRYPOINT ["java", "-jar", "app.jar"]
