import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function OUMappingList() {
  const navigate = useNavigate();

  const mockMappings = [
    {
      id: 'OUM-1',
      administeringOu: 'Training & Placement Cell',
      administeredOus: 'CSE, ECE, ME',
      coordinatorsCount: 3,
    },
    {
      id: 'OUM-2',
      administeringOu: 'Management T&P Cell',
      administeredOus: 'MBA, BBA',
      coordinatorsCount: 2,
    },
  ];

  return (
    <FormPage
      title="OU Mappings"
      description="Map Training & Placement cells to the academic departments they administer."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings', to: tpUrls.admin.settings.hub },
        { label: 'OU Mappings' },
      ]}
      headerAction={
        <Button
          label="Add Organization Mapping"
          icon="pi pi-plus"
          onClick={() => navigate(tpUrls.admin.settings.ouMappingAdd)}
        />
      }
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            searchPlaceholder="Search OU Mappings..."
            data={mockMappings}
            dataKey="id"
            emptyMessage="No OU mappings configured."
            pagination
            onEdit={(row: any) =>
              navigate(tpUrls.admin.settings.ouMappingEdit(row.id))
            }
            columns={
              [
                { field: 'id', header: '#' },
                { field: 'administeringOu', header: 'Administering OU' },
                { field: 'administeredOus', header: 'Administered OU(s)' },
                { field: 'coordinatorsCount', header: 'Coordinators' },
              ] as never[]
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
