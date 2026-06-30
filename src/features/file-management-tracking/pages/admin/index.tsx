import { Navigate, Route, Routes } from 'react-router-dom';
import AuditLogs from './AuditLogs';
import Dashboard from './Dashboard';
import Departments from './Departments';
import DiaryConfig from './DiaryConfig';
import FileTypes from './FileTypes';
import Inbox from './Inbox';
import PrintCenter from './PrintCenter';
import Reports from './Reports';
import RetentionPolicies from './RetentionPolicies';
import Users from './Users';
import Workflows from './Workflows';

export default function AdminPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="file-types" element={<FileTypes />} />
      <Route path="diary-config" element={<DiaryConfig />} />
      <Route path="retention-policies" element={<RetentionPolicies />} />
      <Route path="departments" element={<Departments />} />
      <Route path="users" element={<Users />} />
      <Route path="workflows" element={<Workflows />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="print-center" element={<PrintCenter />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
