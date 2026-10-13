import { Navigate, Route, Routes } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { crumbs } from '../components/hooks';
import TeachingReport from '../components/TeachingReport';
import Bills from './pages/Bills';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import RateMaster from './pages/RateMaster';
import { vfUrls } from '../urls';

function Reports() {
  return (
    <FormPage
      title="Teaching & Payment Report"
      description="Faculty-wise lectures, practicals, bill value and amount paid, across all UTDs."
      breadcrumbs={crumbs('finance', 'Reports')}
    >
      <TeachingReport />
    </FormPage>
  );
}

export default function FinanceLogin() {
  return (
    <Routes>
      <Route index element={<Navigate to={vfUrls.finance.portal} replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="bills" element={<Bills />} />
      <Route path="ledger" element={<Ledger />} />
      <Route path="rate-master" element={<RateMaster />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
