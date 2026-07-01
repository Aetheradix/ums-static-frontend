import { Route, Routes } from 'react-router-dom';
import StudentPortalPage from './StudentPortalPage';
import MyTimetable from './pages/MyTimetable';
import ExamSchedule from './pages/ExamSchedule';

export default function StudentPortalLayout() {
  return (
    <Routes>
      <Route index element={<StudentPortalPage />} />
      <Route path="timetable" element={<MyTimetable />} />
      <Route path="exams" element={<ExamSchedule />} />
    </Routes>
  );
}
