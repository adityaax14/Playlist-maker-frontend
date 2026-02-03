import React from "react";
import "../styles/auth.css";

export default function AuthLayout({ children, full = false }) {
  return (
    <div className={full ? "layout-full" : "layout-auth"}>
      {children}
    </div>
  );
}

