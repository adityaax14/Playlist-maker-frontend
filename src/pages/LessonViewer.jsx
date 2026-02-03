import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getLessonById } from "../api/course.js";
import { startLesson, completeLesson } from "../api/progress.js";
import "../styles/lesson.css";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mark lesson as started
    startLesson(courseId, lessonId);

    const fetchLesson = async () => {
      try {
        const res = await getLessonById(courseId, lessonId);
        setLesson(res.data);
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <AuthLayout>
  <div className="lesson-viewer-container">
    <div className="lesson-viewer-card">

      {/* Meta row */}
      <div className="lesson-meta">
        <span className="lesson-badge">Lesson</span>

        {lesson.duration && (
          <span className="lesson-duration">
            ⏱ {lesson.duration} min
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="lesson-title">{lesson.title}</h1>

      {/* Description */}
      <p className="lesson-description">
        {lesson.description}
      </p>

      {/* Video */}
      <div className="lesson-video-wrapper">
        <video
          className="lesson-video"
          controls
          preload="metadata"
        >
          <source src={lesson.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Actions */}
      <div className="lesson-actions">
        <button
          className="complete-lesson-btn"
          onClick={() => completeLesson(courseId, lessonId)}
        >
          Mark as Completed
        </button>
      </div>

    </div>
  </div>
</AuthLayout>

  );
}
