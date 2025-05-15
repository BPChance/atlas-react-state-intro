import logo from './assets/logo.png';
import { useCourseContext } from './CourseContext';

export default function Header() {
  const { enrolledCourses } = useCourseContext();

  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />
      <div className="enrollment">
        Classes Enrolled: {enrolledCourses.length}
      </div>
    </div>
  );
}
