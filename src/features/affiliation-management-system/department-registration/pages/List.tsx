import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

export const mockDepartments = [
  {
    id: '1',
    departmentName: 'Computer Science and Engineering',
    departmentCode: 'CSE',
    establishedYear: 1995,
    hodName: 'Dr. Alan Turing',
    contactEmail: 'hod.cse@college.edu',
    contactPhone: '9876543210',
    intakeCapacity: 120,
    programsOffered: ['B.Tech', 'M.Tech', 'Ph.D.'],
  },
  {
    id: '2',
    departmentName: 'Electronics and Communication',
    departmentCode: 'ECE',
    establishedYear: 1998,
    hodName: 'Dr. Claude Shannon',
    contactEmail: 'hod.ece@college.edu',
    contactPhone: '9876543211',
    intakeCapacity: 60,
    programsOffered: ['B.Tech'],
  },
];

export default function List() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Department Registration"
      description="Manage all registered departments for the college."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Affiliation Management',
          to: '/affiliation-management-system',
        },
        {
          label: 'College Login',
          to: '/affiliation-management-system/college-login',
        },
        { label: 'Department Registration' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={mockDepartments}
          searchFields={['departmentName', 'departmentCode', 'hodName']}
          columns={[
            {
              cell: (_, o) => (
                <span>{o?.rowIndex !== undefined ? o.rowIndex + 1 : '-'}</span>
              ),
              width: '50px',
              header: 'S.No',
            },
            { field: 'departmentCode', header: 'Code', width: '100px' },
            { field: 'departmentName', header: 'Department Name' },
            { field: 'hodName', header: 'HOD Name' },
            { field: 'intakeCapacity', header: 'Intake Capacity' },
            {
              field: 'programsOffered',
              header: 'Programs',
              cell: (item: any) => (
                <span>{item?.programsOffered?.join(', ') || ''}</span>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="primary"
                    onClick={() => navigate(`../update/${item.id}`)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add New Department"
              icon="plus"
              variant="primary"
              onClick={() => navigate('../create')}
            />
          }
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
