FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /workspace/analysis-service

COPY analysis-service/pom.xml ./pom.xml
RUN mvn --batch-mode dependency:go-offline

COPY analysis-service/src ./src
COPY data /workspace/data

RUN mvn --batch-mode package

FROM eclipse-temurin:21-jre-jammy

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 appuser \
    && useradd --uid 10001 --gid appuser --create-home appuser

WORKDIR /app

COPY --from=builder /workspace/analysis-service/target/*.jar ./analysis-service.jar
COPY --chown=appuser:appuser data/House_Price_Dataset.csv ./data/House_Price_Dataset.csv

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/analysis-service.jar"]
