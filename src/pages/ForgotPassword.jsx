import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/forgot.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/v2/users/send-otp",
        { email },
        { withCredentials: true }
      );

      // Navigate to reset page and pass email
      navigate("/reset-password", {
        state: { email }
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your registered email to receive an OTP.
        </p>

        <form onSubmit={handleSendOTP} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}