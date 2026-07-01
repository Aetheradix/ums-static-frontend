import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  NumberBox,
  DatePicker,
  DropDownList,
} from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { BT_EMPLOYEES, BT_BUDGET_HEADS } from '../../mock-data';
import type { EmployeeClaimForm, EmployeeClaimItem } from '../api';
import {
  useEmployeeClaimsQuery,
  useCreateEmployeeClaimMutation,
  useSubmitEmployeeClaimMutation,
} from '../queries';

const EMPLOYEE_OPTIONS = BT_EMPLOYEES.map(e => ({
  label: `${e.name} (${e.empId})`,
  value: e.name,
}));
const EMP_ID_MAP = Object.fromEntries(BT_EMPLOYEES.map(e => [e.name, e.empId]));
const BUDGET_OPTIONS = BT_BUDGET_HEADS.map(b => ({
  label: b.name,
  value: b.name,
}));
const CLAIM_TYPE_OPTIONS = [
  { label: 'Travel', value: 'Travel' },
  { label: 'Medical', value: 'Medical' },
  { label: 'TA-DA', value: 'TA-DA' },
  { label: 'Conveyance', value: 'Conveyance' },
  { label: 'Training', value: 'Training' },
  { label: 'Other', value: 'Other' },
];

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: EmployeeClaimItem };

export default function List() {
  const { data, isLoading } = useEmployeeClaimsQuery();
  const { mutateAsync: submitClaim } = useSubmitEmployeeClaimMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Employee Claims"
      description="Manage travel, medical, TA-DA and other reimbursement claims submitted by employees."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by claim no, employee, type..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'claimNo', header: 'Claim No' },
            { field: 'employeeName', header: 'Employee' },
            { field: 'employeeId', header: 'Emp ID' },
            { field: 'claimType', header: 'Claim Type' },
            {
              field: 'claimAmount',
              header: 'Amount (₹)',
              cell: (i: EmployeeClaimItem) => (
                <span>₹{i.claimAmount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'claimDate', header: 'Date' },
            { field: 'budgetHead', header: 'Budget Head' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: EmployeeClaimItem) => (
                <StatusBadge
                  label={i.status}
                  variant={statusVariant(i.status)}
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '120px',
              cell: (i: EmployeeClaimItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item: i })}
                  />
                  {i.status === 'Draft' && (
                    <Button
                      icon="send"
                      variant="primary"
                      onClick={() => submitClaim(i.id)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="New Claim"
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
        title="New Employee Claim"
        subtitle="Submit a new reimbursement claim."
        size="lg"
      >
        <EmployeeClaimFormContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Claim: ${popup.mode === 'view' ? popup.item.claimNo : ''}`}
        subtitle="View employee claim details."
        size="lg"
      >
        {popup.mode === 'view' && (
          <ClaimDetailView item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function EmployeeClaimFormContent({ onClose }: { onClose: () => void }) {
  const createMut = useCreateEmployeeClaimMutation();
  const BLANK: EmployeeClaimForm = {
    employeeName: '',
    employeeId: '',
    claimType: 'Travel',
    claimDate: '',
    claimAmount: 0,
    description: '',
    budgetHead: '',
    status: 'Draft',
  };
  const [form, setForm] = useState<EmployeeClaimForm>(BLANK);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <DropDownList
          label="Employee Name"
          textField="label"
          valueField="value"
          data={EMPLOYEE_OPTIONS}
          value={form.employeeName}
          onChange={v => {
            const name = v as string;
            setForm(p => ({
              ...p,
              employeeName: name,
              employeeId: EMP_ID_MAP[name] ?? '',
            }));
          }}
        />
        <TextBox
          label="Employee ID"
          placeholder="Auto-filled"
          value={form.employeeId}
          onChange={() => {}}
        />
        <DropDownList
          label="Claim Type"
          textField="label"
          valueField="value"
          data={CLAIM_TYPE_OPTIONS}
          value={form.claimType}
          onChange={v => setForm(p => ({ ...p, claimType: v as string }))}
        />
        <DatePicker
          label="Claim Date"
          value={form.claimDate ? new Date(form.claimDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              claimDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <NumberBox
          label="Claim Amount (₹)"
          value={form.claimAmount}
          onChange={v => setForm(p => ({ ...p, claimAmount: v ?? 0 }))}
          required
        />
        <DropDownList
          label="Budget Head"
          textField="label"
          valueField="value"
          data={BUDGET_OPTIONS}
          value={form.budgetHead}
          onChange={v => setForm(p => ({ ...p, budgetHead: v as string }))}
        />
        <TextBox
          label="Description"
          placeholder="Purpose/description of claim"
          value={form.description}
          onChange={v => setForm(p => ({ ...p, description: v }))}
          required
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={createMut.isPending}
        onSave={() => {}}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}

function ClaimDetailView({
  item,
  onClose,
}: {
  item: EmployeeClaimItem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        {[
          ['Claim No.', item.claimNo],
          ['Employee Name', item.employeeName],
          ['Employee ID', item.employeeId],
          ['Claim Type', item.claimType],
          ['Claim Date', item.claimDate],
          ['Claim Amount', `₹${item.claimAmount.toLocaleString('en-IN')}`],
          ['Budget Head', item.budgetHead],
          ['Description', item.description],
          ['Status', item.status],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              {label}
            </p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <Button label="Close" variant="outlined" onClick={onClose} />
      </div>
    </div>
  );
}
