import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  advocates,
  paymentStatusVariant,
  type Payment,
  type PaymentMode,
  type PaymentStatus,
} from '../../mocks';
import {
  useCasesQuery,
  useCreatePaymentMutation,
  usePaymentsQuery,
} from '../../queries';
import { legalUrls } from '../../urls';

const MODE_OPTIONS = [
  { name: 'Cheque', value: 'Cheque' },
  { name: 'Bank Transfer', value: 'Transfer' },
  { name: 'Cash', value: 'Cash' },
  { name: 'Online', value: 'Online' },
];

const STATUS_OPTIONS = [
  { name: 'Logged', value: 'Logged' },
  { name: 'Verified', value: 'Verified' },
  { name: 'Paid', value: 'Paid' },
];

const formatDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

export default function Payments() {
  const { data: cases } = useCasesQuery();
  const { data: payments, isLoading } = usePaymentsQuery();
  const createMutation = useCreatePaymentMutation();

  const [open, setOpen] = useState(false);
  const [caseId, setCaseId] = useState<number | null>(null);
  const [advocateId, setAdvocateId] = useState<number | null>(null);
  const [hearingDate, setHearingDate] = useState<Date | undefined>();
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<PaymentMode>('Transfer');
  const [amount, setAmount] = useState<number>(0);
  const [txnId, setTxnId] = useState('');
  const [txnDate, setTxnDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<PaymentStatus>('Logged');

  const resetForm = () => {
    setCaseId(null);
    setAdvocateId(null);
    setHearingDate(undefined);
    setDescription('');
    setMode('Transfer');
    setAmount(0);
    setTxnId('');
    setTxnDate(undefined);
    setStatus('Logged');
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!caseId) {
      ToastService.error('Please select a case.');
      return;
    }
    if (!advocateId) {
      ToastService.error('Please select an advocate.');
      return;
    }
    if (!amount || amount <= 0) {
      ToastService.error('Please enter a valid amount.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        caseId,
        advocateId,
        hearingDate: formatDate(hearingDate) ?? '',
        description,
        mode,
        amount,
        txnId,
        txnDate: formatDate(txnDate) ?? '',
        status,
      });
      ToastService.success('Payment logged successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to save the payment.');
    }
  };

  return (
    <FormPage
      title="Advocate Payments"
      description="Log and verify advocate fee payments against cases and hearings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Administrator', to: legalUrls.admin.portal },
        { label: 'Advocate Payments' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={payments}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by case no. or advocate..."
          toolbar={
            <Button
              label="Log Payment"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            { field: 'caseNumber', header: 'Case No.', sortable: true },
            { field: 'advocateName', header: 'Advocate' },
            { field: 'description', header: 'Description' },
            { field: 'mode', header: 'Mode' },
            {
              header: 'Amount',
              cell: (p: Payment) => (
                <span>₹{p.amount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'txnDate', header: 'Txn Date' },
            {
              header: 'Status',
              cell: (p: Payment) => (
                <StatusBadge
                  label={p.status}
                  variant={paymentStatusVariant(p.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="Log Advocate Payment"
        subtitle="Record a fee payment against a case and hearing."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DropDownList
              label="Case"
              placeholder="Select Case"
              data={cases}
              textField="caseNumber"
              valueField="id"
              value={caseId}
              onChange={val => setCaseId(val as number)}
              required
            />
            <DropDownList
              label="Advocate"
              placeholder="Select Advocate"
              data={advocates}
              textField="name"
              valueField="id"
              value={advocateId}
              onChange={val => setAdvocateId(val as number)}
              required
            />
            <DatePicker
              label="Hearing Date"
              placeholder="Select related hearing date"
              value={hearingDate}
              onChange={val => setHearingDate(val ?? undefined)}
            />
            <DropDownList
              label="Payment Mode"
              data={MODE_OPTIONS}
              textField="name"
              valueField="value"
              value={mode}
              onChange={val => setMode(val as PaymentMode)}
            />
            <NumberBox
              label="Amount (₹)"
              value={amount}
              onChange={val => setAmount(Number(val) || 0)}
              min={0}
              required
            />
            <TextBox
              label="Transaction ID"
              placeholder="e.g. NEFT-8841203"
              value={txnId}
              onChange={setTxnId}
            />
            <DatePicker
              label="Transaction Date"
              placeholder="Select transaction date"
              value={txnDate}
              onChange={val => setTxnDate(val ?? undefined)}
            />
            <DropDownList
              label="Status"
              data={STATUS_OPTIONS}
              textField="name"
              valueField="value"
              value={status}
              onChange={val => setStatus(val as PaymentStatus)}
            />
          </div>
          <TextArea
            label="Description"
            placeholder="Nature of the payment (appearance, drafting, etc.)"
            value={description}
            onChange={setDescription}
            rows={2}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setOpen(false)}
            />
            <Button
              label="Save"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
