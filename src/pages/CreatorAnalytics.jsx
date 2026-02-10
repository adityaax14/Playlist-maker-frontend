import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { fetchCreatorAnalytics } from "../api/progress.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer
} from "recharts";
import "../styles/Analytics.css";

export default function CreatorAnalytics() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchCreatorAnalytics(courseId)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [courseId]);

  if (!data) return <div className="loading-container"><p className="loading-text">Loading analytics...</p></div>;

  return (
  <AuthLayout>
    <div className="analytics-page">
      <div className="analytics-container">

        {/* HEADER */}
        <div className="analytics-header">
          <h1>Course Analytics</h1>
          <p>Track learner progress and engagement</p>
        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              👥
            </div>
            <p className="stat-label">Total Learners</p>
            <h2 className="stat-value">{data.totalLearners}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✅
            </div>
            <p className="stat-label">Completed</p>
            <h2 className="stat-value">{data.completedLearners}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📈
            </div>
            <p className="stat-label">Completion Rate</p>
            <h2 className="stat-value">{data.completionRate}%</h2>
          </div>
        </div>

        {/* LESSON ENGAGEMENT CHART */}
        <div className="chart-card">
          <h3>Lesson Engagement</h3>
          <p className="chart-sub">Time spent per lesson</p>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.lessonTimeStats}>
              <XAxis dataKey="lessonTitle" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalTime"
                fill="#34d399"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAILY ACTIVE LEARNERS */}
        <div className="chart-card">
          <h3>Daily Active Learners</h3>
          <p className="chart-sub">User activity over time</p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.dailyActivity}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#1e3a45"
              />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  </AuthLayout>
);
  
}