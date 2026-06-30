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
import type { BankAccountForm, BankAccountItem } from '../api';
import {
  useBankAccountsQuery,
  useCreateBankAccountMutation,
  useToggleBankAccountStatusMutation,
  useUpdateBankAccountMutation,
} from '../queries';

const ACCOUNT_TYPES = [
  { label: 'Current', value: 'Current' },
  { label: 'Savings', value: 'Savings' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: BankAccountItem };

export default function List() {
  const { data, isLoading } = useBankAccountsQuery();
  const { mutateAsync: toggleStatus } = useToggleBankAccountStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Bank Accounts"
      description="Manage university bank account details."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by account no, bank name, branch..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'accountNo', header: 'Account No' },
            { field: 'bankName', header: 'Bank Name' },
            { field: 'branch', header: 'Branch' },
            { field: 'ifscCode', header: 'IFSC Code' },
            { field: 'accountType', header: 'Account Type' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: BankAccountItem) => (
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
              label="Add Bank Account"
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
        title="Create Bank Account"
        subtitle="Add a new bank account."
        size="lg"
      >
        <BankAccountFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Bank Account"
        subtitle="Update bank account details."
        size="lg"
      >
        {popup.mode === 'edit' && (
          <BankAccountFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BankAccountFormContent({
  item,
  onClose,
}: {
  item?: BankAccountItem;
  onClose: () => void;
}) {
  const createMut = useCreateBankAccountMutation();
  const updateMut = useUpdateBankAccountMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: BankAccountForm = {
    accountNo: '',
    bankName: '',
    branch: '',
    ifscCode: '',
    accountType: 'Current',
    isActive: true,
  };
  const [form, setForm] = useState<BankAccountForm>(
    item
      ? {
          accountNo: item.accountNo,
          bankName: item.bankName,
          branch: item.branch,
          ifscCode: item.ifscCode,
          accountType: item.accountType,
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
          label="Account No."
          placeholder="Enter account number"
          value={form.accountNo}
          onChange={v => setForm(p => ({ ...p, accountNo: v }))}
          required
        />
        <TextBox
          label="Bank Name"
          placeholder="e.g. State Bank of India"
          value={form.bankName}
          onChange={v => setForm(p => ({ ...p, bankName: v }))}
          required
        />
        <TextBox
          label="Branch"
          placeholder="e.g. Main Campus Branch"
          value={form.branch}
          onChange={v => setForm(p => ({ ...p, branch: v }))}
          required
        />
        <TextBox
          label="IFSC Code"
          placeholder="e.g. SBIN0001234"
          value={form.ifscCode}
          onChange={v => setForm(p => ({ ...p, ifscCode: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Account Type"
          data={ACCOUNT_TYPES}
          value={form.accountType}
          onChange={v => setForm(p => ({ ...p, accountType: v as string }))}
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
