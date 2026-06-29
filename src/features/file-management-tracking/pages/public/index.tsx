import { Navigate, Route, Routes } from 'react-router-dom';
import QuickAccessStatus from './QuickAccessStatus';

export default function PublicPages() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="/file-management-tracking" replace />}
      />
      <Route path="quick-status/:code" element={<QuickAccessStatus />} />
    </Routes>
  );
}
