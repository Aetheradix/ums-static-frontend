import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import QualificationForm from '../components/QualificationForm';
import {
  useCreateQualificationMutation,
  useQualificationActiveStatusMutation,
  useQualificationQuery,
  useQualificationsQuery,
  useUpdateQualificationMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useQualificationsQuery();
  const { mutateAsync: toggleStatus } = useQualificationActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.HR.QualificationItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Qualification"
      description="Manage the list of all qualifications in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={qualification =>
            setPopup({ mode: 'edit', id: qualification.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'subject', header: 'Subject' },
            { field: 'code', header: 'Code' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.HR.QualificationItem) => (
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

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Qualification"
        subtitle="Fill in the details to add a new qualification."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Qualification"
        subtitle="Update the details of the qualification."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateQualificationMutation();

  async function handleSubmit(data: Master.HR.QualificationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Qualification created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create qualification');
    }
  }

  return <QualificationForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateQualificationMutation(id);
  const { data, isLoading } = useQualificationQuery(id);
  const DEFAULT: Master.HR.QualificationForm = {
    name: '',
    subject: '',
    code: '',
    isActive: true,
  };

  async function handleSubmit(formData: Master.HR.QualificationForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Qualification updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update qualification');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <QualificationForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
