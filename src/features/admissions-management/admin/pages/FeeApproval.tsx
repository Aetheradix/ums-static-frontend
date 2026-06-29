import { useState, useEffect } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { ApplicationSeedService, type SeedApplication } from '../../seed';
import { admissionsUrls } from '../../urls';

export default function FeeApproval() {
  const [applications, setApplications] = useState<SeedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await ApplicationSeedService.getAll();
    // Show only those with Fee Pending status
    setApplications(all.filter(a => a.status === 'Fee Pending'));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (app: SeedApplication) => {
    await ApplicationSeedService.updateStatus(app.id, 'Approved');
    ToastService.success(`Fee approved for ${app.applicantName}`);
    load();
  };

  const handleReject = async (app: SeedApplication) => {
    await ApplicationSeedService.updateStatus(app.id, 'Rejected');
    ToastService.error(`Fee rejected for ${app.applicantName}`);
    load();
  };

  return (
    <FormPage
      title="Fee Payment Approval"
      description="Review and approve or reject pending fee payments from applicants."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Fee Approval' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={applications}
          loading={loading}
          searchBox
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Application No',
              field: 'applicationNo',
              sortable: true,
            },
            {
              header: 'Applicant Name',
              field: 'applicantName',
              sortable: true,
            },
            { header: 'Programme', field: 'programmeName', sortable: true },
            { header: 'Category', field: 'category', sortable: true },
            {
              header: 'Fee Amount',
              cell: (item: SeedApplication) => (
                <span className="font-semibold">
                  ₹{item.feeAmount.toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: SeedApplication) => (
                <StatusBadge label={item.status} variant="pending" />
              ),
            },
            {
              header: 'Actions',
              cell: (item: SeedApplication) => (
                <div className="flex gap-2">
                  <Button
                    label="Approve"
                    icon="pi pi-check"
                    variant="success"
                    onClick={() => handleApprove(item)}
                  />
                  <Button
                    label="Reject"
                    icon="pi pi-times"
                    variant="danger"
                    onClick={() => handleReject(item)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
