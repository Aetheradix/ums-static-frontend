import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import SchemeTypeForm from '../components/SchemeTypeForm';
import {
  useSchemeTypeActiveStatusMutation,
  useSchemeTypesQuery,
  useCreateSchemeTypeMutation,
  useUpdateSchemeTypeMutation,
  useSchemeTypeQuery,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSchemeTypesQuery();
  const { mutateAsync } = useSchemeTypeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Scheme.SchemeTypeItem) => {
    await mutateAsync({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Scheme Type"
      description="Manage the list of all scheme types in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={schemeType => setPopup({ mode: 'edit', id: schemeType.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Scheme.SchemeTypeItem) => (
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
        title="Create Scheme Type"
        subtitle="Fill in the details to add a new scheme type."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Scheme Type"
        subtitle="Update the scheme type details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateSchemeTypeMutation();

  async function handleSubmit(data: Master.Scheme.SchemeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Type created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create scheme type');
    }
  }

  return (
    <SchemeTypeForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateSchemeTypeMutation(id);
  const { data, isLoading } = useSchemeTypeQuery(id);
  const DEFAULT = { name: '' };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Scheme.SchemeTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Scheme Type updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update scheme type');
    }
  }

  return (
    <SchemeTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
