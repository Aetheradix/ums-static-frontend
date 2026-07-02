import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import CaseForm from './pages/CaseForm';
import CaseDetail from './pages/CaseDetail';
import Hearings from './pages/Hearings';
import Payments from './pages/Payments';
import Reports from './pages/Reports';

export default function AdminPortalLayout() {
  return (
    <Routes>
      <Route index element={<AdminPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="cases" element={<CaseList />} />
      <Route path="cases/new" element={<CaseForm />} />
      <Route path="cases/:id/edit" element={<CaseForm />} />
      <Route path="cases/:id" element={<CaseDetail />} />
      <Route path="hearings" element={<Hearings />} />
      <Route path="payments" element={<Payments />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
