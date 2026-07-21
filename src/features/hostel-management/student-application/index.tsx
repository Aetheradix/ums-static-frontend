import { Navigate, Route, Routes } from 'react-router-dom';
import StudentApplicationForm from './pages/StudentApplicationForm';
import ApplicationScrutinyList from './pages/ApplicationScrutinyList';
import ScrutinyDetails from './pages/ScrutinyDetails';
import ApplicationStatus from './pages/ApplicationStatus';

export default function StudentApplication() {
  return (
    <Routes>
      <Route index element={<Navigate to="apply" replace />} />
      <Route path="apply" element={<StudentApplicationForm />} />
      <Route path="scrutiny-list" element={<ApplicationScrutinyList />} />
      <Route path="scrutiny-details/:appId" element={<ScrutinyDetails />} />
      <Route path="status" element={<ApplicationStatus />} />
    </Routes>
  );
}
