import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { mockFiles } from '../../data';

export default function ApproverReports() {
  const navigate = useNavigate();
  const totalFiles = mockFiles.length;
  const approved = mockFiles.filter(f => f.currentStatus === 'Approved').length;
  const rejected = mockFiles.filter(f => f.currentStatus === 'Rejected').length;
  const pending = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  ).length;

  return (
    <FormPage
      title="Approver Reports"
      description="File processing analytics for approvers"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FormCard title="Total Files">
          <div className="text-2xl font-bold">{totalFiles}</div>
        </FormCard>
        <FormCard title="Approved">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
        </FormCard>
        <FormCard title="Rejected">
          <div className="text-2xl font-bold text-red-600">{rejected}</div>
        </FormCard>
        <FormCard title="Pending">
          <div className="text-2xl font-bold text-orange-600">{pending}</div>
        </FormCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          label="File Movement Report"
          icon="swap_horiz"
          onClick={() =>
            navigate('/file-management-tracking/reports/file-movement')
          }
        />
        <Button
          label="Avg Approval Time"
          icon="timer"
          onClick={() =>
            navigate('/file-management-tracking/reports/avg-approval-time')
          }
        />
        <Button
          label="Pending Files"
          icon="hourglass_empty"
          onClick={() =>
            navigate('/file-management-tracking/reports/pending-files')
          }
        />
        <Button
          label="SLA Violations"
          icon="warning"
          onClick={() =>
            navigate('/file-management-tracking/reports/sla-violations')
          }
        />
      </div>
    </FormPage>
  );
}
