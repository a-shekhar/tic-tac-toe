# ===== BUILD STAGE =====
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache deps first
COPY pom.xml .
RUN mvn -q -B -e -DskipTests dependency:go-offline

# Now add sources and build
COPY src ./src
RUN mvn -q -B -e -DskipTests package

# ===== RUNTIME STAGE =====
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the fat jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# (Optional) JVM tuning for containers (21 already respects cgroup limits)
ENV JAVA_OPTS=""

EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
