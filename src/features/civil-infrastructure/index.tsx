import { Navigate, Route, Routes } from 'react-router-dom';

// ── Admin Core Pages ──────────────────────────────────────────────
import AdminApproval from './pages/admin/AdminApproval';
import AdminBOQCompilation from './pages/admin/AdminBOQCompilation';
import AdminEOTRequest from './pages/admin/AdminEOTRequest';
import AdminMilestoneDefinition from './pages/admin/AdminMilestoneDefinition';
import AdminSORMaster from './pages/admin/AdminSORMaster';
import AgencyVerification from './pages/admin/AgencyVerification';
import BudgetLock from './pages/admin/BudgetLock';
import CompletionCertificate from './pages/admin/CompletionCertificate';
import AdminDashboard from './pages/admin/Dashboard';
import MilestoneApprovals from './pages/admin/MilestoneApprovals';
import AdminReports from './pages/admin/Reports';
import TechnicalSanction from './pages/admin/TechnicalSanction';
import TenderOversight from './pages/admin/TenderOversight';
import WorkCategorization from './pages/admin/WorkCategorization';
import WorkOrderSign from './pages/admin/WorkOrderSign';
import WorkRegistration from './pages/admin/WorkRegistration';

// ── Admin Gap-Fill & Indian Workflow Pages ─────────────────────────
import StatutoryCompliance from './pages/admin/StatutoryCompliance';
import TPIReports from './pages/admin/TPIReports';

// ── Admin Masters ──────────────────────────────────────────────────
import FundingSourceMaster from './pages/admin/masters/FundingSourceMaster';
import MandateDocumentMaster from './pages/admin/masters/MandateDocumentMaster';
import MBStatusMaster from './pages/admin/masters/MBStatusMaster';
import ProjectMaster from './pages/admin/masters/ProjectMaster';
import QualityLabMaster from './pages/admin/masters/QualityLabMaster';
import SORChapter from './pages/admin/masters/SORChapter';
import SORItemMaster from './pages/admin/masters/SORItemMaster';
import SORSubject from './pages/admin/masters/SORSubject';
import SORType from './pages/admin/masters/SORType';
import StatusMaster from './pages/admin/masters/StatusMaster';
import TPIAgencyMaster from './pages/admin/masters/TPIAgencyMaster';
import WorkCategoryMaster from './pages/admin/masters/WorkCategoryMaster';
import WorkDepartmentMaster from './pages/admin/masters/WorkDepartmentMaster';

// ── Engineer Pages ─────────────────────────────────────────────────
import BOQCompilation from './pages/engineer/BOQCompilation';
import EngineerDashboard from './pages/engineer/Dashboard';
import ExecutionRouter from './pages/engineer/ExecutionRouter';
import MBReport from './pages/engineer/MBReport';
import ProgressMonitoring from './pages/engineer/ProgressMonitoring';
import QualityFramework from './pages/engineer/QualityFramework';
import QualityTesting from './pages/engineer/QualityTesting';
import SORMaster from './pages/engineer/SORMaster';
import TechnicalPlanning from './pages/engineer/TechnicalPlanning';

// ── Finance Pages ──────────────────────────────────────────────────
import BudgetAllocation from './pages/finance/BudgetAllocation';
import FinanceDashboard from './pages/finance/Dashboard';
import DLPMonitoring from './pages/finance/DLPMonitoring';
import FinalBillSettlement from './pages/finance/FinalBillSettlement';
import RABillProcessing from './pages/finance/RABillProcessing';

// ── Vendor Login / Admin User Pages ─────────────────────────────────
import EMeasurementBook from './pages/vendor/EMeasurementBook';
import EOTRequest from './pages/vendor/EOTRequest';
import MilestoneSignoff from './pages/vendor/MilestoneSignoff';
import PaymentRelease from './pages/vendor/PaymentRelease';
import RequestCC from './pages/vendor/RequestCC';
import UtilizationCertificate from './pages/vendor/UtilizationCertificate';
import WorkManpowerMapping from './pages/vendor/WorkManpowerMapping';

