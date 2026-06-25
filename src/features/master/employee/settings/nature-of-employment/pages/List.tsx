import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateNatureOfEmployment from '../components/CreateNatureOfEmployment';
import EditNatureOfEmployment from '../components/EditNatureOfEmployment';
import {
  useEmploymentNaturesQuery,
  useEmploymentNatureStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useEmploymentNaturesQuery();

  const { mutateAsync: toggleStatus } = useEmploymentNatureStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.EmploymentNatureItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Nature Of Employment"
      description="Manage the list of all employment natures in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.EmploymentNatureItem[]}
          loading={isLoading}
          onEdit={employmentNature =>
            setPopup({
              mode: 'edit',
              id: employmentNature.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'name',
              header: 'Nature Of Employment',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.EmploymentNatureItem) => (
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
          title="Create Nature Of Employment"
          subtitle="Fill in the details to add a new employment nature."
        >
          <CreateNatureOfEmployment onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Nature Of Employment"
          subtitle="Update the details of the employment nature."
        >
          {popup.mode === 'edit' && (
            <EditNatureOfEmployment id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
