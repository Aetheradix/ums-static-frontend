import { mockProfessionalExperience } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

export default function Experience() {
  const columns = [
    { field: 'company_name', header: 'Company / Organisation' },
    { field: 'designation', header: 'Designation' },
    { field: 'employment_type', header: 'Type' },
    { field: 'location', header: 'Location' },
    { field: 'start_date', header: 'Start Date' },
    { field: 'end_date', header: 'End Date' },
    { field: 'description', header: 'Role Description' },
  ];

  return (
    <FormPage
      title="Professional Experience"
      description="Track your work history, internships and project experience"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Experience' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Add Experience" icon="pi pi-plus" />}
            data={mockProfessionalExperience}
            columns={columns as any}
            editCaption="Edit"
            removeCaption="Remove"
            onEdit={() => {}}
            onRemove={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
