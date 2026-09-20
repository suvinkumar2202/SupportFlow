package com.supportflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class SupportFlowApplication {

    public static void main(String[] args) {
        loadEnv();
        SpringApplication.run(SupportFlowApplication.class, args);
    }

    private static void loadEnv() {
        // Search for .env in multiple candidate locations so the backend can be
        // started from any working directory (IDE, project root, backend dir, etc.)
        Path[] candidates = {
            Paths.get(".env"),
            Paths.get("backend/.env"),
            Paths.get("../.env"),
            Paths.get("../backend/.env"),
            Paths.get("../../.env"),
            Paths.get("../../backend/.env")
        };

        boolean envLoaded = false;
        for (Path envPath : candidates) {
            if (Files.exists(envPath) && Files.isRegularFile(envPath)) {
                try {
                    List<String> lines = Files.readAllLines(envPath);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) continue;
                        int eqIdx = line.indexOf("=");
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"")) {
                                value = value.substring(1, value.length() - 1);
                            } else if (value.startsWith("'") && value.endsWith("'")) {
                                value = value.substring(1, value.length() - 1);
                            }
                            System.setProperty(key, value);
                            System.setProperty("env." + key, value);
                        }
                    }
                    System.out.println(".env loaded from: " + envPath.toAbsolutePath().normalize());
                    envLoaded = true;
                    break;
                } catch (IOException e) {
                    System.err.println("Could not load .env file from " + envPath + ": " + e.getMessage());
                }
            }
        }

        // Fallback: copy critical values from OS environment variables
        copyEnvIfMissing("JWT_SECRET");
        copyEnvIfMissing("DB_PATH");
        copyEnvIfMissing("PORT");
        copyEnvIfMissing("JWT_EXPIRATION");

        if (!envLoaded) {
            System.err.println("WARNING: .env file not found. Relied on system environment variables.");
            System.err.println("TIP: Create a .env file from .env.example in the backend directory.");
        }
    }

    private static void copyEnvIfMissing(String key) {
        if (System.getProperty(key) == null) {
            String value = System.getenv(key);
            if (value != null) {
                System.setProperty(key, value);
            }
        }
    }
}
