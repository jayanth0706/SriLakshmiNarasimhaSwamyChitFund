package com.chitfund.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_data")
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "user_name", nullable = false, unique = true, length = 30)
    private String userName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "mobile_number", nullable = false, length = 10)
    private String mobileNumber;

    @Column(name = "address", nullable = false, length = 200)
    private String address;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    @Column(name = "verification_token", length = 100)
    private String verificationToken;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId()              { return id; }
    public void setId(Long id)       { this.id = id; }

    public String getFirstName()                 { return firstName; }
    public void   setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName()                { return lastName; }
    public void   setLastName(String lastName) { this.lastName = lastName; }

    public String getUserName()                { return userName; }
    public void   setUserName(String userName) { this.userName = userName; }

    public String getEmail()             { return email; }
    public void   setEmail(String email) { this.email = email; }

    public String getMobileNumber()                    { return mobileNumber; }
    public void   setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getAddress()               { return address; }
    public void   setAddress(String address) { this.address = address; }

    public String getPassword()                { return password; }
    public void   setPassword(String password) { this.password = password; }

    public Boolean getVerified()                 { return verified; }
    public void    setVerified(Boolean verified) { this.verified = verified; }

    public String getVerificationToken()                         { return verificationToken; }
    public void   setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
}