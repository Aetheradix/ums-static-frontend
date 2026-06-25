import { Route, Routes } from 'react-router-dom';
import AparApplication from './apar-application';
import EmployeeSelfAssessment from './employee-self-assessment';
import SessionsManagement from './sessions-management';

export default function CareerAdvancement() {
  return (
    <Routes>
      <Route
        path="employee-self-assessment/*"
        element={<EmployeeSelfAssessment />}
      />
      <Route path="sessions-management/*" element={<SessionsManagement />} />
      <Route path="apar-application/*" element={<AparApplication />} />
    </Routes>
  );
}
