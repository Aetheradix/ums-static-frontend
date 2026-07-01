import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  NumberBox,
  DatePicker,
  DropDownList,
  TextArea,
  FileUpload,
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
import type { BillReceiptForm, BillReceiptItem } from '../api';
import { useBillReceiptsQuery, useCreateBillReceiptMutation } from '../queries';

const BILL_TYPE_OPTIONS = [
  { label: 'Vendor', value: 'Vendor' },
  { label: 'Employee', value: 'Employee' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: BillReceiptItem };

function statusVariant(status: string) {
  if (['In Verification', 'Received'].includes(status)) return 'pending';
  if (status === 'Draft') return 'neutral';
  return 'approved';
}

export default function List() {
  const { data, isLoading } = useBillReceiptsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Bill Receipt"
      description="Register and track all incoming bills and invoices received at the institution."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by receipt no, party, invoice no..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'receiptNo', header: 'Receipt No' },
            { field: 'billType', header: 'Bill Type' },
            { field: 'partyName', header: 'Party Name' },
            { field: 'invoiceNo', header: 'Invoice No' },
            {
              field: 'invoiceAmount',
              header: 'Amount (₹)',
              cell: (i: BillReceiptItem) => (
                <span>₹{i.invoiceAmount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'receivedDate', header: 'Received Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: BillReceiptItem) => (
                <StatusBadge
                  label={i.status}
                  variant={statusVariant(i.status)}
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '80px',
              cell: (i: BillReceiptItem) => (
                <Button
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'view', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Register Bill"
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
        title="Register Bill Receipt"
        subtitle="Enter the incoming bill details."
        size="lg"
      >
        <BillReceiptForm onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Bill Receipt: ${popup.mode === 'view' ? popup.item.receiptNo : ''}`}
        subtitle="View bill receipt details."
        size="lg"
      >
        {popup.mode === 'view' && (
          <BillReceiptView item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BillReceiptForm({ onClose }: { onClose: () => void }) {
  const createMut = useCreateBillReceiptMutation();
  const BLANK: BillReceiptForm = {
    billType: 'Vendor',
    partyName: '',
    invoiceNo: '',
    invoiceDate: '',
    invoiceAmount: 0,
    receivedDate: '',
    receivedBy: '',
    remarks: '',
    purposeOfBill: '',
    attachment: null,
  };
  const [form, setForm] = useState<BillReceiptForm>(BLANK);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <DropDownList
          label="Bill Type"
          textField="label"
          valueField="value"
          data={BILL_TYPE_OPTIONS}
          value={form.billType}
          onChange={v => setForm(p => ({ ...p, billType: v as string }))}
        />
        <TextBox
          label="Party Name (Vendor / Employee)"
          placeholder="Enter name"
          value={form.partyName}
          onChange={v => setForm(p => ({ ...p, partyName: v }))}
          required
        />
        <TextBox
          label="Invoice No."
          placeholder="e.g. INV-2025-101"
          value={form.invoiceNo}
          onChange={v => setForm(p => ({ ...p, invoiceNo: v }))}
          required
        />
        <DatePicker
          label="Invoice Date"
          value={form.invoiceDate ? new Date(form.invoiceDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              invoiceDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <NumberBox
          label="Invoice Amount (₹)"
          value={form.invoiceAmount}
          onChange={v => setForm(p => ({ ...p, invoiceAmount: v ?? 0 }))}
          required
        />
        <DatePicker
          label="Received Date"
          value={form.receivedDate ? new Date(form.receivedDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              receivedDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <TextBox
          label="Received By"
          placeholder="Staff name"
          value={form.receivedBy}
          onChange={v => setForm(p => ({ ...p, receivedBy: v }))}
          required
        />
        <TextArea
          label="Purpose of Bill"
          placeholder="Brief description of what this bill is for"
          value={form.purposeOfBill || ''}
          onChange={v => setForm(p => ({ ...p, purposeOfBill: v }))}
          required
        />
        <FileUpload
          label="Upload Bill (Optional)"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeKB={5120} // 5MB
          uploadNote="Max size: 5MB. Formats: PDF, JPG, PNG"
          value={form.attachment}
          onChange={f => setForm(p => ({ ...p, attachment: f }))}
        />
        <TextBox
          label="Remarks"
          placeholder="Optional remarks"
          value={form.remarks}
          onChange={v => setForm(p => ({ ...p, remarks: v }))}
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

function BillReceiptView({
  item,
  onClose,
}: {
  item: BillReceiptItem;
  onClose: () => void;
}) {
  const fields: { label: string; value: string | number }[] = [
    { label: 'Receipt No.', value: item.receiptNo },
    { label: 'Bill Type', value: item.billType },
    { label: 'Party Name', value: item.partyName },
    { label: 'Invoice No.', value: item.invoiceNo },
    { label: 'Invoice Date', value: item.invoiceDate },
    {
      label: 'Invoice Amount',
      value: `₹${item.invoiceAmount.toLocaleString('en-IN')}`,
    },
    { label: 'Received Date', value: item.receivedDate },
    { label: 'Received By', value: item.receivedBy },
    { label: 'Status', value: item.status },
    { label: 'Remarks', value: item.remarks || 'N/A' },
  ];
  return (
    <div className="flex flex-col gap-4">
      {item.purposeOfBill && (
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 uppercase tracking-wider font-bold mb-1">
            Purpose of Bill
          </p>
          <p className="text-sm font-medium text-gray-900">
            {item.purposeOfBill}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        {fields.map(f => (
          <div key={f.label}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              {f.label}
            </p>
            <p className="text-sm font-medium text-gray-900">{f.value}</p>
          </div>
        ))}
      </div>

      {item.attachment && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
              <i className="pi pi-file text-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Attached Invoice
              </p>
              <p className="text-xs text-gray-500">Document provided</p>
            </div>
          </div>
          <Button label="Download" icon="download" variant="outlined" />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button label="Close" variant="outlined" onClick={onClose} />
      </div>
    </div>
  );
}
