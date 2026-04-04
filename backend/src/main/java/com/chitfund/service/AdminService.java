package com.chitfund.service;

import org.springframework.stereotype.Service;

import java.sql.*;
import java.nio.file.*;

@Service
public class AdminService {

    private static final String DB_URL;

    static {
        String projectRoot = Paths.get(System.getProperty("user.dir"))
                                  .getParent()
                                  .toString();
        String dbPath = projectRoot + "/database/chitfund.db";
        DB_URL = "jdbc:sqlite:" + dbPath;
        System.out.println("✅ DB Path: " + dbPath); 
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