import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button, StatusButton } from 'shared/components/buttons';
import { useDutyTypesQuery, useDutyTypeStatusMutation } from '../queries';
import DutyTypeForm from '../components/DutyTypeForm';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function DutyTypeList() {
  const { data, isLoading } = useDutyTypesQuery();
  const { mutateAsync: toggleStatus } = useDutyTypeStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Examination.DutyTypeItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  return (
    <FormPage
      title="Duty Types"
      description="Manage invigilation and examination duty roles"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search duty types..."
          toolbar={
            <Button
              label="Create"
              icon="pi-plus"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          columns={[
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'maxPerSession', header: 'Max Per Session' },
            {
              header: 'Status',
              cell: (item: Examination.DutyTypeItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.DutyTypeItem) => (
                <Button
                  icon="pi-pencil"
                  className="p-button-sm p-button-text"
                  onClick={() => setPopup({ mode: 'edit', id: item.id })}
                />
              ),
            },
          ]}
        />
      </FormCard>

      {popup.mode === 'create' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Create Duty Type"
          subtitle="Add a new examination duty role"
        >
          <DutyTypeForm onClose={() => setPopup({ mode: 'closed' })} />
        </FormPopup>
      )}

      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Edit Duty Type"
          subtitle="Update duty type details"
        >
          <DutyTypeForm
            id={popup.id}
            onClose={() => setPopup({ mode: 'closed' })}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
