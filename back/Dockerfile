FROM openjdk:17-jdk-slim

WORKDIR /app
COPY bulid/libs/*.jar app.jar

EXPOSE 8091
ENTRYPOINT ["java", "-jar", "app.jar"]
