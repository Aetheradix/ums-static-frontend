import { Navigate, Route, Routes } from 'react-router-dom';
import AuditLogReport from './AuditLogReport';
import AvgApprovalTimeReport from './AvgApprovalTimeReport';
import EmployeeProductivityReport from './EmployeeProductivityReport';
import FileMovementReport from './FileMovementReport';
import PendingFilesReport from './PendingFilesReport';
import RejectionRateReport from './RejectionRateReport';
import SlaViolationsReport from './SlaViolationsReport';

export default function ReportPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="file-movement" replace />} />
      <Route path="file-movement" element={<FileMovementReport />} />
      <Route path="avg-approval-time" element={<AvgApprovalTimeReport />} />
      <Route path="pending-files" element={<PendingFilesReport />} />
      <Route
        path="employee-productivity"
        element={<EmployeeProductivityReport />}
      />
      <Route path="sla-violations" element={<SlaViolationsReport />} />
      <Route path="rejection-rate" element={<RejectionRateReport />} />
      <Route path="audit-log-export" element={<AuditLogReport />} />
    </Routes>
  );
}
