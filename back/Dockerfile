# 1단계: Build
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

COPY build.gradle* settings.gradle* gradlew gradle/ ./
RUN ./gradlew build -x test || true  # 의존성 캐시 유도

COPY . .
RUN ./gradlew build -x test

# 2단계: Run!!!!
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/build/libs/app.jar app.jar
RUN test -f app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
