import Settings from 'features/master/employee/settings';
import { Route, Routes } from 'react-router-dom';
import BulkImport from './bulk-import';
import CareerEventTracking from './career-event-tracking/pages/CareerEventTracking';
import EMSDashboard from './dashboard/pages/EMSDashboard';
import AppraisalManagement from './employee-self-service/appraisals/pages/AppraisalManagement';
import PersonalAppraisal from './employee-self-service/appraisals/pages/PersonalAppraisal';
import ESSDashboard from './employee-self-service/dashboard/ESSDashboard';
import LeaveApproval from './employee-self-service/leave/pages/LeaveApproval';
import LeaveManagement from './employee-self-service/leave/pages/LeaveManagement';
import ResearchManagement from './employee-self-service/research/pages/ResearchManagement';
import TravelManagement from './employee-self-service/travel/pages/TravelManagement';
import FullOnboarding from './full-onboarding';
import HeadcountControl from './headcount-control/pages/HeadcountControl';
import ManageEmployees from './manage-employees';
import QuickOnboarding from './quick-onboarding';

export default function EmployeeManagement() {
  return (
    <Routes>
      <Route path="dashboard" element={<EMSDashboard />} />
      <Route path="manage-employees/*" element={<ManageEmployees />} />
      <Route path="quick-onboarding/*" element={<QuickOnboarding />} />
      <Route path="full-onboarding/*" element={<FullOnboarding />} />
      <Route path="bulk-import/*" element={<BulkImport />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="leave" element={<LeaveManagement />} />
      <Route path="leave-approval" element={<LeaveApproval />} />
      <Route path="appraisals" element={<AppraisalManagement />} />
      <Route path="personal-appraisal" element={<PersonalAppraisal />} />
      <Route path="research" element={<ResearchManagement />} />
      <Route path="travel" element={<TravelManagement />} />
      <Route path="career-event-tracking" element={<CareerEventTracking />} />
      <Route path="headcount-control" element={<HeadcountControl />} />
      <Route path="ess-dashboard" element={<ESSDashboard />} />
      <Route path="*" element={<EMSDashboard />} />
    </Routes>
  );
}
