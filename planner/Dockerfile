# ==========================================
# Fase 1: Compilación (Build)
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos el archivo de configuración de dependencias
COPY pom.xml .

# Descargamos dependencias para aprovechar la caché de capas de Docker
RUN mvn dependency:go-offline -B || true

# Copiamos el código fuente y generamos el JAR omitiendo pruebas unitarias de conexión local
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Fase 2: Imagen final de ejecución (Runtime)
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Crear usuario y grupo sin privilegios de root por seguridad
RUN groupadd -r spring && useradd -r -g spring spring

# Crear directorio para subida de fotos y canciones
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Copiar el artefacto JAR empaquetado
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar

USER spring:spring

# Puerto por defecto (Render inyecta PORT dinámicamente)
EXPOSE 8080

ENV PORT=8080
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
