import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getCourseById } from "../api/course.js";
import "../styles/CourseDetails.css";
import { useAuth } from "../context/AuthContext";
import { addLesson } from "../api/course";
import { fetchCourseProgress,fetchCourseAnalytics } from "../api/progress.js";
import CourseAnalytics from "../components/CourseAnalytics.jsx";

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

const [analytics, setAnalytics] = useState(null);

useEffect(() => {
  fetchCourseAnalytics(courseId)
    .then(res => setAnalytics(res.data))
    .catch(err => console.error(err));
}, [courseId]);

const getResumeLessonId = () => {
  if (!course || !progress) return null;

  
  if (progress.inProgressLesson) {
    return progress.inProgressLesson;
  }

 
  const completedSet = new Set(
    progress.completedLessons?.map(id => id.toString())
  );

  const firstIncomplete = course.lessons.find(
    lesson => !completedSet.has(lesson._id.toString())
  );

  return firstIncomplete?._id || null;
};

const resumeLessonId=getResumeLessonId();



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

  const isCourseCompleted =
  course.lessons.length > 0 &&
  progress?.completedLessons?.length === course.lessons.length;

  



  return (
   
    <AuthLayout>
  <div className="course-detail-container">
    <button
  className="back-courses-btn"
  onClick={() => navigate("/dashboard")}
>
  ← Back to Courses
</button>

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
      
         {isCreator && (
       
        <button
  className="analytics-btn"
  onClick={() => navigate(`/progress/creator/${course._id}/analytics`)}
>
  📊 View Analytics
</button>

        
      
        
        
      )}

      <p className="course-desc">{course.description}</p>
      <span className="course-creator">
        Created by {course.creator?.username}
      </span>
    </div>
    {isCourseCompleted && (
  <div className="course-complete-banner">
    🎉 Course Completed
  </div>
)}

    
{resumeLessonId && (
  <button
    className="resume-btn"
    onClick={() =>
      navigate(`/course/${course._id}/lesson/${resumeLessonId}`)
    }
  >
    Resume Learning
  </button>
)}


    {/* MOVE FORM OUTSIDE HEADER */}
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
            setLessonForm({
              ...lessonForm,
              description: e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={lessonForm.duration}
          onChange={(e) =>
            setLessonForm({
              ...lessonForm,
              duration: e.target.value
            })
          }
        />

        <input
          placeholder="Video URL"
          value={lessonForm.videoUrl}
          onChange={(e) =>
            setLessonForm({
              ...lessonForm,
              videoUrl: e.target.value
            })
          }
        />

        <button onClick={handleAddLesson}>
          Save Lesson
        </button>
      </div>
    )}

    {isCreator && (
      <p className="creator-note">
        You are the course creator
      </p>
    )}

    {/* MAIN LAYOUT */}
    <div className="course-main">
      {/* Left: Analytics */}
      {analytics && (
        <div className="course-left">
          <CourseAnalytics
            analytics={analytics}
            courseId={courseId}
          />
        </div>
      )}

      {/* Right: Lessons */}
      <div className="course-right">
        <div className="lesson-section">
          <h2>Lessons</h2>

          {!course.lessons || course.lessons.length === 0 ? (
            <div className="empty-lessons">
              <p>No lessons yet</p>
              {isCreator && (
                <span>
                  Add your first lesson to get started
                </span>
              )}
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
                  onClick={() =>
                    navigate(
                      `/course/${course._id}/lesson/${lesson._id}`
                    )
                  }
                >
                  <div className="lesson-status">
                    {isCompleted(lesson._id) && "Completed"}
                    {!isCompleted(lesson._id) &&
                      isInProgress(lesson._id) &&
                      "In Progress"}
                  </div>

                  <div className="lesson-index">
                    {index + 1}
                  </div>

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
    </div>

  </div>
</AuthLayout>
  );
    
  
};
