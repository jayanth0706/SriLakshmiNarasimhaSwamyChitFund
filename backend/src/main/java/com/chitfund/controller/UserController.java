package com.chitfund.controller;

import com.chitfund.model.UserData;
import com.chitfund.repository.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    @Value("${resend.api-key}")
    private String resendApiKey;

    // Base URL used in the verification email link (set in application.properties)
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // ── POST /users/signup ─────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserData user) {
        try {
            // ── Validation ──────────────────────────────────────────────────
            if (user.getFirstName() == null || user.getFirstName().isBlank())
                return ResponseEntity.badRequest().body("First name is required.");
            if (!user.getFirstName().matches("[a-zA-Z]+"))
                return ResponseEntity.badRequest().body("First name must contain letters only.");
            if (user.getFirstName().length() > 50)
                return ResponseEntity.badRequest().body("First name must be 50 characters or less.");

            if (user.getLastName() == null || user.getLastName().isBlank())
                return ResponseEntity.badRequest().body("Last name is required.");
            if (!user.getLastName().matches("[a-zA-Z]+"))
                return ResponseEntity.badRequest().body("Last name must contain letters only.");
            if (user.getLastName().length() > 50)
                return ResponseEntity.badRequest().body("Last name must be 50 characters or less.");

            if (user.getUserName() == null || user.getUserName().isBlank())
                return ResponseEntity.badRequest().body("Username is required.");
            if (!user.getUserName().matches("[a-zA-Z0-9_]+"))
                return ResponseEntity.badRequest().body("Username may only contain letters, numbers, and underscores.");
            if (user.getUserName().length() > 30)
                return ResponseEntity.badRequest().body("Username must be 30 characters or less.");

            if (user.getEmail() == null || user.getEmail().isBlank())
                return ResponseEntity.badRequest().body("Email is required.");
            if (!user.getEmail().matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
                return ResponseEntity.badRequest().body("Invalid email format.");

            if (user.getMobileNumber() == null || !user.getMobileNumber().matches("\\d{10}"))
                return ResponseEntity.badRequest().body("Mobile number must be exactly 10 digits.");

            if (user.getAddress() == null || user.getAddress().isBlank())
                return ResponseEntity.badRequest().body("Address is required.");
            if (user.getAddress().length() > 200)
                return ResponseEntity.badRequest().body("Address must be 200 characters or less.");

            if (user.getPassword() == null || user.getPassword().length() < 6 || user.getPassword().length() > 12)
                return ResponseEntity.badRequest().body("Password must be 6–12 characters.");

            // ── Duplicate checks ────────────────────────────────────────────
            if (userDataRepository.existsByEmail(user.getEmail()))
                return ResponseEntity.badRequest().body("An account with this email already exists.");
            if (userDataRepository.existsByUserName(user.getUserName()))
                return ResponseEntity.badRequest().body("This username is already taken.");

            // ── Generate verification token & save ──────────────────────────
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            user.setVerified(false);

            userDataRepository.save(user);

            // ── Send verification email (if mail sender is configured) ──────
            sendVerificationEmail(user.getEmail(), user.getFirstName(), token);

            return ResponseEntity.ok("Signup successful! Please verify your email before logging in.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }

    // ── GET /users/verify?token=... ────────────────────────────────────────
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        Optional<UserData> userOpt = userDataRepository.findByVerificationToken(token);
        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body("Invalid or expired verification link.");

        UserData user = userOpt.get();
        if (Boolean.TRUE.equals(user.getVerified()))
            return ResponseEntity.ok("Your email is already verified. You can log in.");

        user.setVerified(true);
        user.setVerificationToken(null);
        userDataRepository.save(user);

        return ResponseEntity.ok("Email verified successfully! You can now log in.");
    }

    // ── POST /users/login ──────────────────────────────────────────────────
    // Accepts { identifier: "email or username", password: "..." }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest req) {
        if (req.getIdentifier() == null || req.getIdentifier().isBlank())
            return ResponseEntity.badRequest().body("Email or username is required.");
        if (req.getPassword() == null || req.getPassword().isBlank())
            return ResponseEntity.badRequest().body("Password is required.");

        // Try email first, then username
        Optional<UserData> userOpt = userDataRepository.findByEmail(req.getIdentifier());
        if (userOpt.isEmpty())
            userOpt = userDataRepository.findByUserName(req.getIdentifier());

        if (userOpt.isEmpty())
            return ResponseEntity.status(401).body("No account found with that email or username.");

        UserData user = userOpt.get();

        if (!user.getPassword().equals(req.getPassword()))
            return ResponseEntity.status(401).body("Incorrect password.");

        if (!Boolean.TRUE.equals(user.getVerified()))
            return ResponseEntity.status(403).body("Please verify your email before logging in.");

        return ResponseEntity.ok("Login successful.");
    }

    // ── Helper: send verification email ───────────────────────────────────
    private void sendVerificationEmail(String toEmail, String firstName, String token) {
        try {
            Resend resend = new Resend(resendApiKey);

            String verifyUrl = baseUrl + "/users/verify?token=" + token;

            CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")        // use this until you add your domain
                .to(toEmail)
                .subject("Verify your Sri Lakshmi Narasimha Swamy Chit Fund account")
                .text(
                    "Hello " + firstName + ",\n\n" +
                    "Please click the link below to verify your email:\n\n" +
                    verifyUrl + "\n\n" +
                    "— Sri Lakshmi Narasimha Swamy Chit Funds"
                )
                .build();

            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("EMAIL SENT, id: " + response.getId());

        } catch (Exception e) {
            System.err.println("EMAIL ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ── Inner DTO for login request ────────────────────────────────────────
    public static class LoginRequest {
        private String identifier; // email OR username
        private String password;

        public String getIdentifier()                  { return identifier; }
        public void   setIdentifier(String identifier) { this.identifier = identifier; }

        public String getPassword()                { return password; }
        public void   setPassword(String password) { this.password = password; }
    }
}