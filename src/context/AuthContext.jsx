import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.js";
import React from "react";
import { logoutUser as logoutApi } from "../api/auth.js";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res?.data) setUser(res.data);
      })
      .finally(() => setLoading(false));
  }, []);
    const logout = async () => {
    await logoutApi();  
    setUser(null);       // 🔥 frontend logout
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loading ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
