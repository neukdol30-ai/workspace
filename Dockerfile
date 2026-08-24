FROM eclipse-temurin:25-jdk AS builder

WORKDIR /workspace

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew bootJar --no-daemon


FROM eclipse-temurin:25-jre

WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system workspace \
    && useradd \
        --system \
        --uid 1001 \
        --gid workspace \
        workspace

COPY \
    --from=builder \
    --chown=workspace:workspace \
    /workspace/build/libs/*.jar \
    /app/workspace-api.jar

USER workspace

EXPOSE 8080

EXPOSE 8080

HEALTHCHECK \
    --interval=10s \
    --timeout=5s \
    --start-period=30s \
    --retries=5 \
    CMD curl --fail --silent http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/workspace-api.jar"]

ENTRYPOINT ["java", "-jar", "/app/workspace-api.jar"]