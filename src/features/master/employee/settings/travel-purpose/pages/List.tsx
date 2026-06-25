import { useCallback, useState } from 'react';
import { Button, StatusButton } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import CreateTravelPurpose from '../components/CreateTravelPurpose';
import EditTravelPurpose from '../components/EditTravelPurpose';
import {
  useTravelPurposesQuery,
  useTravelPurposeStatusMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useTravelPurposesQuery();

  const { mutateAsync: toggleStatus } = useTravelPurposeStatusMutation();

  const [popup, setPopup] = useState<PopupState>({
    mode: 'closed',
  });

  const handleToggleStatus = async (
    item: Master.Employee.TravelPurposeItem
  ) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Travel Purpose"
      description="Manage the list of all travel purposes in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Employee.TravelPurposeItem[]}
          loading={isLoading}
          onEdit={travelPurpose =>
            setPopup({
              mode: 'edit',
              id: travelPurpose.id,
            })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'name',
              header: 'Travel Purpose',
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Employee.TravelPurposeItem) => (
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
          title="Create Travel Purpose"
          subtitle="Fill in the details to add a new travel purpose."
        >
          <CreateTravelPurpose onClose={closePopup} />
        </FormPopup>
      ) : null}

      {popup.mode === 'edit' ? (
        <FormPopup
          visible
          onHide={closePopup}
          title="Edit Travel Purpose"
          subtitle="Update the details of the travel purpose."
        >
          {popup.mode === 'edit' && (
            <EditTravelPurpose id={popup.id} onClose={closePopup} />
          )}
        </FormPopup>
      ) : null}
    </FormPage>
  );
}
