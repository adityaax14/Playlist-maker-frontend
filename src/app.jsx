import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import React from "react";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer.jsx";
import CreatorAnalytics from "./pages/CreatorAnalytics.jsx";





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
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
    />
    
    <Route
  path="/course/:courseId/lesson/:lessonId"
  element={
    <ProtectedRoute>
      <LessonViewer />
    </ProtectedRoute>
  }
/>
 <Route
  path="/progress/creator/:courseId/analytics"
  element={
    <ProtectedRoute>
      <CreatorAnalytics />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}
