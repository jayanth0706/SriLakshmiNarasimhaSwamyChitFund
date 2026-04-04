package com.chitfund.controller;

import com.chitfund.model.Admin;
import com.chitfund.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ✅ Handle preflight (VERY IMPORTANT)
    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    // ✅ Actual login
    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {

        boolean isValid = adminService.validateAdmin(
                admin.getEmail(),
                admin.getPassword()
        );

        return isValid ? "Login Success" : "Invalid Credentials";
    }
}