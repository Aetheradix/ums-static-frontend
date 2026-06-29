import { useRef } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

export default function MyApplications() {
  const toast = useRef<Toast>(null);

  const [applications, setApplications] = useLocalStorage<any[]>(
    'tp_student_applications',
    [
      {
        id: 'APP-101',
        jobTitle: 'Software Development Engineer',
        company: 'Infosys Technologies Ltd',
        appliedDate: '2024-07-25',
        round: 'Technical Interview',
        status: 'Shortlisted',
      },
      {
        id: 'APP-102',
        jobTitle: 'Data Analyst',
        company: 'TCS',
        appliedDate: '2024-07-10',
        round: 'Aptitude Test',
        status: 'In Progress',
      },
      {
        id: 'APP-103',
        jobTitle: 'Frontend Developer',
        company: 'Wipro',
        appliedDate: '2024-06-15',
        round: 'Final HR',
        status: 'Offered',
      },
    ]
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Selected':
      case 'Offered':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Shortlisted':
      case 'In Progress':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const handleWithdraw = (id: string) => {
    const updatedApps = applications.filter(app => app.id !== id);
    setApplications(updatedApps);
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Application withdrawn successfully.',
      life: 3000,
    });
  };

  return (
    <FormPage
      title="My Applications"
      description="Track the status of your job and internship applications."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Student Portal', to: tpUrls.student.portal },
        { label: 'Applications' },
      ]}
    >
      <Toast ref={toast} />
      <FormCard>
        <div className="p-4">
          <GridPanel
            data={applications}
            dataKey="id"
            emptyMessage={
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <i className="pi pi-inbox text-4xl mb-4 text-gray-300" />
                <p>You have not applied to any jobs yet.</p>
                <p className="text-sm mt-1">
                  Visit "Browse Jobs" to explore opportunities.
                </p>
              </div>
            }
            pagination
            columns={
              [
                { field: 'jobTitle', header: 'Job Title' },
                { field: 'company', header: 'Company' },
                { field: 'appliedDate', header: 'Applied On' },
                { field: 'round', header: 'Current Round' },
                {
                  field: 'status',
                  header: 'Application Status',
                  body: (row: any) => (
                    <StatusBadge
                      label={row.status}
                      variant={getStatusVariant(row.status)}
                    />
                  ),
                },
                {
                  field: 'actions',
                  header: 'Actions',
                  body: (row: any) => (
                    <div className="flex gap-2">
                      <Button
                        label="Withdraw"
                        size="small"
                        text
                        severity="danger"
                        onClick={() => handleWithdraw(row.id)}
                      />
                      {row.status === 'Offered' && (
                        <Button
                          label="View Offer"
                          size="small"
                          severity="success"
                          onClick={() =>
                            toast.current?.show({
                              severity: 'info',
                              summary: 'Offer Letter',
                              detail: 'Downloading offer letter...',
                              life: 3000,
                            })
                          }
                        />
                      )}
                    </div>
                  ),
                },
              ] as never[]
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
