package com.commitdrive;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CommitDriveApplication {

    public static void main(String[] args) {
        // Automatically load .env file into JVM System Properties if present
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        if (dotenv.entries().isEmpty()) {
            dotenv = Dotenv.configure().directory("./backend").ignoreIfMissing().load();
        }
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        SpringApplication.run(CommitDriveApplication.class, args);
    }
}

