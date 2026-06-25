import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

export default function ModerationManagement() {
  return (
    <FormPage
      title="Moderation Management"
      description="Configure and apply moderation rules such as grace marks and scaling."
    >
      <FormCard>
        <GridPanel
          data={[
            {
              id: 1,
              rule: 'Grace Marks',
              type: 'FLAT_ADD',
              target: 'Marginal Failures',
              status: 'Active',
            },
            {
              id: 2,
              rule: 'Scaling',
              type: 'PERCENTAGE',
              target: 'All Students',
              status: 'Inactive',
            },
          ]}
          loading={false}
          toolbar={<Button label="New Moderation Rule" icon="pi-plus" />}
          columns={[
            { field: 'rule', header: 'Moderation Rule' },
            { field: 'type', header: 'Formula Type' },
            { field: 'target', header: 'Target Group' },
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
                    icon="pi-cog"
                    className="p-button-sm p-button-text"
                    tooltip="Configure"
                  />
                  <Button
                    icon="pi-play"
                    className="p-button-sm p-button-text p-button-success"
                    tooltip="Apply Rule"
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
