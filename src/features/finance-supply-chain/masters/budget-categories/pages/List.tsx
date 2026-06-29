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
import type { BudgetCategoryForm, BudgetCategoryItem } from '../api';
import {
  useBudgetCategoriesQuery,
  useCreateBudgetCategoryMutation,
  useToggleBudgetCategoryStatusMutation,
  useUpdateBudgetCategoryMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: BudgetCategoryItem };

export default function List() {
  const { data, isLoading } = useBudgetCategoriesQuery();
  const { mutateAsync: toggleStatus } = useToggleBudgetCategoryStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Budget Categories"
      description="Manage budget categories to classify expenditure heads."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by code, name..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'categoryCode', header: 'Category Code' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: BudgetCategoryItem) => (
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
              label="Add Category"
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
        title="Create Budget Category"
        subtitle="Add a new budget category."
      >
        <BudgetCategoryFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Budget Category"
        subtitle="Update budget category details."
      >
        {popup.mode === 'edit' && (
          <BudgetCategoryFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BudgetCategoryFormContent({
  item,
  onClose,
}: {
  item?: BudgetCategoryItem;
  onClose: () => void;
}) {
  const createMut = useCreateBudgetCategoryMutation();
  const updateMut = useUpdateBudgetCategoryMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: BudgetCategoryForm = {
    categoryCode: '',
    name: '',
    description: '',
    isActive: true,
  };
  const [form, setForm] = useState<BudgetCategoryForm>(
    item
      ? {
          categoryCode: item.categoryCode,
          name: item.name,
          description: item.description,
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
          label="Category Code"
          placeholder="e.g. BC-07"
          value={form.categoryCode}
          onChange={v => setForm(p => ({ ...p, categoryCode: v }))}
          required
        />
        <TextBox
          label="Name"
          placeholder="e.g. Sports & Culture"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <TextBox
          label="Description"
          placeholder="Category description"
          value={form.description}
          onChange={v => setForm(p => ({ ...p, description: v }))}
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
