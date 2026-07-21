import { Navigate, Route, Routes } from 'react-router-dom';
import MedicalEmergencyLog from './pages/MedicalEmergencyLog';
import SickDietRequest from './pages/SickDietRequest';
import FirstAidManagement from './pages/FirstAidManagement';
import MessMenuManagement from './pages/MessMenuManagement';
import MealAttendance from './pages/MealAttendance';
import MessFeedback from './pages/MessFeedback';

export default function HealthMessManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="emergency-log" replace />} />
      <Route path="emergency-log" element={<MedicalEmergencyLog />} />
      <Route path="sick-diet" element={<SickDietRequest />} />
      <Route path="first-aid" element={<FirstAidManagement />} />
      <Route path="mess-menu" element={<MessMenuManagement />} />
      <Route path="meal-attendance" element={<MealAttendance />} />
      <Route path="mess-feedback" element={<MessFeedback />} />
    </Routes>
  );
}
