import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateEmployeeGroup from '../components/CreateEmployeeGroup';
import EditEmployeeGroup from '../components/EditEmployeeGroup';
import {
  useEmployeeGroupsQuery,
  useEmployeeGroupStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useEmployeeGroupsQuery();

  const { mutateAsync: toggleStatus } = useEmployeeGroupStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.EmployeeGroupItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Employee Groups"
      description="Manage the list of all employee groups in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.EmployeeGroupItem[]}
          loading={isLoading}
          onEdit={employeeGroup =>
            setPopup({
              mode: 'edit',
              id: employeeGroup.id,
            })
          }
          columns={[
            {
              cell: (_, employeeGroup) => (
                <span>{employeeGroup.rowIndex + 1}</span>
              ),
              width: '30px',
            },
            {
              field: 'name',
              header: 'Name',
            },
            {
              field: 'description',
              header: 'Description',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.EmployeeGroupItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      {popup.mode === 'create' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Create Employee Group"
          subtitle="Fill in the details to add a new employee group."
        >
          <CreateEmployeeGroup onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Employee Group"
          subtitle="Update the details of the employee group."
        >
          <EditEmployeeGroup id={popup.id} onClose={closePopup} />
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
