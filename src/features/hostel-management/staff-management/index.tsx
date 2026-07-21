import { Navigate, Route, Routes } from 'react-router-dom';
import StaffRegistration from './pages/StaffRegistration';
import ShiftAssignment from './pages/ShiftAssignment';
import StaffAttendance from './pages/StaffAttendance';
import StaffPerformance from './pages/StaffPerformance';

export default function StaffManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="registration" replace />} />
      <Route path="registration" element={<StaffRegistration />} />
      <Route path="shifts" element={<ShiftAssignment />} />
      <Route path="attendance" element={<StaffAttendance />} />
      <Route path="performance" element={<StaffPerformance />} />
    </Routes>
  );
}