/**
 * Civil Infrastructure Module Routes
 *
 * Mounted at path="civil-infrastructure/*" in the main features router.
 * Four role-based portals: admin, engineer, finance, and vendor with comprehensive masters and Indian workflow routes.
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
      <Route
        path="admin"
        element={
          <Navigate to="/civil-infrastructure/admin/dashboard" replace />
        }
      />
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
        path="admin/work-manpower-mapping"
        element={
          <Navigate
            to="/civil-infrastructure/vendor/work-manpower-mapping"
            replace
          />
        }
      />
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

      {/* Admin Gap-Fill & Indian Workflow Pages */}
      <Route
        path="admin/statutory-compliance"
        element={<StatutoryCompliance />}
      />
      <Route path="admin/tpi-reports" element={<TPIReports />} />

      {/* Admin Masters */}
      <Route path="admin/masters/sor-type" element={<SORType />} />
      <Route path="admin/masters/sor-chapter" element={<SORChapter />} />
      <Route path="admin/masters/sor-subject" element={<SORSubject />} />
      <Route path="admin/masters/sor-items" element={<SORItemMaster />} />
      <Route path="admin/masters/projects" element={<ProjectMaster />} />
      <Route
        path="admin/masters/work-categories"
        element={<WorkCategoryMaster />}
      />
      <Route
        path="admin/masters/work-departments"
        element={<WorkDepartmentMaster />}
      />
      <Route
        path="admin/masters/funding-sources"
        element={<FundingSourceMaster />}
      />
      <Route
        path="admin/masters/mandate-documents"
        element={<MandateDocumentMaster />}
      />
      <Route path="admin/masters/quality-labs" element={<QualityLabMaster />} />
      <Route path="admin/masters/tpi-agencies" element={<TPIAgencyMaster />} />
      <Route path="admin/masters/mb-statuses" element={<MBStatusMaster />} />
      <Route path="admin/masters/statuses" element={<StatusMaster />} />

      {/* ── Site Engineer Login ───────────────────────────────────── */}
      <Route
        path="engineer"
        element={
          <Navigate to="/civil-infrastructure/engineer/dashboard" replace />
        }
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
        element={
          <Navigate
            to="/civil-infrastructure/vendor/e-measurement-book"
            replace
          />
        }
      />
      <Route
        path="engineer/eot-request"
        element={
          <Navigate to="/civil-infrastructure/vendor/eot-request" replace />
        }
      />
      <Route
        path="engineer/milestone-signoff"
        element={
          <Navigate
            to="/civil-infrastructure/vendor/milestone-status"
            replace
          />
        }
      />
      <Route
        path="engineer/request-cc"
        element={
          <Navigate to="/civil-infrastructure/vendor/request-cc" replace />
        }
      />
      <Route path="engineer/mb-report" element={<MBReport />} />

      {/* ── Finance Login ─────────────────────────────────────────── */}
      <Route
        path="finance"
        element={
          <Navigate to="/civil-infrastructure/finance/dashboard" replace />
        }
      />
      <Route path="finance/dashboard" element={<FinanceDashboard />} />
      <Route path="finance/budget-allocation" element={<BudgetAllocation />} />
      <Route path="finance/ra-bill-processing" element={<RABillProcessing />} />
      <Route
        path="finance/final-bill-settlement"
        element={<FinalBillSettlement />}
      />
      <Route
        path="finance/payment-release"
        element={
          <Navigate to="/civil-infrastructure/vendor/payment-release" replace />
        }
      />
      <Route path="finance/dlp-monitoring" element={<DLPMonitoring />} />
      <Route
        path="finance/utilization-certificate"
        element={
          <Navigate
            to="/civil-infrastructure/vendor/utilization-certificate"
            replace
          />
        }
      />

      {/* ── Vendor Login / Admin User ─────────────────────────────── */}
      <Route
        path="vendor"
        element={
          <Navigate
            to="/civil-infrastructure/vendor/work-manpower-mapping"
            replace
          />
        }
      />
      <Route
        path="vendor/work-manpower-mapping"
        element={<WorkManpowerMapping />}
      />
      <Route path="vendor/e-measurement-book" element={<EMeasurementBook />} />
      <Route path="vendor/eot-request" element={<EOTRequest />} />
      <Route path="vendor/milestone-status" element={<MilestoneSignoff />} />
      <Route
        path="vendor/utilization-certificate"
        element={<UtilizationCertificate />}
      />
      <Route path="vendor/request-cc" element={<RequestCC />} />
      <Route path="vendor/payment-release" element={<PaymentRelease />} />
    </Routes>
  );
}
