package com.chitfund.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.sql.*;

@Service
public class AdminService {

    private static final String DB_URL = "jdbc:sqlite:/app/chitfund.db";

    @PostConstruct
    public void initDatabase() {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            Statement stmt = conn.createStatement();

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS AdminCredentials (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstname TEXT NOT NULL,
                    lastname TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            """);

            stmt.execute("""
                INSERT OR IGNORE INTO AdminCredentials (firstname, lastname, email, password)
                VALUES ('Pavanagundla', 'Jayanth', 'pavanagundlajayanth0706@gmail.com', 'Jayanth@143')
            """);

            stmt.execute("""
                INSERT OR IGNORE INTO AdminCredentials (firstname, lastname, email, password)
                VALUES ('Pandu', 'Chary', 'panduchary779933@gmail.com', 'Pandu@143')
            """);

            System.out.println("Database initialized successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean validateAdmin(String email, String password) {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            String sql = "SELECT * FROM AdminCredentials WHERE email = ? AND password = ?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}