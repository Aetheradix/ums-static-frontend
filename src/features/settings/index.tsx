import { Route, Routes } from 'react-router-dom';
import EmployeeProfile from './employee-profile/pages/EmployeeProfile';
import Settings from './pages/Settings';
import MyProfile from './pages/my-profile/MyProfile';
import StudentSportsProfile from './student-sports-profile/pages/StudentSportsProfile';

export default function SettingsFeature() {
  return (
    <Routes>
      <Route index element={<Settings />} />
      <Route path="my-profile" element={<MyProfile />} />
      <Route path="employee-profile/:id" element={<EmployeeProfile />} />
      <Route
        path="student-sports-profile/:id"
        element={<StudentSportsProfile />}
      />
    </Routes>
  );
}
