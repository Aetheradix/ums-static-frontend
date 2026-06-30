import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import AdminDashboard from './pages/Dashboard';
import ProgramMaster from './pages/ProgramMaster';
import AreaMaster from './pages/AreaMaster';
import DeptMaster from './pages/DeptMaster';
import SupervisorMaster from './pages/SupervisorMaster';
import CommitteeMaster from './pages/CommitteeMaster';
import MilestoneConfig from './pages/MilestoneConfig';
import WorkflowConfig from './pages/WorkflowConfig';
import PlagiarismSettings from './pages/PlagiarismSettings';
import RepositoryConfig from './pages/RepositoryConfig';
import NotificationTemplates from './pages/NotificationTemplates';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Permissions from './pages/Permissions';

export default function AdminPortalLayout() {
  return (
    <Routes>
      <Route index element={<AdminPortalPage />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="program-master" element={<ProgramMaster />} />
      <Route path="area-master" element={<AreaMaster />} />
      <Route path="dept-master" element={<DeptMaster />} />
      <Route path="supervisor-master" element={<SupervisorMaster />} />
      <Route path="committee-master" element={<CommitteeMaster />} />
      <Route path="milestone-config" element={<MilestoneConfig />} />
      <Route path="workflow-config" element={<WorkflowConfig />} />
      <Route path="plagiarism-settings" element={<PlagiarismSettings />} />
      <Route path="repository-config" element={<RepositoryConfig />} />
      <Route
        path="notification-templates"
        element={<NotificationTemplates />}
      />
      <Route path="reports" element={<Reports />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="permissions" element={<Permissions />} />
    </Routes>
  );
}
