import React, { useState } from "react";
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
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
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

        <div className="hero-features">
          <div>▶ Curate learning playlists</div>
          <div>📊 Track your progress deeply</div>
          <div>🔥 Explore trending playlists</div>
          <div>💬 Rate & comment with the community</div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-panel">
        <div className="auth-tabs">
          <button className="active">Sign In</button>
          <button onClick={() => navigate("/register")}>
            Create Account
          </button>
        </div>

        <h2>Welcome back</h2>
        <p className="panel-subtitle">
          Enter your credentials to access your playlists
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-btn">
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );
}