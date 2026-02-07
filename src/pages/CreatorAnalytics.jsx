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

  if (!data) return <p className="loading-text">Loading analytics...</p>;

  return (
    <AuthLayout>
  <div className="analytics-page">
    <div className="analytics-wrapper">

      {/* PAGE HEADER */}
      <div className="analytics-header">
        <h1>Course Analytics</h1>
        <p>Track learner progress and engagement</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="analytics-cards">
        <div className="stat-card">
          <span className="stat-label">Total Learners</span>
          <h2>{data.totalLearners}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <h2>{data.completedLearners}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completion Rate</span>
          <h2>{data.completionRate}%</h2>
        </div>
      </div>

      {/* CHART GRID */}
      <div className="charts-grid">

        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Lesson Engagement</h3>
          <p className="chart-sub">Time spent per lesson</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.lessonTimeStats}>
              <XAxis dataKey="lessonTitle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalTime" fill="#3ddc84" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Daily Active Learners</h3>
          <p className="chart-sub">User activity over time</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#3ddc84"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  </div>
</AuthLayout>
  );
}
