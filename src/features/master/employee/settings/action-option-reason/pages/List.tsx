import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateActionOptionReason from '../components/CreateActionOptionReason';
import EditActionOptionReason from '../components/EditActionOptionReason';
import {
  useActionOptionReasonActiveStatusMutation,
  useActionOptionReasonsQuery,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useActionOptionReasonsQuery();

  const { mutateAsync: toggleStatus } =
    useActionOptionReasonActiveStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.ActionOptionReasonItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Action Option Reasons"
      description="Manage the list of all action option reasons in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.ActionOptionReasonItem[]}
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
              field: 'actionOptionName',
              header: 'Action Name',
            },
            {
              field: 'name',
              header: 'Reason Name',
            },
            {
              field: 'description',
              header: 'Description',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.ActionOptionReasonItem) => (
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
          title="Create Action Option Reason"
          subtitle="Fill in the details to add a new action option reason."
        >
          <CreateActionOptionReason onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Action Option Reason"
          subtitle="Update the details of the action option reason."
        >
          {popup.mode === 'edit' && (
            <EditActionOptionReason id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
