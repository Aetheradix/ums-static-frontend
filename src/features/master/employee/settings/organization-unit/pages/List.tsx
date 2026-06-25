import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateOrganizationUnit from '../components/CreateOrganizationUnit';
import EditOrganizationUnit from '../components/EditOrganizationUnit';
import {
  useOrganizationUnitsQuery,
  useOrganizationUnitStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useOrganizationUnitsQuery();

  const { mutateAsync: toggleStatus } = useOrganizationUnitStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.OrganizationUnitItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Organization Unit"
      description="Manage the list of all organization units in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.OrganizationUnitItem[]}
          loading={isLoading}
          onEdit={organizationUnit =>
            setPopup({
              mode: 'edit',
              id: organizationUnit.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'name',
              header: 'Organization Unit Name',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.OrganizationUnitItem) => (
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
          title="Create Organization Unit"
          subtitle="Fill in the details to add a new organization unit."
        >
          <CreateOrganizationUnit onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Organization Unit"
          subtitle="Update the details of the organization unit."
        >
          {popup.mode === 'edit' && (
            <EditOrganizationUnit id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
