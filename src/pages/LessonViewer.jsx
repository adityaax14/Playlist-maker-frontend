import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getCourseById, getLessonById } from "../api/course.js";
import { startLesson, completeLesson, updateLessonTime } from "../api/progress.js";
import "../styles/lesson.css"; // Make sure to update the import

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startLesson(courseId, lessonId);
    const fetchLesson = async () => {
      try {
        const res = await getLessonById(courseId, lessonId);
        setLesson(res.data);
        getCourseById(courseId).then((res) => setCourse(res.data));
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  const lessons = course?.lessons || [];
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  useEffect(() => {
    let interval = setInterval(() => {
      updateLessonTime(courseId, lessonId, 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [courseId, lessonId]);

  const handleComplete = async () => {
    await completeLesson(courseId, lessonId);
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson._id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (loading) return <div className="apple-loader">Loading...</div>;
  if (!lesson) return <div className="apple-error">Lesson not found</div>;

  return (
    <AuthLayout>
      <div className="apple-page-container">
        
        {/* GLASSMORPHIC HEADER */}
        <header className="apple-nav-bar">
          <button
            className="apple-back-btn"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L2 10L11 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Course</span>
          </button>
        </header>

        <main className="apple-content-grid">
          {/* LEFT PANEL: CONTENT & METADATA */}
          <div className="apple-text-content">
            <div className="apple-meta-row">
              <span className="apple-badge">DSA Concept</span>
              {lesson.duration && (
                <span className="apple-meta-text">
                   {lesson.duration} min
                </span>
              )}
            </div>

            <h1 className="apple-title">{lesson.title}</h1>
            
            <p className="apple-description">
              {lesson.description}
            </p>

            <div className="apple-action-area">
              <button className="apple-primary-btn" onClick={handleComplete}>
                <span>Mark as Completed</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: MEDIA */}
          <div className="apple-media-content">
            <div className="apple-video-wrapper">
              <video
                className="apple-video-player"
                controls
                preload="metadata"
              >
                <source src={lesson.videoUrl} type="video/mp4" />
              </video>
            </div>

            {/* NAVIGATION CONTROLS BELOW VIDEO */}
            <div className="apple-video-nav">
              <button
                className={`apple-nav-link ${!prevLesson ? 'disabled' : ''}`}
                onClick={() => prevLesson && navigate(`/course/${courseId}/lesson/${prevLesson._id}`)}
                disabled={!prevLesson}
              >
                Previous
              </button>
              
              <div className="apple-divider"></div>

              <button
                className={`apple-nav-link ${!nextLesson ? 'disabled' : ''}`}
                onClick={() => nextLesson && navigate(`/course/${courseId}/lesson/${nextLesson._id}`)}
                disabled={!nextLesson}
              >
                Next Lesson
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}