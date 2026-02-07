import React from "react";
const BASE_URL = "http://localhost:8000/api/v2";

export const startLesson = async (courseId, lessonId) => {
  await fetch(
    `${BASE_URL}/courses/${courseId}/lessons/${lessonId}/start`,
    { method: "POST", credentials: "include" }
  );
};

export const completeLesson = async (courseId, lessonId) => {
  await fetch(
    `${BASE_URL}/courses/${courseId}/lessons/${lessonId}/complete`,
    { method: "POST", credentials: "include" }
  );
};

export const fetchCourseProgress = async (courseId) => {
  const res = await fetch(
    `${BASE_URL}/courses/${courseId}/progress`,
    { credentials: "include" }
  );
  return res.json();
};

export const updateLessonTime=async(courseId, lessonId, seconds)=>{
  await fetch(`${BASE_URL}/${courseId}/${lessonId}/time`,
    {
      method:"POST",
      headers:{"Content-Type": "application/json"},
      credentials:"include",
      body: JSON.stringify({seconds})
    }
  );
  
};

export const fetchCourseAnalytics = async (courseId) => {
  const res = await fetch(
    `http://localhost:8000/api/v2/progress/${courseId}/analytics`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
};

export const fetchLearningTimeline=async(courseId)=>{
  const res= await fetch(`${BASE_URL}/progress/${courseId}/timeline`,
    {credentials:"include"}
  );
  if (!res.ok) throw new Error("Failed to fetch timeline");

  return res.json();
}


export const fetchCreatorAnalytics = async (courseId) => {
  const res = await fetch(`${BASE_URL}/progress/creator/${courseId}/analytics`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
};
