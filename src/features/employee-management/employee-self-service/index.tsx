import { Route, Routes } from 'react-router-dom';
import LeaveManagement from './leave/pages/LeaveManagement';
import AppraisalManagement from './appraisals/pages/AppraisalManagement';
import ResearchManagement from './research/pages/ResearchManagement';
import TravelManagement from './travel/pages/TravelManagement';

export default function EmployeeSelfService() {
  return (
    <Routes>
      <Route path="leave" element={<LeaveManagement />} />
      <Route path="appraisals" element={<AppraisalManagement />} />
      <Route path="research" element={<ResearchManagement />} />
      <Route path="travel" element={<TravelManagement />} />
    </Routes>
  );
}
