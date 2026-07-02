import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PolicyMaster from './pages/PolicyMaster';
import PolicyReview from './pages/PolicyReview';
import PolicyApproval from './pages/PolicyApproval';
import PublishedPolicies from './pages/PublishedPolicies';
import Acknowledgements from './pages/Acknowledgements';
import ComplianceRequirements from './pages/ComplianceRequirements';
import ComplianceAssignments from './pages/ComplianceAssignments';
import ComplianceSubmissions from './pages/ComplianceSubmissions';
import ComplianceVerification from './pages/ComplianceVerification';
import AuditManagement from './pages/AuditManagement';
import NonComplianceManagement from './pages/NonComplianceManagement';
import CorrectiveActions from './pages/CorrectiveActions';
import Reports from './pages/Reports';
import PortalLanding from './pages/PortalLanding';
import StudentMyPolicies from './pages/StudentMyPolicies';
import StudentMyTasks from './pages/StudentMyTasks';
import StudentComplianceHistory from './pages/StudentComplianceHistory';

export default function PolicyComplianceManagement() {
  return (
    <Routes>
      <Route index element={<PortalLanding />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="policies" element={<PolicyMaster />} />
      <Route path="policy-review" element={<PolicyReview />} />
      <Route path="policy-approval" element={<PolicyApproval />} />
      <Route path="published-policies" element={<PublishedPolicies />} />
      <Route path="acknowledgements" element={<Acknowledgements />} />
      <Route
        path="compliance-requirements"
        element={<ComplianceRequirements />}
      />
      <Route
        path="compliance-assignments"
        element={<ComplianceAssignments />}
      />
      <Route
        path="compliance-submissions"
        element={<ComplianceSubmissions />}
      />
      <Route
        path="compliance-verification"
        element={<ComplianceVerification />}
      />
      <Route path="audits" element={<AuditManagement />} />
      <Route path="non-compliance" element={<NonComplianceManagement />} />
      <Route path="corrective-actions" element={<CorrectiveActions />} />
      <Route path="reports" element={<Reports />} />

      {/* Student Routes */}
      <Route path="my-policies" element={<StudentMyPolicies />} />
      <Route path="my-tasks" element={<StudentMyTasks />} />
      <Route path="compliance-history" element={<StudentComplianceHistory />} />
    </Routes>
  );
}
