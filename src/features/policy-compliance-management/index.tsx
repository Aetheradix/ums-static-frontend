import { Navigate, Route, Routes } from 'react-router-dom';
import Acknowledgements from './pages/Acknowledgements';
import AuditManagement from './pages/AuditManagement';
import ComplianceAssignments from './pages/ComplianceAssignments';
import ComplianceRequirements from './pages/ComplianceRequirements';
import ComplianceSubmissions from './pages/ComplianceSubmissions';
import ComplianceVerification from './pages/ComplianceVerification';
import CorrectiveActions from './pages/CorrectiveActions';
import Dashboard from './pages/Dashboard';
import NonComplianceManagement from './pages/NonComplianceManagement';
import PolicyApproval from './pages/PolicyApproval';
import PolicyMaster from './pages/PolicyMaster';
import PolicyReview from './pages/PolicyReview';
import PublishedPolicies from './pages/PublishedPolicies';
import Reports from './pages/Reports';
import StudentComplianceHistory from './pages/StudentComplianceHistory';
import StudentMyPolicies from './pages/StudentMyPolicies';
import StudentMyTasks from './pages/StudentMyTasks';

export default function PolicyComplianceManagement() {
  return (
    <Routes>
      <Route
        index
        element={
          <Navigate to="/home/sub-menu/policy-compliance-management" replace />
        }
      />
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
