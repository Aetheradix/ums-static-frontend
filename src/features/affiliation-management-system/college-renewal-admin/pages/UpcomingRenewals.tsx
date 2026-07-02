import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

const mockRenewals = [
  {
    id: '1',
    collegeCode: 'COL001',
    collegeName: 'Global Institute of Technology',
    lastAffiliationDate: '2023-08-15',
    renewalDueDate: '2024-08-15',
    status: 'Overdue',
  },
  {
    id: '2',
    collegeCode: 'COL005',
    collegeName: 'Pioneer Engineering College',
    lastAffiliationDate: '2024-03-10',
    renewalDueDate: '2025-03-10',
    status: 'Due Soon',
  },
  {
    id: '3',
    collegeCode: 'COL012',
    collegeName: 'Excellence Academy of Sciences',
    lastAffiliationDate: '2024-01-20',
    renewalDueDate: '2025-01-20',
    status: 'Received',
  },
];

export default function UpcomingRenewals() {
  const [data] = useState(mockRenewals);

  return (
    <FormPage
      title="Upcoming Affiliation Renewals"
      description="Monitor and manage affiliation renewal applications from colleges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Affiliation Management',
          to: '/affiliation-management-system',
        },
        {
          label: 'Admin Login',
          to: '/affiliation-management-system/admin-login',
        },
        { label: 'Upcoming Renewals' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchFields={['collegeCode', 'collegeName', 'status']}
          columns={[
            {
              cell: (_, o) => (
                <span>{o?.rowIndex !== undefined ? o.rowIndex + 1 : '-'}</span>
              ),
              width: '50px',
              header: 'S.No',
            },
            { field: 'collegeCode', header: 'College Code', width: '120px' },
            { field: 'collegeName', header: 'College Name' },
            { field: 'lastAffiliationDate', header: 'Last Affiliation Date' },
            { field: 'renewalDueDate', header: 'Renewal Due Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Received'
                      ? 'approved'
                      : item.status === 'Overdue'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: () => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {}}
                  />
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
