import { Route, Routes } from 'react-router-dom';
import TimetablePortalPage from './portal/TimetablePortalPage';
import AdminPortalLayout from './admin';
import SchedulerPortalLayout from './scheduler';
import FacultyPortalLayout from './faculty';
import StudentPortalLayout from './student';

export default function TimetableManagementRoutes() {
  return (
    <Routes>
      <Route index element={<TimetablePortalPage />} />
      <Route path="admin/*" element={<AdminPortalLayout />} />
      <Route path="scheduler/*" element={<SchedulerPortalLayout />} />
      <Route path="faculty/*" element={<FacultyPortalLayout />} />
      <Route path="student/*" element={<StudentPortalLayout />} />
    </Routes>
  );
}

export {
  TimetablePortalPage,
  AdminPortalLayout,
  SchedulerPortalLayout,
  FacultyPortalLayout,
  StudentPortalLayout,
};
