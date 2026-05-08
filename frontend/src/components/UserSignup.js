import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", userName: "", email: "",
    mobileNumber: "", address: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())                         e.firstName       = "First name is required.";
    else if (!/^[a-zA-Z]+$/.test(form.firstName))      e.firstName       = "Letters only.";
    else if (form.firstName.length > 50)                e.firstName       = "Max 50 chars.";

    if (!form.lastName.trim())                          e.lastName        = "Last name is required.";
    else if (!/^[a-zA-Z]+$/.test(form.lastName))       e.lastName        = "Letters only.";
    else if (form.lastName.length > 50)                 e.lastName        = "Max 50 chars.";

    if (!form.userName.trim())                          e.userName        = "Username is required.";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.userName))  e.userName        = "Letters, numbers, underscore only.";
    else if (form.userName.length > 30)                 e.userName        = "Max 30 chars.";

    if (!form.email.trim())                             e.email           = "Email is required.";
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email))
                                                        e.email           = "Invalid email format.";

    if (!form.mobileNumber.trim())                      e.mobileNumber    = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobileNumber))      e.mobileNumber    = "Exactly 10 digits.";

    if (!form.address.trim())                           e.address         = "Address is required.";
    else if (form.address.length > 200)                 e.address         = "Max 200 chars.";

    if (!form.password)                                 e.password        = "Password is required.";
    else if (form.password.length < 6 || form.password.length > 12)
                                                        e.password        = "Password must be 6–12 characters.";

    if (!form.confirmPassword)                          e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)    e.confirmPassword = "Passwords do not match.";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          userName: form.userName, email: form.email,
          mobileNumber: form.mobileNumber, address: form.address,
          password: form.password,
        }),
      });
      const text = await res.text();
      if (res.ok) {
        setSuccessMsg("Registration successful! Please check your email to verify your account.");
      } else {
        alert(text || "Signup failed. Please try again.");
      }
    } catch {
      alert("Unable to connect to server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const isFormValid = Object.values(form).every(v => v.trim() !== "");

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; min-height: 100%; }

        .signup-screen {
          width: 100vw; min-height: 100vh;
          display: flex; justify-content: center; align-items: flex-start;
          background: #fff; padding: 30px 16px 40px;
        }
        .signup-wrapper {
          width: 100%; max-width: 1000px;
          display: flex; flex-direction: column; align-items: center;
        }
        .signup-h1 {
          width: 100%; text-align: center;
          font-size: clamp(1.2rem, 2.8vw, 2rem);
          font-weight: bold; color: #000; margin-bottom: 6px;
        }
        .signup-h2 {
          width: 100%; text-align: center;
          font-size: clamp(1rem, 2vw, 1.4rem);
          font-weight: 700; color: green; margin-bottom: 24px;
        }
        .signup-card {
          width: 100%; border: 1px solid #eee;
          border-radius: 10px; overflow: hidden; display: flex; flex-direction: row;
        }
        .signup-image-div {
          width: 200px; flex-shrink: 0; display: flex;
          justify-content: center; align-items: center;
          padding: 30px 20px; border-right: 1px solid #eee; background: #fff;
        }
        .signup-logo { width: 100%; max-height: 180px; object-fit: contain; }
        .signup-form-div {
          flex: 1; padding: 28px 32px; background: #f9fafb;
          box-shadow: inset 4px 0 16px rgba(0,0,0,.04);
          display: flex; flex-direction: column;
        }
        .signup-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px 20px; margin-bottom: 12px;
        }
        .signup-field { display: flex; flex-direction: column; gap: 4px; }
        .signup-field.full-width { grid-column: 1 / -1; }
        .signup-label { font-size: 12px; font-weight: 600; color: #374151; }
        .signup-input-wrap { position: relative; }
        .signup-input {
          width: 100%; height: 40px; padding: 0 40px 0 12px;
          font-size: 13px; border: 1.5px solid #ccc; border-radius: 6px;
          outline: none; background: #fff; color: #333;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .signup-input.no-icon { padding-right: 12px; }
        .signup-input:focus { border-color: green; box-shadow: 0 0 0 3px rgba(0,128,0,0.12); }
        .signup-input.error { border-color: #ef4444; }
        .signup-textarea {
          width: 100%; height: 62px; padding: 8px 12px;
          font-size: 13px; border: 1.5px solid #ccc; border-radius: 6px;
          outline: none; background: #fff; color: #333;
          resize: none; font-family: inherit;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .signup-textarea:focus { border-color: green; box-shadow: 0 0 0 3px rgba(0,128,0,0.12); }
        .signup-textarea.error { border-color: #ef4444; }
        .err-txt { font-size: 11px; color: #ef4444; }
        .eye-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 0;
        }
        .signup-btn {
          width: 100%; height: 44px; font-size: 14px; font-weight: 600; color: #fff;
          border: none; border-radius: 6px; letter-spacing: 0.5px;
          cursor: pointer; transition: opacity 0.2s, transform 0.1s; margin-top: 4px;
        }
        .signup-btn:active { transform: scale(0.98); }

        .nav-links {
          display: flex; gap: 8px; justify-content: center;
          flex-wrap: wrap; margin-top: 12px;
        }
        .nav-link-btn {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600; color: green;
          padding: 4px 8px; border-radius: 4px; transition: background 0.15s;
        }
        .nav-link-btn:hover { background: #f0fdf4; }
        .nav-link-sep { font-size: 13px; color: #d1d5db; display: flex; align-items: center; }

        .success-box {
          background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px;
          padding: 20px 24px; text-align: center; color: #15803d;
          font-size: 14px; font-weight: 600; line-height: 1.6;
        }
        .success-box button {
          margin-top: 14px; padding: 9px 28px; background: green; color: #fff;
          border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;
        }

        @media (max-width: 700px) {
          .signup-card { flex-direction: column; }
          .signup-image-div { width: 100%; border-right: none; border-bottom: 1px solid #eee; max-height: 140px; }
          .signup-form-div { padding: 20px 16px; box-shadow: none; }
          .signup-grid { grid-template-columns: 1fr; }
          .signup-field.full-width { grid-column: 1; }
        }
      `}</style>

      <div className="signup-screen">
        <div className="signup-wrapper">
          <h1 className="signup-h1">Sri Lakshmi Narasimha Swamy Chit Funds</h1>
          <h2 className="signup-h2">User Sign Up</h2>

          <div className="signup-card">
            <div className="signup-image-div">
              <img src="/resources/Logo.png" alt="Logo" className="signup-logo" />
            </div>

            <div className="signup-form-div">
              {successMsg ? (
                <div className="success-box">
                  ✅ {successMsg}
                  <br/>
                  <button onClick={() => navigate("/user-login")}>Go to Login</button>
                </div>
              ) : (
                <>
                  <div className="signup-grid">

                    <div className="signup-field">
                      <label className="signup-label">First Name *</label>
                      <div className="signup-input-wrap">
                        <input name="firstName" className={`signup-input no-icon${errors.firstName ? " error" : ""}`}
                          placeholder="First name" value={form.firstName} onChange={handleChange}/>
                      </div>
                      {errors.firstName && <span className="err-txt">{errors.firstName}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Last Name *</label>
                      <div className="signup-input-wrap">
                        <input name="lastName" className={`signup-input no-icon${errors.lastName ? " error" : ""}`}
                          placeholder="Last name" value={form.lastName} onChange={handleChange}/>
                      </div>
                      {errors.lastName && <span className="err-txt">{errors.lastName}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Username *</label>
                      <div className="signup-input-wrap">
                        <input name="userName" className={`signup-input no-icon${errors.userName ? " error" : ""}`}
                          placeholder="e.g. john_doe" value={form.userName} onChange={handleChange}/>
                      </div>
                      {errors.userName && <span className="err-txt">{errors.userName}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Email *</label>
                      <div className="signup-input-wrap">
                        <input name="email" type="email" className={`signup-input no-icon${errors.email ? " error" : ""}`}
                          placeholder="example@email.com" value={form.email} onChange={handleChange}/>
                      </div>
                      {errors.email && <span className="err-txt">{errors.email}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Mobile Number *</label>
                      <div className="signup-input-wrap">
                        <input name="mobileNumber" className={`signup-input no-icon${errors.mobileNumber ? " error" : ""}`}
                          placeholder="10-digit number" value={form.mobileNumber} onChange={handleChange}/>
                      </div>
                      {errors.mobileNumber && <span className="err-txt">{errors.mobileNumber}</span>}
                    </div>

                    <div className="signup-field full-width">
                      <label className="signup-label">Address *</label>
                      <textarea name="address" className={`signup-textarea${errors.address ? " error" : ""}`}
                        placeholder="Street, City, State" value={form.address} onChange={handleChange}/>
                      {errors.address && <span className="err-txt">{errors.address}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Password *</label>
                      <div className="signup-input-wrap">
                        <input name="password" type={showPassword ? "text" : "password"}
                          className={`signup-input${errors.password ? " error" : ""}`}
                          placeholder="6–12 characters" value={form.password} onChange={handleChange}/>
                        <button className="eye-btn" type="button" tabIndex={-1}
                          onClick={() => setShowPassword(p => !p)}>
                          {showPassword ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {errors.password && <span className="err-txt">{errors.password}</span>}
                    </div>

                    <div className="signup-field">
                      <label className="signup-label">Confirm Password *</label>
                      <div className="signup-input-wrap">
                        <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                          className={`signup-input${errors.confirmPassword ? " error" : ""}`}
                          placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange}/>
                        <button className="eye-btn" type="button" tabIndex={-1}
                          onClick={() => setShowConfirm(p => !p)}>
                          {showConfirm ? <EyeOff /> : <EyeOpen />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="err-txt">{errors.confirmPassword}</span>}
                    </div>

                  </div>

                  <button className="signup-btn"
                    style={{
                      backgroundColor: isFormValid && !submitting ? "green" : "#aaa",
                      cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                    }}
                    onClick={handleSubmit} disabled={!isFormValid || submitting}>
                    {submitting ? "Signing Up…" : "Sign Up"}
                  </button>

                  {/* ── Nav links: Admin Login | User Login ── */}
                  <div className="nav-links">
                    <button className="nav-link-btn" onClick={() => navigate("/login")}>Admin Login</button>
                    <span className="nav-link-sep">|</span>
                    <button className="nav-link-btn" onClick={() => navigate("/user-login")}>User Login</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSignup;