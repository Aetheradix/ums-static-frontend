import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  INITIAL_ACKNOWLEDGEMENTS,
  INITIAL_COMPLIANCE_SUBMISSIONS,
  type Acknowledgement,
} from '../data';

export default function StudentComplianceHistory() {
  const studentInfo = {
    id: 'STU2024CS0120',
    name: 'Aditya Pratap Singh',
    department: 'Computer Science',
  };

  const [acknowledgements] = useState<Acknowledgement[]>(
    INITIAL_ACKNOWLEDGEMENTS.filter(a => a.userId === studentInfo.id)
  );

  const [submissions] = useState(INITIAL_COMPLIANCE_SUBMISSIONS);

  return (
    <FormPage
      title="Compliance History"
      description="View records of accepted policies and submitted compliance documents"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/my-policies',
        },
        { label: 'Compliance History' },
      ]}
    >
      <div className="space-y-6">
        <FormCard title="Accepted Policies" icon="check-circle">
          <GridPanel
            data={acknowledgements}
            columns={[
              { field: 'policyName', header: 'Policy Name', width: '35%' },
              {
                field: 'versionAccepted',
                header: 'Version Accepted',
                width: '150px',
              },
              {
                field: 'date',
                header: 'Date',
                width: '120px',
                cell: (item: any) => {
                  if (!item.date) return '';
                  const parts = item.date.split('-');
                  if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                  }
                  return item.date;
                },
              },
              { field: 'time', header: 'Time', width: '120px' },
            ]}
            searchBox={false}
          />
        </FormCard>

        <FormCard title="Submission History" icon="history">
          <GridPanel
            data={submissions.filter(s => s.submittedBy === studentInfo.name)}
            columns={[
              {
                field: 'complianceName',
                header: 'Compliance Task',
                width: '35%',
              },
              {
                field: 'submittedDate',
                header: 'Submitted Date',
                width: '140px',
                cell: (item: any) => {
                  if (!item.submittedDate) return '';
                  const parts = item.submittedDate.split('-');
                  if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                  }
                  return item.submittedDate;
                },
              },
              {
                field: 'documents',
                header: 'Documents',
                cell: (item: any) => (
                  <span className="text-sm text-gray-600">
                    {item.documents.length} file(s)
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Final Status',
                width: '160px',
                cell: (item: any) => {
                  const variant =
                    item.status === 'Verified' || item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Rejected'
                        ? 'rejected'
                        : 'pending';
                  return <StatusBadge label={item.status} variant={variant} />;
                },
              },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
