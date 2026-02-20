import React from "react";

import { useState } from "react";
import { registerUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import "../styles/dashboard.css";
import "../styles/auth.css";



export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [error, setError] = useState("");
  const [text,setText]=useState("");


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setText("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email)) {
    setError("Please enter a valid email address");
    return;
  }

  try {
    const res = await registerUser(form);
    setText("User registered successfully");
    setForm({ username: "", email: "", password: "" });
  } catch (err) {
    setError(err.message || "Registration failed");
  }
};


  return (
    
  <div className="auth-container">
    <div className="auth-card">

      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1 className="brand">Playlist Studio</h1>

        <div className="login-box">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Start building and exploring playlists
          </p>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
            autoComplete="off"
          >
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <button type="submit" className="primary-btn">
              Register
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <h2>Already have an account?</h2>
        <p>
          Sign in to continue building your learning playlists.
        </p>

        <button
          className="secondary-btn"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>

    </div>
  </div>
);
  
}
