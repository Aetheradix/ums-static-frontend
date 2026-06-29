import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
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
import { BUDGET_CATEGORIES } from '../../../mock-data';
import type { BudgetHeadForm, BudgetHeadItem } from '../api';
import {
  useBudgetHeadsQuery,
  useCreateBudgetHeadMutation,
  useToggleBudgetHeadStatusMutation,
  useUpdateBudgetHeadMutation,
} from '../queries';

const CATEGORY_OPTIONS = BUDGET_CATEGORIES.map(c => ({
  label: c.name,
  value: c.name,
}));

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: BudgetHeadItem };

export default function List() {
  const { data, isLoading } = useBudgetHeadsQuery();
  const { mutateAsync: toggleStatus } = useToggleBudgetHeadStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Budget Heads"
      description="Manage budget heads for categorizing expenditures."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by code, name, category..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'headCode', header: 'Head Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'budgetCategory', header: 'Budget Category' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: BudgetHeadItem) => (
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
              label="Add Budget Head"
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
        title="Create Budget Head"
        subtitle="Add a new budget head."
        size="lg"
      >
        <BudgetHeadFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Budget Head"
        subtitle="Update budget head details."
        size="lg"
      >
        {popup.mode === 'edit' && (
          <BudgetHeadFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BudgetHeadFormContent({
  item,
  onClose,
}: {
  item?: BudgetHeadItem;
  onClose: () => void;
}) {
  const createMut = useCreateBudgetHeadMutation();
  const updateMut = useUpdateBudgetHeadMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: BudgetHeadForm = {
    headCode: '',
    name: '',
    category: '',
    budgetCategory: '',
    isActive: true,
  };
  const [form, setForm] = useState<BudgetHeadForm>(
    item
      ? {
          headCode: item.headCode,
          name: item.name,
          category: item.category,
          budgetCategory: item.budgetCategory,
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
          label="Head Code"
          placeholder="e.g. BH-009"
          value={form.headCode}
          onChange={v => setForm(p => ({ ...p, headCode: v }))}
          required
        />
        <TextBox
          label="Name"
          placeholder="e.g. Sports Equipment"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Budget Category"
          data={CATEGORY_OPTIONS}
          value={form.category}
          onChange={v => setForm(p => ({ ...p, category: v as string }))}
          required
        />
        <TextBox
          label="Category Code"
          placeholder="e.g. BC-05"
          value={form.budgetCategory}
          onChange={v => setForm(p => ({ ...p, budgetCategory: v }))}
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
