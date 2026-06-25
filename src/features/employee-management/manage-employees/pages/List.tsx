import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useGetBasicEmployeesQuery } from '../queries';

export default function List() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetBasicEmployeesQuery();

  return (
    <FormPage
      title="Manage Employee"
      description="View and manage the list of all employees in the system."
    >
      <FormCard>
        {isLoading && <Loader />}

        <div className="employee-management-grid">
          <GridPanel
            data={data ?? []}
            columns={[
              {
                cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                width: '30px',
              },
              { field: 'employeeCode', header: 'Employee Code' },
              { field: 'fullName', header: 'Name' },
              { field: 'gender', header: 'Gender' },
              { field: 'employeeNature', header: 'Nature' },
              { field: 'organizationUnit', header: 'Org. Unit' },
              { field: 'post', header: 'Post' },
              { field: 'subjectSpecialization', header: 'Specialization' },
              {
                header: 'Action',
                sortable: false,
                cell: (item: EmployeeManagement.QuickOnboardingItem) => (
                  <GridActionButtons
                    onView={() =>
                      navigate(
                        `/employee-management/manage-employees/${item.employeeId}`
                      )
                    }
                    onEdit={() =>
                      navigate(
                        `/employee-management/manage-employees/${item.employeeId}/edit`
                      )
                    }
                    onDelete={() => {}}
                  />
                ),
              },
            ]}
            searchBox
            searchPlaceholder="Search by code, name, gender, nature, organization unit, post, specialization..."
            actionButtons={
              <>
                <Button
                  label="Export"
                  icon="download"
                  variant="outlined"
                  size="small"
                  onClick={() => {}}
                />

                <Button
                  label="Add Employee"
                  icon="plus"
                  variant="primary"
                  size="small"
                  onClick={() =>
                    navigate('/employee-management/quick-onboarding')
                  }
                />
              </>
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
