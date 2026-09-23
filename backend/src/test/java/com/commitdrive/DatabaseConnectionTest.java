package com.commitdrive;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseConnectionTest {

    public static void main(String[] args) {
        System.out.println("=== Testing Supabase PostgreSQL Connection ===");

        // 1. Try loading from current dir or backend dir
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        if (dotenv.get("SUPABASE_DB_URL") == null) {
            dotenv = Dotenv.configure().directory("./backend").ignoreIfMissing().load();
        }

        String url = dotenv.get("SUPABASE_DB_URL");
        String user = dotenv.get("SUPABASE_DB_USER");
        String password = dotenv.get("SUPABASE_DB_PASSWORD");

        if (url == null || user == null || password == null) {
            System.err.println("ERROR: Missing SUPABASE environment variables in .env!");
            System.exit(1);
        }

        System.out.println("Connecting to URL: " + url);
        System.out.println("Connecting with User: " + user);

        try {
            Class.forName("org.postgresql.Driver");
            try (Connection conn = DriverManager.getConnection(url, user, password)) {
                System.out.println("SUCCESS: Connected to Supabase PostgreSQL database!");

                try (Statement stmt = conn.createStatement()) {
                    // Check version
                    try (ResultSet rs = stmt.executeQuery("SELECT version(), current_database(), current_user")) {
                        if (rs.next()) {
                            System.out.println("PostgreSQL Version: " + rs.getString(1));
                            System.out.println("Current Database:   " + rs.getString(2));
                            System.out.println("Current User:       " + rs.getString(3));
                        }
                    }

                    // Check users table count and records
                    try (ResultSet rs = stmt.executeQuery("SELECT count(*), max(created_at) FROM users")) {
                        if (rs.next()) {
                            System.out.println("Total Registered Users in Supabase: " + rs.getInt(1));
                            System.out.println("Latest Registration Timestamp:     " + rs.getString(2));
                        }
                    }

                    try (ResultSet rs = stmt.executeQuery("SELECT id, email, full_name, role, target_year, streak FROM users LIMIT 5")) {
                        System.out.println("Sample Users in DB:");
                        while (rs.next()) {
                            System.out.println(String.format(" - ID: %s | %s (%s) | Role: %s | Target: %s | Streak: %d",
                                rs.getString("id"),
                                rs.getString("email"),
                                rs.getString("full_name"),
                                rs.getString("role"),
                                rs.getString("target_year"),
                                rs.getInt("streak")
                            ));
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("CONNECTION FAILED: " + e.getMessage());
            e.printStackTrace();
            System.exit(2);
        }
    }
}
