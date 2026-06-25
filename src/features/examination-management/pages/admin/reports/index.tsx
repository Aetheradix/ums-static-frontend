import { Route, Routes } from 'react-router-dom';
import ReportsDashboard from './ReportsDashboard';

export default function ReportsPages() {
  return (
    <Routes>
      <Route index element={<ReportsDashboard />} />
    </Routes>
  );
}
