import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateActionOption from '../components/CreateActionOption';
import EditActionOption from '../components/EditActionOption';
import {
  useActionOptionsQuery,
  useActionOptionStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useActionOptionsQuery();

  const { mutateAsync: toggleStatus } = useActionOptionStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (item: Master.Employee.ActionOptionItem) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Action Options"
      description="Manage the list of all action options in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.ActionOptionItem[]}
          loading={isLoading}
          onEdit={actionOption =>
            setPopup({
              mode: 'edit',
              id: actionOption.id,
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
              field: 'description',
              header: 'Description',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.ActionOptionItem) => (
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
          title="Create Action Option"
          subtitle="Fill in the details to add a new action option."
        >
          <CreateActionOption onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Action Option"
          subtitle="Update the details of the action option."
        >
          {popup.mode === 'edit' && (
            <EditActionOption id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
