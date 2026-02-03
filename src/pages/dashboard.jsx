
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { fetchCourses } from "../api/course.js";
import CreateCourse from "../components/CreateCourse";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setForm("");
  };

  useEffect(() => {
    fetchCourses().then((res) => {
      setCourses(res.data || []);
    });
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  return (
    <AuthLayout full>
  <div className="dashboard-wrapper">

    <header className="dashboard-header">
      <h2>
        Welcome, <span className="username">{user?.username}</span>
      </h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>

    <section className="dashboard-section-2">
      
      <CreateCourse onCourseCreated={handleCourseCreated} />
    </section>

    <section className="dashboard-section">
      <h3>Available Courses</h3>

      <div className="course-grid">
        {courses.map((course) => (
          <div key={course._id}
  className="course-card"
  onClick={() => navigate(`/course/${course._id}`)}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>

            <div className="course-meta">
              <span className="badge">{course.category}</span>
              <span className="badge level">{course.level}</span>
            </div>

            <small>By {course.creator?.username}</small>
          </div>
        ))}
      </div>
    </section>

  </div>
</AuthLayout>

  );
}
