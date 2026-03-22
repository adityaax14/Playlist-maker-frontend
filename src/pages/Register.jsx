import React, { useState } from "react";
import { registerUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT SECTION */}
      <div className="auth-hero">
        <h1>
          Learn with <span>purpose.</span>
        </h1>

        <p>
          Organize YouTube videos into structured learning paths.
          Track progress, share with others, and never lose your place.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-panel">
        <div className="auth-tabs">
          <button onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="active">
            Create Account
          </button>
        </div>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="input-group">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group password-group">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-btn">
            Create Account →
          </button>

        </form>
      </div>

    </div>
  );
}