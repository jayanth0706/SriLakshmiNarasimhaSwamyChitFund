import React, { useState } from "react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8080/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.text();
    alert(data);
  };

  // ✅ Styles inside JS
  const styles = {
    container: {
      display: "flex",
      height: "100vh"
    },
    left: {
      width: "50%",
      background: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    logo: {
      width: "200px"
    },
    right: {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "50px"
    },
    input: {
      margin: "10px 0",
      padding: "10px"
    },
    button: {
      padding: "10px",
      backgroundColor: "green",
      color: "white",
      border: "none",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Left Side Logo */}
      <div style={styles.left}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h2>Sri Lakshmi Narasimha Swamy Chit Funds</h2>
      </div>

      {/* Right Side Login */}
      <div style={styles.right}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;