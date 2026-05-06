import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email) return "Email is required";
    if ((email.match(/@/g) || []).length !== 1) return "Only one @ allowed";
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6 || password.length > 12)
      return "Password must be 6–12 characters";
    return null;
  };

  const handleLogin = async () => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) return alert(emailError);
  if (passwordError) return alert(passwordError);

  setLoggingIn(true);  // ← ADD
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.text();
    if (response.ok) {
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      alert(data);
    }
  } finally {
    setLoggingIn(false);  // ← ADD
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password) handleLogin();
  };

  const isFormValid = email && password;

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* ── 1. Full screen wrapper ── */
        .screen {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
        }

        /* ── 2. Main centered div ── */
        .center-wrapper {
          width: 90%;
          max-width: 1100px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ── 3. H1 ── */
        .login-h1 {
          width: 100%;
          text-align: center;
          font-size: clamp(1.2rem, 2.8vw, 2rem);
          font-weight: bold;
          color: #000;
          margin-bottom: 6px;
        }

        /* ── 4. H2 ── */
        .login-h2 {
          width: 100%;
          text-align: center;
          font-size: clamp(1rem, 2vw, 1.4rem);
          font-weight: 700;
          color: green;
          margin-bottom: 20px;
        }

        /* ── 5. Split div ── */
        .login-split {
          height: 60%;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: row;
          border: 1px solid #eee;
          border-radius: 10px;
          overflow: hidden;
          max-height: 420px;
        }

        /* ── 5.1 Image div ── */
        .login-image-div {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
          border-right: 1px solid #eee;
          background: #fff;
        }

        .login-logo {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* ── 5.2 Form div ── */
        .login-form-div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30px;
          background: #f9fafb;
          box-shadow: inset 4px 0 16px rgba(0, 0, 0, 0.04);
          gap: 12px;
        }

        /* ── Input wrapper ── */
        .input-wrapper {
          position: relative;
          width: 100%;
          max-width: 380px;
        }

        .login-input {
          width: 100%;
          height: 48px;
          padding: 0 42px 0 14px;
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          border: 1.5px solid #ccc;
          border-radius: 6px;
          outline: none;
          background: #fff;
          color: #333;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .login-input:focus {
          border-color: green;
          box-shadow: 0 0 0 3px rgba(0, 128, 0, 0.12);
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        /* ── Button wrapper ── */
        .login-btn-wrapper {
          width: 100%;
          max-width: 380px;
        }

        .login-btn {
          width: 100%;
          height: 48px;
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 6px;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.1s;
        }

        .login-btn:active {
          transform: scale(0.98);
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          html, body, #root {
            overflow: auto;
          }

          .screen {
            height: auto;
            min-height: 100vh;
            align-items: flex-start;
          }

          .center-wrapper {
            height: auto;
            min-height: 100vh;
            padding: 24px 16px;
            justify-content: flex-start;
          }

          .login-split {
            flex-direction: column;
            max-height: none;
          }

          .login-image-div {
            border-right: none;
            border-bottom: 1px solid #eee;
            max-height: 220px;
            padding: 20px;
          }

          .login-form-div {
            padding: 24px 20px;
            box-shadow: none;
            gap: 12px;
          }

          .input-wrapper,
          .login-btn-wrapper {
            max-width: 100%;
          }
        }

        /* ── Tablet ── */
        @media (min-width: 601px) and (max-width: 900px) {
          .login-split {
            flex-direction: column;
            max-height: none;
          }

          .login-image-div {
            border-right: none;
            border-bottom: 1px solid #eee;
            max-height: 220px;
          }

          .login-form-div {
            box-shadow: none;
            gap: 12px;
          }

          .input-wrapper,
          .login-btn-wrapper {
            max-width: 100%;
          }
        }
      `}</style>

      {/* ── 1. Full screen ── */}
      <div className="screen">

        {/* ── 2. Center wrapper ── */}
        <div className="center-wrapper">

          {/* ── 3. H1 ── */}
          <h1 className="login-h1">Sri Lakshmi Narasimha Swamy Chit Funds</h1>

          {/* ── 4. H2 ── */}
          <h2 className="login-h2">Admin Login</h2>

          {/* ── 5. Split div ── */}
          <div className="login-split">

            {/* ── 5.1 Image div ── */}
            <div className="login-image-div">
              <img src="/resources/Logo.png" alt="Logo" className="login-logo" />
            </div>

            {/* ── 5.2 Form div ── */}
            <div className="login-form-div">

              {/* Input 1 */}
              <div className="input-wrapper">
                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>

              {/* Input 2 */}
              <div className="input-wrapper">
                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  type="button"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {/* Login Button */}
              <div className="login-btn-wrapper">
                <button
                  className="login-btn"
                  style={{
                    backgroundColor: isFormValid && !loggingIn ? "green" : "#aaa",
                    cursor: isFormValid && !loggingIn ? "pointer" : "not-allowed",
                  }}
                  onClick={handleLogin}
                  disabled={!isFormValid || loggingIn}
                >
                  {loggingIn ? "Connecting… (may take ~30s)" : "Login"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;