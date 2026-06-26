import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { ConfirmDialog } from 'shared/components/popups';
import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { mockGetBasicEmployees } from '../../mockData';

export default function List() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

  useEffect(() => {
    mockGetBasicEmployees().then(res => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleDeleteConfirm = () => {
    setData(prev =>
      prev.filter(emp => emp.employeeId !== employeeToDelete?.employeeId)
    );
    setEmployeeToDelete(null);
  };

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
              { field: 'onboardingType', header: 'Onboarding Type' },
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
                      navigate(`/settings/employee-profile/${item.employeeId}`)
                    }
                    onEdit={() => {
                      if (item.onboardingType === 'Quick Onboarding') {
                        navigate('/employee-management/quick-onboarding');
                      } else {
                        navigate('/employee-management/full-onboarding');
                      }
                    }}
                    onDelete={() => setEmployeeToDelete(item)}
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

      <ConfirmDialog
        visible={!!employeeToDelete}
        onHide={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${employeeToDelete?.fullName ?? 'this employee'}? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </FormPage>
  );
}
