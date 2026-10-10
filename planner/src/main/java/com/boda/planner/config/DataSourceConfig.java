package com.boda.planner.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String springUrl;

    @Value("${spring.datasource.username:}")
    private String springUsername;

    @Value("${spring.datasource.password:}")
    private String springPassword;

    @Value("${DATABASE_URL:}")
    private String envDatabaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Render o Neon suelen definir DATABASE_URL
        String rawUrl = (envDatabaseUrl != null && !envDatabaseUrl.isBlank()) ? envDatabaseUrl.trim() : springUrl.trim();
        String username = springUsername != null ? springUsername.trim() : "";
        String password = springPassword != null ? springPassword.trim() : "";

        String jdbcUrl = rawUrl;

        // Si la URL viene en formato postgresql:// o postgres:// (estilo Neon/Heroku/Render)
        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            log.info("Detectada URL de conexión PostgreSQL estándar (Neon/Render). Normalizando a formato JDBC...");
            try {
                // E.g. postgresql://user:password@host:port/database?sslmode=require
                URI uri = URI.create(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    // Las credenciales incrustadas en la URL de Neon tienen prioridad total
                    username = credentials[0];
                    password = credentials[1];
                }

                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath(); // /neondb
                String query = uri.getQuery();

                StringBuilder builder = new StringBuilder();
                builder.append("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path);

                if (query != null && !query.isBlank()) {
                    builder.append("?").append(query);
                } else {
                    builder.append("?sslmode=require");
                }

                jdbcUrl = builder.toString();
            } catch (Exception e) {
                log.warn("No se pudo parsear como URI estricta, aplicando conversión directa: {}", e.getMessage());
                if (rawUrl.startsWith("postgres://")) {
                    jdbcUrl = "jdbc:postgresql://" + rawUrl.substring("postgres://".length());
                } else {
                    jdbcUrl = "jdbc:postgresql://" + rawUrl.substring("postgresql://".length());
                }
            }
        }

        if (username.isEmpty() && jdbcUrl.contains("localhost")) {
            username = "alexander";
            password = "admin";
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        if (!username.isEmpty()) {
            config.setUsername(username);
        }
        if (!password.isEmpty()) {
            config.setPassword(password);
        }
        config.setDriverClassName("org.postgresql.Driver");

        // Optimizaciones para PostgreSQL Serverless (Neon)
        // Neon pausa la base de datos tras inactividad; estas configuraciones previenen desconexiones y conexiones zombies
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000); // 5 minutos
        config.setMaxLifetime(600000);  // 10 minutos
        config.setConnectionTimeout(30000); // 30 segundos
        config.setConnectionTestQuery("SELECT 1");

        log.info("HikariCP DataSource inicializado con URL: {}", jdbcUrl.replaceAll(":[^/@]+@", ":***@"));
        return new HikariDataSource(config);
    }
}
