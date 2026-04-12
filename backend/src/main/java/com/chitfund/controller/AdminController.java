package com.chitfund.controller;

import com.chitfund.model.Admin;
import com.chitfund.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")         // ← ADD THIS
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        boolean isValid = adminService.validateAdmin(
                admin.getEmail(),
                admin.getPassword()
        );

        if (isValid) {
            return ResponseEntity.ok("Login Success");           // 200 → navigate
        } else {
            return ResponseEntity.status(401).body("Invalid Credentials");  // 401 → alert
        }
    }
}