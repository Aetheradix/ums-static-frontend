import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateSeparationReasonType from '../components/CreateSeparationReasonType';
import EditSeparationReasonType from '../components/EditSeparationReasonType';
import {
  useSeparationReasonTypesQuery,
  useSeparationReasonTypeStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSeparationReasonTypesQuery();

  const { mutateAsync: toggleStatus } = useSeparationReasonTypeStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.SeparationReasonTypeItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Separation Reasons"
      description="Manage the list of all separation reasons in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.SeparationReasonTypeItem[]}
          loading={isLoading}
          onEdit={reason =>
            setPopup({
              mode: 'edit',
              id: reason.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'name',
              header: 'Name',
            },
            {
              field: 'type',
              header: 'Type',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.SeparationReasonTypeItem) => (
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
          title="Create Separation Reason"
          subtitle="Fill in the details to add a new separation reason."
        >
          <CreateSeparationReasonType onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Separation Reason"
          subtitle="Update the details of the separation reason."
        >
          {popup.mode === 'edit' && (
            <EditSeparationReasonType id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
