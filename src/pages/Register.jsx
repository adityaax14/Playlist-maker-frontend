import React from "react";

import { useState } from "react";
import { registerUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import "../styles/dashboard.css";



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
    <AuthLayout>
      <div className="auth-card">
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
  name="username"
  value={form.username}
  onChange={handleChange}
  placeholder="Username"
  required
/>

<input
  name="email"
  type="email"
  value={form.email}
  onChange={handleChange}
  placeholder="Email"
  required
/>

<input
  name="password"
  type="password"
  value={form.password}
  onChange={handleChange}
  placeholder="Password"
  required
/>

     
      <button type="submit">Register</button>
       <p className="auth-footer">
        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
      </p>
      {error && <p className="error-text">{error}</p>}
      {text && <p className="success-text">{text}</p>}

    </form>
    </div>
    </AuthLayout>
  );
}
