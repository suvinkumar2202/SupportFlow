FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY supportflow/backend/mvnw .

COPY supportflow/backend/.mvn .mvn

COPY supportflow/backend/pom.xml .

COPY supportflow/backend/src src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/supportflow-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]