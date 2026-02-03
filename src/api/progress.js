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
