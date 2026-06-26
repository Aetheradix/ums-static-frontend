import { Route, Routes } from 'react-router-dom';
import CourseProgress from './pages/CourseProgress';

export default function ProgressTracking() {
  return (
    <Routes>
      <Route path="course-progress/*" element={<CourseProgress />} />
    </Routes>
  );
}
