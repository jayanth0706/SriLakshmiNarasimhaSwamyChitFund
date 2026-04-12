FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN mkdir -p /app/database
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
COPY database/admin.db /app/database/admin.db
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]