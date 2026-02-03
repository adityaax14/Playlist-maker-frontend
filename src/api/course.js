import React from "react";

const BASE_URL="http://localhost:8000/api/v2/courses";

export const fetchCourses= async()=>{
   const res= await fetch(BASE_URL,{
     credentials: "include"
   });
   return res.json();
};

export const createCourse= async(data)=>{
  const res=await fetch(BASE_URL,{
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    credentials: "include",
    body:JSON.stringify(data)

  });
  return res.json();
}
export const getCourseById= async(courseId)=>{
  const res=await fetch(`http://localhost:8000/api/v2/courses/${courseId}`,
    {
      credentials:"include"
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch course");
  }

  return res.json();

}

export const addLesson = async (courseId, data) => {
  const res = await fetch(
    `${BASE_URL}/${courseId}/lessons`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add lesson");
  }

  return res.json();
};

export const getLessonById= async(courseId,lessonId)=>{
  const res= await fetch(`${BASE_URL}/${courseId}/lessons/${lessonId}`,
    {credentials:"include"}
  );
  if (!res.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return res.json();
}
