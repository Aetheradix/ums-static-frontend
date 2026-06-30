import { mockContributionAreasList } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function ContributionAreas() {
  const columns = [
    { field: 'id', header: 'ID' },
    { field: 'area', header: 'Contribution Area' },
    { field: 'description', header: 'Description' },
    { field: 'enrolledCount', header: 'Alumni Enrolled' },
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
      title="Contribution Areas"
      description="Define and manage areas in which alumni can contribute to the institution"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Settings — Contribution Areas' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Add Area" icon="pi pi-plus" />}
            data={mockContributionAreasList}
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
