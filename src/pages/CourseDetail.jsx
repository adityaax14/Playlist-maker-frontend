import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getCourseById } from "../api/course.js";
import "../styles/CourseDetails.css";
import { useAuth } from "../context/AuthContext";
import { addLesson } from "../api/course";
import { fetchCourseProgress } from "../api/progress.js";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: ""
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchCourse();
  }, [courseId]);
  const [progress, setProgress] = useState(null);

useEffect(() => {
  fetchCourseProgress(courseId)
    .then(res => setProgress(res.data));
}, [courseId]);




  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;
 const completedCount = progress?.completedLessons?.length || 0;
const totalLessons = course.lessons.length;

const progressPercent =
  totalLessons === 0
    ? 0
    : Math.round((completedCount / totalLessons) * 100);

    const isCompleted = (lessonId) =>
  progress?.completedLessons?.includes(lessonId);

const isInProgress = (lessonId) =>
  progress?.inProgressLesson === lessonId;



  const isCreator =
    course.creator?._id?.toString() === user?._id?.toString();

  const handleAddLesson = async () => {
    try {
      const res = await addLesson(courseId, lessonForm);

      setCourse((prev) => ({
        ...prev,
        lessons: [...prev.lessons, res.data]
      }));

      setLessonForm({
        title: "",
        description: "",
        duration: "",
        videoUrl: ""
      });

      setShowLessonForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  



  return (
    <AuthLayout>
      <div className="course-detail-container">
        {/* Course Header */}
        <div className="course-header">
          <h1>{course.title}</h1>
          {isCreator && (
  <button
    className="add-lesson-btn"
    onClick={() => setShowLessonForm(!showLessonForm)}
  >
    {showLessonForm ? "Cancel" : "Add Lesson"}
  </button>
  
)}
{showLessonForm && (
  <div className="lesson-form">
    <input
      placeholder="Lesson title"
      value={lessonForm.title}
      onChange={(e) =>
        setLessonForm({ ...lessonForm, title: e.target.value })
      }
    />

    <textarea
      placeholder="Lesson description"
      value={lessonForm.description}
      onChange={(e) =>
        setLessonForm({ ...lessonForm, description: e.target.value })
      }
    />

    <input
      type="number"
      placeholder="Duration (minutes)"
      value={lessonForm.duration}
      onChange={(e) =>
        setLessonForm({ ...lessonForm, duration: e.target.value })
      }
    />

    <input
      placeholder="Video URL"
      value={lessonForm.videoUrl}
      onChange={(e) =>
        setLessonForm({ ...lessonForm, videoUrl: e.target.value })
      }
    />

    <button onClick={handleAddLesson}>
      Save Lesson
    </button>
  </div>
)}
 <div className="course-progress">
  <div className="progress-label">
    Progress: {progressPercent}%
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progressPercent}%` }}
    />
  </div>
</div>


          <p className="course-desc">{course.description}</p>
          <span className="course-creator">
            Created by {course.creator?.username}
          </span>
        </div>

      
        {isCreator && (
          <p className="creator-note">You are the course creator</p>
        )}

        {/* Lessons */}
        <div className="lesson-section">
          <h2>Lessons</h2>
           {progress?.inProgressLesson && (
    <button
      className="resume-btn"
      onClick={() =>
        navigate(
          `/course/${course._id}/lesson/${progress.inProgressLesson}`
        )
      }
    >
      Resume Learning
    </button>
  )}

          {!course.lessons || course.lessons.length === 0 ? (
           <div className="empty-lessons">
  <p>No lessons yet</p>
  {isCreator && <span>Add your first lesson to get started</span>}
</div>

          ) : (
            
            <div className="lesson-list">
              {course.lessons.map((lesson, index) => (
                <div
                 key={lesson._id}
                  className={`lesson-card
                 ${isCompleted(lesson._id) ? "completed" : ""}
                  ${isInProgress(lesson._id) ? "in-progress" : ""}
                `}
                onClick={() => navigate( `/course/${course._id}/lesson/${lesson._id}` ) }
                
               >
                <div className="lesson-status">
                {isCompleted(lesson._id) && "Completed"}
                {!isCompleted(lesson._id) && isInProgress(lesson._id) && "In Progress"}
                </div>


                  <div className="lesson-index">{index + 1}</div>

                  <div className="lesson-info">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description}</p>

                    {lesson.duration && (
                      <span className="lesson-duration">
                        ⏱ {lesson.duration} min
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
