import React from 'react';
import { useState, useEffect } from 'react';
import { useCourseContext } from './CourseContext';

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const { enrolledCourses, enrollCourse } = useCourseContext();

  useEffect(() => {
    fetch('/api/courses.json')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  const filteredCourses = courses.filter((course) => {
    const lowercasedSearchQuery = searchQuery.toLowerCase();
    return (
      course.courseNumber.toLowerCase().includes(lowercasedSearchQuery) ||
      course.courseName.toLowerCase().includes(lowercasedSearchQuery)
    );
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const isAscending = sortConfig.direction === 'asc';
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      if (isAscending) {
        return -1;
      } else {
        return 1;
      }
    }

    if (aValue > bValue) {
      if (isAscending) {
        return 1;
      } else {
        return -1;
      }
    }

    return 0;
  });

  const indexOfLastCourse = page * PAGE_SIZE;
  const indexOfFirstCourse = indexOfLastCourse - PAGE_SIZE;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleNextPage = () => {
    if (page < Math.ceil(sortedCourses.length / PAGE_SIZE)) {
      setPage(page + 1);
    }
  };
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleEnroll = (course) => {
    if (
      !enrolledCourses.some(
        (enrolled) => enrolled.courseNumber === course.courseNumber
      )
    ) {
      enrollCourse(course);
    } else {
      alert('This course is already enrolled');
    }
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('trimester')}>Trimester</th>
            <th onClick={() => handleSort('courseNumber')}>Course Number</th>
            <th onClick={() => handleSort('courseName')}>Courses Name</th>
            <th onClick={() => handleSort('semesterCredits')}>
              Semester Credits
            </th>
            <th onClick={() => handleSort('totalClockHours')}>
              Total Clock Hours
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course.courseNumber}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button onClick={() => handleEnroll(course)}>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(filteredCourses.length / PAGE_SIZE)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
