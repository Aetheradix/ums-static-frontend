import { Route, Routes } from 'react-router-dom';

import InfraPortalPage from './portal/InfraPortalPage';
import InfraDashboard from './pages/Dashboard';
import ProjectMaster from './pages/ProjectMaster';
import ProjectProposal from './pages/ProjectProposal';
import BudgetAllocation from './pages/BudgetAllocation';
import TenderManagement from './pages/TenderManagement';
import ContractorManagement from './pages/ContractorManagement';
import WorkOrders from './pages/WorkOrders';
import ProjectMilestones from './pages/ProjectMilestones';
import ProgressMonitoring from './pages/ProgressMonitoring';
import MaterialManagement from './pages/MaterialManagement';
import BillManagement from './pages/BillManagement';
import PaymentTracking from './pages/PaymentTracking';
import Inspections from './pages/Inspections';
import CompletionHandover from './pages/CompletionHandover';
import Documents from './pages/Documents';
import ReportsPortalPage from './portal/ReportsPortalPage';
import ProjectProgressReport from './pages/reports/ProjectProgressReport';
import BudgetUtilizationReport from './pages/reports/BudgetUtilizationReport';
import ContractorPerformanceReport from './pages/reports/ContractorPerformanceReport';
import ProjectCompletionReport from './pages/reports/ProjectCompletionReport';

/**
 * Infrastructure Project Management Routes
 *
 * Mounted at path="infrastructure-project-management/*" in the main features router.
 * All child paths are RELATIVE (no leading slash).
 */
export default function InfrastructureProjectManagement() {
  return (
    <Routes>
      {/* Portal landing */}
      <Route index element={<InfraPortalPage />} />

      {/* Dashboard */}
      <Route path="dashboard" element={<InfraDashboard />} />

      {/* Phase 1 — Masters */}
      <Route path="project-master" element={<ProjectMaster />} />
      <Route path="contractor-management" element={<ContractorManagement />} />

      {/* Phase 2 — Planning */}
      <Route path="project-proposal" element={<ProjectProposal />} />
      <Route path="budget-allocation" element={<BudgetAllocation />} />
      <Route path="tender-management" element={<TenderManagement />} />

      {/* Phase 3 — Execution */}
      <Route path="work-orders" element={<WorkOrders />} />
      <Route path="project-milestones" element={<ProjectMilestones />} />
      <Route path="progress-monitoring" element={<ProgressMonitoring />} />
      <Route path="material-management" element={<MaterialManagement />} />

      {/* Phase 4 — Financial */}
      <Route path="bill-management" element={<BillManagement />} />
      <Route path="payment-tracking" element={<PaymentTracking />} />

      {/* Phase 5 — Closure */}
      <Route path="inspections" element={<Inspections />} />
      <Route path="completion-handover" element={<CompletionHandover />} />
      <Route path="documents" element={<Documents />} />
      <Route path="reports" element={<ReportsPortalPage />} />
      <Route
        path="reports/project-progress"
        element={<ProjectProgressReport />}
      />
      <Route
        path="reports/budget-utilization"
        element={<BudgetUtilizationReport />}
      />
      <Route
        path="reports/contractor-performance"
        element={<ContractorPerformanceReport />}
      />
      <Route
        path="reports/project-completion"
        element={<ProjectCompletionReport />}
      />
    </Routes>
  );
}
