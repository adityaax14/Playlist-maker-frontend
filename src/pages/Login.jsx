
import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/dashboard.css";

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
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

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
            autoComplete="new-password"
          />

          <button type="submit">Login</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </AuthLayout>
  );
}
