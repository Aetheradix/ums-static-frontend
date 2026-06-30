import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import FileDetails from './FileDetails';
import Inbox from './Inbox';
import Reports from './Reports';

export default function ApproverPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="file-details/:id" element={<FileDetails />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
