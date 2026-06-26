import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import type { CostCentreForm, CostCentreItem } from '../api';
import {
  useCostCentresQuery,
  useCreateCostCentreMutation,
  useToggleCostCentreStatusMutation,
  useUpdateCostCentreMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: CostCentreItem };

export default function List() {
  const { data, isLoading } = useCostCentresQuery();
  const { mutateAsync: toggleStatus } = useToggleCostCentreStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Cost Centres"
      description="Manage cost centres for departmental budget tracking."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by code, name, department..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'department', header: 'Department' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CostCentreItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() =>
                    toggleStatus({ id: item.id, isActive: !item.isActive })
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Cost Centre"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Cost Centre"
        subtitle="Add a new cost centre."
      >
        <CostCentreFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Cost Centre"
        subtitle="Update cost centre details."
      >
        {popup.mode === 'edit' && (
          <CostCentreFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CostCentreFormContent({
  item,
  onClose,
}: {
  item?: CostCentreItem;
  onClose: () => void;
}) {
  const createMut = useCreateCostCentreMutation();
  const updateMut = useUpdateCostCentreMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: CostCentreForm = {
    code: '',
    name: '',
    department: '',
    isActive: true,
  };
  const [form, setForm] = useState<CostCentreForm>(
    item
      ? {
          code: item.code,
          name: item.name,
          department: item.department,
          isActive: item.isActive,
        }
      : BLANK
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Code"
          placeholder="e.g. CC-008"
          value={form.code}
          onChange={v => setForm(p => ({ ...p, code: v }))}
          required
        />
        <TextBox
          label="Name"
          placeholder="e.g. Management Dept."
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <TextBox
          label="Department"
          placeholder="e.g. Management"
          value={form.department}
          onChange={v => setForm(p => ({ ...p, department: v }))}
          required
        />
      </FormGrid>
      <FormActions
        isEditMode={!!item}
        isLoading={mutation.isPending}
        onSave={() => handleSubmit}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}
