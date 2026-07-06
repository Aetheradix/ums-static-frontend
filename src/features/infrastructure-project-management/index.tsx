import { Navigate, Route, Routes } from 'react-router-dom';

import BillManagement from './pages/BillManagement';
import BudgetAllocation from './pages/BudgetAllocation';
import CompletionHandover from './pages/CompletionHandover';
import ContractorManagement from './pages/ContractorManagement';
import InfraDashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Inspections from './pages/Inspections';
import MaterialManagement from './pages/MaterialManagement';
import PaymentTracking from './pages/PaymentTracking';
import ProgressMonitoring from './pages/ProgressMonitoring';
import ProjectMaster from './pages/ProjectMaster';
import ProjectMilestones from './pages/ProjectMilestones';
import ProjectProposal from './pages/ProjectProposal';
import BudgetUtilizationReport from './pages/reports/BudgetUtilizationReport';
import ContractorPerformanceReport from './pages/reports/ContractorPerformanceReport';
import ProjectCompletionReport from './pages/reports/ProjectCompletionReport';
import ProjectProgressReport from './pages/reports/ProjectProgressReport';
import TenderManagement from './pages/TenderManagement';
import WorkOrders from './pages/WorkOrders';

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
      <Route
        index
        element={
          <Navigate
            to="/home/sub-menu/infrastructure-project-management"
            replace
          />
        }
      />

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
      <Route
        path="reports"
        element={<Navigate to="/home/sub-menu/infra-reports" replace />}
      />
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
