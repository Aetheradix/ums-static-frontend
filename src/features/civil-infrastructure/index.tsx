import { Navigate, Route, Routes } from 'react-router-dom';

// ── Admin Pages ──────────────────────────────────────────────────
import AdminDashboard from './pages/admin/Dashboard';
import WorkRegistration from './pages/admin/WorkRegistration';
import WorkCategorization from './pages/admin/WorkCategorization';
import AdminApproval from './pages/admin/AdminApproval';
import TechnicalSanction from './pages/admin/TechnicalSanction';
import BudgetLock from './pages/admin/BudgetLock';
import TenderOversight from './pages/admin/TenderOversight';
import AgencyVerification from './pages/admin/AgencyVerification';
import WorkOrderSign from './pages/admin/WorkOrderSign';
import CompletionCertificate from './pages/admin/CompletionCertificate';
import AdminReports from './pages/admin/Reports';
import AdminSORMaster from './pages/admin/AdminSORMaster';
import AdminBOQCompilation from './pages/admin/AdminBOQCompilation';
import AdminMilestoneDefinition from './pages/admin/AdminMilestoneDefinition';
import AdminEOTRequest from './pages/admin/AdminEOTRequest';
import MilestoneApprovals from './pages/admin/MilestoneApprovals';

// ── Engineer Pages ───────────────────────────────────────────────
import EngineerDashboard from './pages/engineer/Dashboard';
import TechnicalPlanning from './pages/engineer/TechnicalPlanning';
import SORMaster from './pages/engineer/SORMaster';
import BOQCompilation from './pages/engineer/BOQCompilation';
import ExecutionRouter from './pages/engineer/ExecutionRouter';
import QualityFramework from './pages/engineer/QualityFramework';
import ProgressMonitoring from './pages/engineer/ProgressMonitoring';
import QualityTesting from './pages/engineer/QualityTesting';
import EMeasurementBook from './pages/engineer/EMeasurementBook';
import EOTRequest from './pages/engineer/EOTRequest';
import MilestoneSignoff from './pages/engineer/MilestoneSignoff';
import RequestCC from './pages/engineer/RequestCC';
import MBReport from './pages/engineer/MBReport';

// ── Finance Pages ────────────────────────────────────────────────
import FinanceDashboard from './pages/finance/Dashboard';
import BudgetAllocation from './pages/finance/BudgetAllocation';
import RABillProcessing from './pages/finance/RABillProcessing';
import FinalBillSettlement from './pages/finance/FinalBillSettlement';
import PaymentRelease from './pages/finance/PaymentRelease';
import DLPMonitoring from './pages/finance/DLPMonitoring';

/**
 * Civil Infrastructure Module Routes
 *
 * Mounted at path="civil-infrastructure/*" in the main features router.
 * Three role-based portals: admin, engineer, finance.
 */
export default function CivilInfrastructure() {
  return (
    <Routes>
      {/* Portal landing → redirect to sub-menu */}
      <Route
        index
        element={<Navigate to="/home/sub-menu/civil-infrastructure" replace />}
      />

      {/* ── Admin Login ───────────────────────────────────────────── */}
      <Route path="admin" element={<Navigate to="admin/dashboard" replace />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/work-registration" element={<WorkRegistration />} />
      <Route
        path="admin/work-categorization"
        element={<WorkCategorization />}
      />
      <Route path="admin/admin-approval" element={<AdminApproval />} />
      <Route path="admin/technical-sanction" element={<TechnicalSanction />} />
      <Route path="admin/budget-lock" element={<BudgetLock />} />
      <Route path="admin/tender-oversight" element={<TenderOversight />} />
      <Route
        path="admin/agency-verification"
        element={<AgencyVerification />}
      />
      <Route path="admin/work-order-sign" element={<WorkOrderSign />} />
      <Route
        path="admin/milestone-approvals"
        element={<MilestoneApprovals />}
      />
      <Route path="admin/eot-requests" element={<AdminEOTRequest />} />
      <Route
        path="admin/completion-certificate"
        element={<CompletionCertificate />}
      />
      <Route path="admin/reports" element={<AdminReports />} />
      <Route path="admin/sor-master" element={<AdminSORMaster />} />
      <Route path="admin/boq-compilation" element={<AdminBOQCompilation />} />
      <Route path="admin/milestones" element={<AdminMilestoneDefinition />} />

      {/* ── Site Engineer Login ───────────────────────────────────── */}
      <Route
        path="engineer"
        element={<Navigate to="engineer/dashboard" replace />}
      />
      <Route path="engineer/dashboard" element={<EngineerDashboard />} />
      <Route
        path="engineer/technical-planning"
        element={<TechnicalPlanning />}
      />
      <Route path="engineer/sor-master" element={<SORMaster />} />
      <Route path="engineer/boq-compilation" element={<BOQCompilation />} />
      <Route path="engineer/execution-router" element={<ExecutionRouter />} />
      <Route path="engineer/quality-framework" element={<QualityFramework />} />
      <Route
        path="engineer/progress-monitoring"
        element={<ProgressMonitoring />}
      />
      <Route path="engineer/quality-testing" element={<QualityTesting />} />
      <Route
        path="engineer/e-measurement-book"
        element={<EMeasurementBook />}
      />
      <Route path="engineer/eot-request" element={<EOTRequest />} />
      <Route path="engineer/milestone-signoff" element={<MilestoneSignoff />} />
      <Route path="engineer/request-cc" element={<RequestCC />} />
      <Route path="engineer/mb-report" element={<MBReport />} />

      {/* ── Finance Login ─────────────────────────────────────────── */}
      <Route
        path="finance"
        element={<Navigate to="finance/dashboard" replace />}
      />
      <Route path="finance/dashboard" element={<FinanceDashboard />} />
      <Route path="finance/budget-allocation" element={<BudgetAllocation />} />
      <Route path="finance/ra-bill-processing" element={<RABillProcessing />} />
      <Route
        path="finance/final-bill-settlement"
        element={<FinalBillSettlement />}
      />
      <Route path="finance/payment-release" element={<PaymentRelease />} />
      <Route path="finance/dlp-monitoring" element={<DLPMonitoring />} />
    </Routes>
  );
}
