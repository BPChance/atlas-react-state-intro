import React from 'react';
import { createContext, useState, useContext } from 'react';

const CourseContext = createContext();

export const useCourseContext = () => {
  return useContext(CourseContext);
};

export const CourseProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const enrollCourse = (course) => {
    setEnrolledCourses((prevCourses) => [...prevCourses, course]);
  };

  const dropCourse = (courseNumber) => {
    setEnrolledCourses((prevCourses) =>
      prevCourses.filter((course) => course.courseNumber !== courseNumber)
    );
  };

  return (
    <CourseContext.Provider
      value={{ enrolledCourses, enrollCourse, dropCourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};
