
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../api/course.js";
import CreateCourse from "../components/CreateCourse";
import { motion } from "framer-motion";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchCourses().then((res) => {
      setCourses(res.data || []);
    });
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  /* Animation variants */
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 }
    }
  };

  return (
    <motion.div
      className="dashboard-wrapper"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2>
          Welcome, <span className="username">{user?.username}</span>
        </h2>

        <motion.button
          className="logout-btn"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.header>

      {/* Stats */}
      <motion.section
        className="stats-row"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: "Total Courses", value: courses.length },
          { label: "Your Progress", value: "Coming soon" },
          { label: "Learning Streak", value: "Coming soon" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card"
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <h4>{stat.label}</h4>
            <p>{stat.value}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Main layout */}
      <section className="dashboard-main">
        {/* Left panel */}
        <motion.div
          className="left-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CreateCourse onCourseCreated={handleCourseCreated} />
        </motion.div>

        {/* Right panel */}
        <motion.div
          className="right-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3>Available Courses</h3>

          <motion.div
            className="course-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course) => (
              <motion.div
                key={course._id}
                className="course-card"
                variants={cardVariants}
                whileHover={{
                  scale: 1.04,
                  y: -6
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate(`/course/${course._id}`)
                }
              >
                <h4>{course.title}</h4>
                <p>{course.description}</p>

                <div className="course-meta">
                  <span className="badge">
                    {course.category}
                  </span>
                  <span className="badge level">
                    {course.level}
                  </span>
                </div>

                <small>
                  By {course.creator?.username}
                </small>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}