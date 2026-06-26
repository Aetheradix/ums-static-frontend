import { Route, Routes } from 'react-router-dom';
import AppraisalReports from './pages/AppraisalReports';
import CareerEventReports from './pages/CareerEventReports';
import HeadcountReports from './pages/HeadcountReports';
import LeaveReports from './pages/LeaveReports';
import Reports from './pages/Reports';
import ResearchReports from './pages/ResearchReports';
import TravelReports from './pages/TravelReports';

export default function EmployeeReports() {
  return (
    <Routes>
      <Route path="registration" element={<Reports />} />
      <Route path="leave" element={<LeaveReports />} />
      <Route path="research" element={<ResearchReports />} />
      <Route path="appraisals" element={<AppraisalReports />} />
      <Route path="travel" element={<TravelReports />} />
      <Route path="career-events" element={<CareerEventReports />} />
      <Route path="headcount" element={<HeadcountReports />} />
      <Route path="*" element={<Reports />} />
    </Routes>
  );
}
