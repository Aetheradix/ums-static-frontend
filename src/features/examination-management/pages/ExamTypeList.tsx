import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button, StatusButton } from 'shared/components/buttons';
import { useExamTypesQuery, useExamTypeStatusMutation } from '../queries';
import ExamTypeForm from '../components/ExamTypeForm';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function ExamTypeList() {
  const { data, isLoading } = useExamTypesQuery();
  const { mutateAsync: toggleStatus } = useExamTypeStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Examination.ExamTypeItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  return (
    <FormPage
      title="Exam Types"
      description="Manage types of examinations conducted in the system"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search exam types..."
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
            { field: 'sortOrder', header: 'Sort Order' },
            {
              header: 'Status',
              cell: (item: Examination.ExamTypeItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ExamTypeItem) => (
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
          title="Create Exam Type"
          subtitle="Add a new examination type"
        >
          <ExamTypeForm onClose={() => setPopup({ mode: 'closed' })} />
        </FormPopup>
      )}

      {popup.mode === 'edit' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="Edit Exam Type"
          subtitle="Update examination type details"
        >
          <ExamTypeForm
            id={popup.id}
            onClose={() => setPopup({ mode: 'closed' })}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
