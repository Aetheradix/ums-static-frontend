import { mockEducationalQualifications } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

export default function Qualifications() {
  const columns = [
    { field: 'level', header: 'Education Level' },
    { field: 'degree', header: 'Degree / Certificate' },
    { field: 'institute', header: 'Institution' },
    { field: 'year', header: 'Year of Completion' },
    { field: 'result_type', header: 'Result Type' },
    { field: 'score', header: 'Score / Grade' },
  ];

  return (
    <FormPage
      title="Academic Qualifications"
      description="Manage your educational qualifications and academic achievements"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Qualifications' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Add Qualification" icon="pi pi-plus" />}
            data={mockEducationalQualifications}
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
