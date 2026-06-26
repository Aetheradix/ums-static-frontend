import Settings from 'features/master/employee/settings';
import { Route, Routes } from 'react-router-dom';
import AppraisalManagement from './employee-self-service/appraisals/pages/AppraisalManagement';
import LeaveManagement from './employee-self-service/leave/pages/LeaveManagement';
import ResearchManagement from './employee-self-service/research/pages/ResearchManagement';
import TravelManagement from './employee-self-service/travel/pages/TravelManagement';
import FullOnboarding from './full-onboarding';
import ManageEmployees from './manage-employees';
import QuickOnboarding from './quick-onboarding';

export default function EmployeeManagement() {
  return (
    <Routes>
      <Route path="manage-employees/*" element={<ManageEmployees />} />
      <Route path="quick-onboarding/*" element={<QuickOnboarding />} />
      <Route path="full-onboarding/*" element={<FullOnboarding />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="leave" element={<LeaveManagement />} />
      <Route path="appraisals" element={<AppraisalManagement />} />
      <Route path="research" element={<ResearchManagement />} />
      <Route path="travel" element={<TravelManagement />} />
    </Routes>
  );
}
