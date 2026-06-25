import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button, StatusButton } from 'shared/components/buttons';
import { useExamCentersQuery, useExamCenterStatusMutation } from '../queries';
import CenterForm from '../components/CenterForm';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function CenterList() {
  const { data, isLoading } = useExamCentersQuery();
  const { mutateAsync: toggleStatus } = useExamCenterStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Examination.ExamCenterItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  return (
    <FormPage
      title="Exam Centers"
      description="Manage examination centers (capacity is immutable after saving)"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search centers..."
          toolbar={
            <Button
              label="Create"
              icon="pi-plus"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          columns={[
            { field: 'centerCode', header: 'Code' },
            { field: 'centerName', header: 'Center Name' },
            { field: 'city', header: 'City' },
            { field: 'state', header: 'State' },
            { field: 'totalCapacity', header: 'Capacity' },
            { field: 'contactPerson', header: 'Contact Person' },
            {
              header: 'Status',
              cell: (item: Examination.ExamCenterItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ExamCenterItem) => (
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
          title="Create Exam Center"
          subtitle="Add a new examination center"
        >
          <CenterForm onClose={() => setPopup({ mode: 'closed' })} />
        </FormPopup>
      )}

      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Edit Exam Center"
          subtitle="Update examination center details"
        >
          <CenterForm
            id={popup.id}
            onClose={() => setPopup({ mode: 'closed' })}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
