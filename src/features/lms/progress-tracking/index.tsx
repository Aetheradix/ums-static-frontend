import { Route, Routes, Navigate } from 'react-router-dom';
import CourseProgress from './pages/CourseProgress';

export default function ProgressTracking() {
  return (
    <Routes>
      <Route index element={<Navigate to="course-progress" replace />} />
      <Route path="course-progress/*" element={<CourseProgress />} />
    </Routes>
  );
}
