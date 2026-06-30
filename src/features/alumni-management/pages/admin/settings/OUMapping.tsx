import { mockOrganizationUnits } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

export default function OUMapping() {
  const columns = [
    { field: 'ou_code', header: 'OU Code' },
    { field: 'name', header: 'Department Name' },
    { field: 'actionDetails', header: 'OU Admin Assigned' },
  ];

  return (
    <FormPage
      title="OU Admin Mapping"
      description="Map Organisational Units (departments) to their respective OU Admins"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Settings — OU Mapping' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Add Mapping" icon="pi pi-plus" />}
            data={mockOrganizationUnits}
            columns={columns as any}
            editCaption="Edit Mapping"
            removeCaption="Remove"
            onEdit={() => {}}
            onRemove={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
