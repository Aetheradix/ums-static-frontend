import { Route, Routes } from 'react-router-dom';
import StudentApplicationDetail from './StudentApplicationDetail';
import StudentApplications from './StudentApplications';
import { EligibilityVerification } from './EligibilityVerification';

export default function ApplicationsPages() {
  return (
    <Routes>
      <Route index element={<StudentApplications />} />
      <Route
        path="eligibility/:sessionId"
        element={<EligibilityVerification />}
      />
      <Route path=":id" element={<StudentApplicationDetail />} />
    </Routes>
  );
}
