import { Button } from 'primereact/button';
import { useState } from 'react';
import { ToastService } from 'services';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function ApplicationReviewPage() {
  // Mock data for applications
  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      name: 'Aarav Sharma',
      enrollmentNo: 'EN2024001',
      category: 'In-Presentia',
      feeStatus: 'Paid',
      docStatus: 'Verified',
      status: 'Approved',
    },
    {
      id: 'APP002',
      name: 'Diya Patel',
      enrollmentNo: 'EN2024002',
      category: 'In-Absentia',
      feeStatus: 'Paid',
      docStatus: 'Pending',
      status: 'Pending Review',
    },
    {
      id: 'APP003',
      name: 'Sneha Reddy',
      enrollmentNo: 'EN2024004',
      category: 'In-Presentia',
      feeStatus: 'Pending',
      docStatus: 'Pending',
      status: 'Incomplete',
    },
  ]);

  const handleApprove = (id: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: 'Approved', docStatus: 'Verified' }
          : app
      )
    );
    ToastService.success('Application approved successfully!');
  };

  const statusBodyTemplate = (rowData: any) => {
    let severity: 'success' | 'warning' | 'danger' | 'info' = 'info';
    if (rowData.status === 'Approved') severity = 'success';
    if (rowData.status === 'Pending Review') severity = 'warning';
    if (rowData.status === 'Incomplete') severity = 'danger';

    return <StatusBadge variant={severity} label={rowData.status} />;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button label="View" size="small" outlined />
        {rowData.status === 'Pending Review' && (
          <Button
            label="Approve"
            size="small"
            severity="success"
            onClick={() => handleApprove(rowData.id)}
          />
        )}
      </div>
    );
  };

  return (
    <FormPage
      title="Application Review"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Applications' },
      ]}
    >
      <div className="space-y-6">
        <FormCard
          title="Received Applications"
          subtitle="Review student registrations, verify documents, and approve applications."
        >
          <GridPanel
            data={applications}
            searchFields={['id', 'name', 'enrollmentNo', 'category']}
            searchBox
            searchPlaceholder="Search applications..."
            actionButtons={
              <Button
                label="Generate Passes"
                icon="pi pi-id-card"
                severity="info"
                onClick={() =>
                  ToastService.success('Passes generation started.')
                }
              />
            }
            columns={[
              { field: 'id', header: 'App ID', sortable: true, width: '10%' },
              {
                field: 'name',
                header: 'Student Name',
                sortable: true,
                width: '20%',
              },
              {
                field: 'enrollmentNo',
                header: 'Enrollment No.',
                sortable: true,
                width: '15%',
              },
              {
                field: 'category',
                header: 'Category',
                sortable: true,
                width: '15%',
              },
              {
                field: 'feeStatus',
                header: 'Fee Status',
                sortable: true,
                width: '10%',
              },
              { header: 'Status', cell: statusBodyTemplate, width: '15%' },
              { header: 'Actions', cell: actionBodyTemplate, width: '15%' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
