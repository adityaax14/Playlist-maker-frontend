import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Explore from "./pages/Explore.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";





function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/explore" element={
        <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
      }
      />
      <Route path="/playlist/:playlistId/:videoId?" element={<PlaylistDetail />} />
      

    </Routes>
  );
}
