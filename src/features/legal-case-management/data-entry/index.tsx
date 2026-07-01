import { Route, Routes } from 'react-router-dom';
import CaseForm from '../admin/pages/CaseForm';
import { legalUrls } from '../urls';
import DataEntryPortalPage from './DataEntryPortalPage';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';

export default function DataEntryPortalLayout() {
  return (
    <Routes>
      <Route index element={<DataEntryPortalPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="cases" element={<CaseList />} />
      <Route
        path="cases/new"
        element={<CaseForm casesUrl={legalUrls.dataEntry.cases} />}
      />
    </Routes>
  );
}
