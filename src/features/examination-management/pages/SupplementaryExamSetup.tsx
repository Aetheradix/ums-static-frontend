import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

export default function SupplementaryExamSetup() {
  return (
    <FormPage
      title="Supplementary Exam Setup"
      description="Configure rules and parameters for supplementary/backlog examination sessions."
    >
      <FormCard>
        <GridPanel
          data={[
            {
              id: 1,
              sessionName: 'Supplementary Exam July 2025',
              maxSubjects: 4,
              feePerSubject: 500,
              status: 'Draft',
            },
          ]}
          loading={false}
          toolbar={<Button label="New Supplementary Session" icon="pi-plus" />}
          columns={[
            { field: 'sessionName', header: 'Session Name' },
            { field: 'maxSubjects', header: 'Max Backlog Subjects Allowed' },
            { field: 'feePerSubject', header: 'Fee per Subject (INR)' },
            {
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: () => (
                <div className="flex gap-1">
                  <Button
                    icon="pi-pencil"
                    className="p-button-sm p-button-text"
                    tooltip="Edit Configuration"
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
