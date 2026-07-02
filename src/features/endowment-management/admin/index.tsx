import { Route, Routes } from 'react-router-dom';
import AdminPortalPage from './AdminPortalPage';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import DisbursementPage from './pages/disbursement/DisbursementPage';
import DonationsPage from './pages/donations/DonationsPage';
import DonorsPage from './pages/donors/DonorsPage';
import FundsPage from './pages/funds/FundsPage';
import FundUtilizationReportPage from './pages/reports/FundUtilizationReportPage';
import DonorAcknowledgementReportPage from './pages/reports/DonorAcknowledgementReportPage';
import SchemePerformanceReportPage from './pages/reports/SchemePerformanceReportPage';
import SchemesPage from './pages/schemes/SchemesPage';
import BeneficiarySelectionPage from './pages/selection/BeneficiarySelectionPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminPortalPage />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="donors" element={<DonorsPage />} />
      <Route path="donations" element={<DonationsPage />} />
      <Route path="funds" element={<FundsPage />} />
      <Route path="schemes" element={<SchemesPage />} />
      <Route path="selection" element={<BeneficiarySelectionPage />} />
      <Route path="disbursement" element={<DisbursementPage />} />
      <Route
        path="reports/fund-utilization"
        element={<FundUtilizationReportPage />}
      />
      <Route
        path="reports/donor-acknowledgement"
        element={<DonorAcknowledgementReportPage />}
      />
      <Route
        path="reports/scheme-performance"
        element={<SchemePerformanceReportPage />}
      />
    </Routes>
  );
}
