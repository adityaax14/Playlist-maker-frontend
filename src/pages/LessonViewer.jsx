import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getCourseById, getLessonById } from "../api/course.js";
import { startLesson, completeLesson,updateLessonTime } from "../api/progress.js";
import "../styles/lesson.css";
import { useNavigate } from "react-router-dom";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [course,setCourse]= useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mark lesson as started
    startLesson(courseId, lessonId);

    const fetchLesson = async () => {
      try {
        const res = await getLessonById(courseId, lessonId);
        setLesson(res.data);
        getCourseById(courseId).then(res=>setCourse(res.data));
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  const lessons=course?.lessons || [];
  const currentIndex=lessons.findIndex(l=>l._id=== lessonId);
  const prevLesson= lessons[currentIndex-1];
  const nextLesson=lessons[currentIndex+1];

  useEffect(() => {
  let interval;

  interval = setInterval(() => {
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


  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
   <AuthLayout>
  <div className="lesson-wrapper">

    {/* BACK BUTTON */}
    <button
      className="back-btn"
      onClick={() => navigate(`/course/${courseId}`)}
    >
      ← Back to Course
    </button>

    <div className="lesson-container">

      {/* LEFT PANEL */}
      <div className="lesson-left">
        <span className="lesson-badge">Lesson</span>

        <h1 className="lesson-title">{lesson.title}</h1>

        <p className="lesson-description">
          {lesson.description}
        </p>

        {lesson.duration && (
          <div className="lesson-time">
            ⏱ {lesson.duration} min
          </div>
        )}

        <button
          className="complete-btn"
          onClick={handleComplete}
        >
          Mark as Completed
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="lesson-right">
        <div className="video-card">
          <video
            className="lesson-video"
            controls
            preload="metadata"
          >
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>

          <div className="lesson-navigation">
            {prevLesson && (
              <button
                className="nav-btn secondary"
                onClick={() =>
                  navigate(`/course/${courseId}/lesson/${prevLesson._id}`)
                }
              >
                ← Previous
              </button>
            )}

            {nextLesson && (
              <button
                className="nav-btn primary"
                onClick={() =>
                  navigate(`/course/${courseId}/lesson/${nextLesson._id}`)
                }
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  </div>
</AuthLayout>

  );
}
