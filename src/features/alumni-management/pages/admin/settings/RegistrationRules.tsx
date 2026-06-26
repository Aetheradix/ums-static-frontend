import { mockRegistrationRules } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function RegistrationRules() {
  const columns = [
    { field: 'id', header: 'Rule ID' },
    { field: 'rule', header: 'Rule Description' },
    {
      field: 'isActive',
      header: 'Status',
      body: (row: any) => (
        <StatusBadge
          label={row.isActive ? 'Active' : 'Inactive'}
          variant={row.isActive ? 'approved' : 'rejected'}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Registration Rules"
      description="Define validation rules applied during alumni self-registration"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Settings — Registration Rules' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Add Rule" icon="pi pi-plus" />}
            data={mockRegistrationRules}
            columns={columns as any}
            editCaption="Edit"
            removeCaption="Deactivate"
            onEdit={() => {}}
            onRemove={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
