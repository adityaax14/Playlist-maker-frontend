import React, { useEffect, useState } from "react";
import { fetchLearningTimeline } from "../api/progress";
import "../styles/analytics.css";

export default function CourseAnalytics({ analytics, courseId }) {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchLearningTimeline(courseId)
      .then(res => setTimeline(res.data))
      .catch(err => console.error(err));
  }, [courseId]);

  return (
    <div className="analytics-wrapper">
      {/* Progress */}
      <div className="analytics-header">
        <span>Progress</span>
        <strong>{analytics.progressPercent}%</strong>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${analytics.progressPercent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="analytics-grid">
        <div>
          <h4>{analytics.completedLessons}/{analytics.totalLessons}</h4>
          <p>Lessons</p>
        </div>

        <div>
          <h4>{Math.round(analytics.totalTimeSpent / 60)} min</h4>
          <p>Time Spent</p>
        </div>

        <div>
          <h4>{analytics.learningStreak} 🔥</h4>
          <p>Day Streak</p>
        </div>

        <div>
          <h4>{analytics.courseCompleted ? "Yes" : "No"}</h4>
          <p>Completed</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        <h3>Learning Timeline</h3>

        {timeline.length === 0 ? (
          <p className="muted">No learning activity yet</p>
        ) : (
          timeline.map(day => (
            <div key={day.date} className="timeline-row">
              <span>{day.date}</span>
              <div className="timeline-bar">
                <div
                  style={{ width: `${day.timeSpent * 2}px` }}
                  className="timeline-fill"
                />
              </div>
              <span>{day.timeSpent} min</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
