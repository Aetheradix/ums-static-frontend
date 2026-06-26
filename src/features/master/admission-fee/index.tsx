import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Loader } from 'shared/components/progress';

// Lazy loading all pages for optimal load times
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AcademicSession = React.lazy(() => import('./pages/AcademicSession'));
const CollegeCourseMapping = React.lazy(
  () => import('./pages/CollegeCourseMapping')
);
const CourseMaster = React.lazy(() => import('./pages/CourseMaster'));
const ProgramMaster = React.lazy(() => import('./pages/ProgramMaster'));
const SemesterMaster = React.lazy(() => import('./pages/SemesterMaster'));
const FeeHeadMaster = React.lazy(() => import('./pages/FeeHeadMaster'));

const FeeStructure = React.lazy(() => import('./pages/FeeStructure'));
const FeeDemand = React.lazy(() => import('./pages/FeeDemand'));
const ScholarshipManagement = React.lazy(
  () => import('./pages/ScholarshipManagement')
);
const FeeConcession = React.lazy(() => import('./pages/FeeConcession'));
const FeeCollection = React.lazy(() => import('./pages/FeeCollection'));
const ReceiptRegister = React.lazy(() => import('./pages/ReceiptRegister'));
const FailedTransactions = React.lazy(
  () => import('./pages/FailedTransactions')
);
const RefundManagement = React.lazy(() => import('./pages/RefundManagement'));
const BankReconciliation = React.lazy(
  () => import('./pages/BankReconciliation')
);

export default function AdmissionFeeRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Nav Redirects */}
        <Route
          path="configuration"
          element={<Navigate to="../academic-session" replace />}
        />
        <Route
          path="transactions"
          element={<Navigate to="../fee-structure" replace />}
        />

        {/* Masters */}
        <Route path="academic-session" element={<AcademicSession />} />
        <Route path="college-mapping" element={<CollegeCourseMapping />} />
        <Route path="course" element={<CourseMaster />} />
        <Route path="program" element={<ProgramMaster />} />
        <Route path="semester" element={<SemesterMaster />} />
        <Route path="fee-head" element={<FeeHeadMaster />} />

        {/* Transactions */}
        <Route path="fee-structure" element={<FeeStructure />} />
        <Route path="demand-generation" element={<FeeDemand />} />
        <Route path="scholarship" element={<ScholarshipManagement />} />
        <Route path="concession" element={<FeeConcession />} />
        <Route path="collection" element={<FeeCollection />} />
        <Route path="receipts" element={<ReceiptRegister />} />
        <Route path="failed-transactions" element={<FailedTransactions />} />
        <Route path="refunds" element={<RefundManagement />} />
        <Route path="bank-reconciliation" element={<BankReconciliation />} />
      </Routes>
    </Suspense>
  );
}
