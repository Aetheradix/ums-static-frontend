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
import type { ChartOfAccountsForm, ChartOfAccountsItem } from '../api';
import {
  useChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useToggleChartOfAccountStatusMutation,
  useUpdateChartOfAccountMutation,
} from '../queries';

const ACCOUNT_TYPES = [
  { label: 'Asset', value: 'Asset' },
  { label: 'Liability', value: 'Liability' },
  { label: 'Equity', value: 'Equity' },
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ChartOfAccountsItem };

export default function List() {
  const { data, isLoading } = useChartOfAccountsQuery();
  const { mutateAsync: toggleStatus } = useToggleChartOfAccountStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Chart of Accounts"
      description="Manage the chart of accounts for the university's financial system."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by code, name, account type..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'code', header: 'Account Code' },
            { field: 'name', header: 'Account Name' },
            { field: 'accountType', header: 'Account Type' },
            { field: 'parentAccount', header: 'Parent Account' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: ChartOfAccountsItem) => (
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
              label="Add Account"
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
        title="Create Account"
        subtitle="Add a new chart of accounts entry."
        size="lg"
      >
        <AccountForm onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Account"
        subtitle="Update the account details."
        size="lg"
      >
        {popup.mode === 'edit' && (
          <AccountForm item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function AccountForm({
  item,
  onClose,
}: {
  item?: ChartOfAccountsItem;
  onClose: () => void;
}) {
  const createMut = useCreateChartOfAccountMutation();
  const updateMut = useUpdateChartOfAccountMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: ChartOfAccountsForm = {
    code: '',
    name: '',
    accountType: 'Asset',
    parentAccount: '',
    isActive: true,
  };
  const [form, setForm] = useState<ChartOfAccountsForm>(
    item
      ? {
          code: item.code,
          name: item.name,
          accountType: item.accountType,
          parentAccount: item.parentAccount,
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
          label="Account Code"
          placeholder="e.g. 1001"
          value={form.code}
          onChange={v => setForm(p => ({ ...p, code: v }))}
          required
        />
        <TextBox
          label="Account Name"
          placeholder="e.g. Cash in Hand"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Account Type"
          data={ACCOUNT_TYPES}
          value={form.accountType}
          onChange={v => setForm(p => ({ ...p, accountType: v as string }))}
          required
        />
        <TextBox
          label="Parent Account"
          placeholder="Leave blank if root account"
          value={form.parentAccount}
          onChange={v => setForm(p => ({ ...p, parentAccount: v }))}
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
