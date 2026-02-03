import { useState } from "react";
import { createCourse } from "../api/course";
import React from "react";

export default function CreateCourse({ onCourseCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createCourse(form);

    if (res?.data) {
      onCourseCreated(res.data); 
      setForm({
        title: "",
        description: "",
        category: "",
        level: "beginner"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-course-form">
      <h3>Create a Course</h3>

      <input
        name="title"
        placeholder="Course Title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Course Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category (e.g. Programming)"
        value={form.category}
        onChange={handleChange}
      />

      <select name="level" value={form.level} onChange={handleChange}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button type="submit">Create Course</button>
    </form>
  );
}
