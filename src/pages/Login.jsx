
import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // reset form whenever login page mounts
  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);

      if (res?.data?.user) {
        setUser(res.data.user);
        setForm({ email: "", password: "" });
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
  <div className="auth-container">
  <div className="auth-card">

    {/* LEFT SIDE */}
    <div className="auth-left">
      <h1 className="brand">Playlist Studio</h1>

      <div className="login-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Login to continue building your playlists
        </p>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          autoComplete="off"
        >
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
          />

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="auth-right">
      <h2>New Here?</h2>
      <p>
        Create your own learning playlists and explore content
        from other creators.
      </p>

      <button
        className="secondary-btn"
        onClick={() => navigate("/register")}
      >
        Sign Up
      </button>
    </div>

  </div>
</div>
);
}
