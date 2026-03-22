import React from "react";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/reset.css";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const emailFromState = location.state?.email || localStorage.getItem("resetEmail") ||  "";

  const [email, setEmail] = useState(emailFromState);
  localStorage.setItem("resetEmail", email);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const handleOtpChange = (element, index) => {
    if (!/^[0-9]?$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     await axios.post(
  "http://localhost:8000/api/v2/users/verify-otp",
  {
    email,
    otp: otp.join(""),
    password
  },
  { withCredentials: true }
);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <p className="subtitle">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">

          <input
            type="email"
            value={email}
            disabled
            className="email-field"
          />

          <div className="otp-container">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                ref={(el) => (inputs.current[index] = el)}
                className="otp-box"
              />
            ))}
          </div>

          <input
            type="password"
            placeholder="New Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}