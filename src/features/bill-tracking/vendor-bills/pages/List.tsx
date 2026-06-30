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
import { BT_VENDORS, BT_BUDGET_HEADS } from '../../mock-data';
import type { VendorBillForm, VendorBillItem } from '../api';
import {
  useVendorBillsQuery,
  useCreateVendorBillMutation,
  useSubmitVendorBillMutation,
} from '../queries';

const VENDOR_OPTIONS = BT_VENDORS.map(v => ({ label: v.name, value: v.name }));
const BUDGET_OPTIONS = BT_BUDGET_HEADS.map(b => ({
  label: b.name,
  value: b.name,
}));
const GST_TYPE_OPTIONS = [
  { label: 'CGST + SGST', value: 'CGST+SGST' },
  { label: 'IGST', value: 'IGST' },
];
const GST_PCT_OPTIONS = [5, 12, 18, 28].map(v => ({
  label: `${v}%`,
  value: v,
}));
const TDS_PCT_OPTIONS = [1, 2, 5, 10].map(v => ({ label: `${v}%`, value: v }));

function statusVariant(s: string) {
  if (['Approved', 'Paid'].includes(s)) return 'approved';
  if (['Submitted', 'Verified'].includes(s)) return 'pending';
  if (s === 'Cancelled') return 'rejected';
  return 'neutral';
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: VendorBillItem };

export default function List() {
  const { data, isLoading } = useVendorBillsQuery();
  const { mutateAsync: submitBill } = useSubmitVendorBillMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Vendor Bills"
      description="Record and manage all vendor invoices with GST, TDS, and deduction details."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by bill no, vendor, invoice no..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'billNo', header: 'Bill No' },
            { field: 'vendor', header: 'Vendor' },
            { field: 'invoiceNo', header: 'Invoice No' },
            {
              field: 'baseAmount',
              header: 'Base Amt (₹)',
              cell: (i: VendorBillItem) => (
                <span>₹{i.baseAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'gstAmount',
              header: 'GST (₹)',
              cell: (i: VendorBillItem) => (
                <span>₹{i.gstAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'tdsAmount',
              header: 'TDS (₹)',
              cell: (i: VendorBillItem) => (
                <span>₹{i.tdsAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'netPayable',
              header: 'Net Payable (₹)',
              cell: (i: VendorBillItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.netPayable.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'dueDate', header: 'Due Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: VendorBillItem) => (
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
              cell: (i: VendorBillItem) => (
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
                      onClick={() => submitBill(i.id)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Record Bill"
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
        title="Record Vendor Bill"
        subtitle="Enter vendor invoice details with tax and deduction information."
        size="lg"
      >
        <VendorBillFormContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Vendor Bill: ${popup.mode === 'view' ? popup.item.billNo : ''}`}
        subtitle="Review vendor bill details."
        size="lg"
      >
        {popup.mode === 'view' && (
          <VendorBillDetail item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function VendorBillFormContent({ onClose }: { onClose: () => void }) {
  const createMut = useCreateVendorBillMutation();
  const BLANK: VendorBillForm = {
    billDate: '',
    vendor: '',
    invoiceNo: '',
    invoiceDate: '',
    baseAmount: 0,
    gstType: 'CGST+SGST',
    gstPct: 18,
    gstAmount: 0,
    tdsPct: 2,
    tdsAmount: 0,
    cessPct: 0,
    cessAmount: 0,
    securityDeposit: 0,
    netPayable: 0,
    budgetHead: '',
    dueDate: '',
    status: 'Draft',
    purposeOfBill: '',
    attachment: null,
  };
  const [form, setForm] = useState<VendorBillForm>(BLANK);

  function recalculate(f: VendorBillForm): VendorBillForm {
    const gst = Math.round((f.baseAmount * f.gstPct) / 100);
    const tds = Math.round((f.baseAmount * f.tdsPct) / 100);
    const cess = Math.round((f.baseAmount * f.cessPct) / 100);
    const net = f.baseAmount + gst - tds - cess - f.securityDeposit;
    return {
      ...f,
      gstAmount: gst,
      tdsAmount: tds,
      cessAmount: cess,
      netPayable: net,
    };
  }

  function update(patch: Partial<VendorBillForm>) {
    setForm(p => recalculate({ ...p, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Vendor & Invoice Details
      </p>
      <FormGrid columns={2}>
        <DropDownList
          label="Vendor"
          textField="label"
          valueField="value"
          data={VENDOR_OPTIONS}
          value={form.vendor}
          onChange={v => update({ vendor: v as string })}
        />
        <TextBox
          label="Invoice No."
          placeholder="e.g. INV-2025-101"
          value={form.invoiceNo}
          onChange={v => update({ invoiceNo: v })}
          required
        />
        <DatePicker
          label="Bill Date"
          value={form.billDate ? new Date(form.billDate) : undefined}
          onChange={v =>
            update({ billDate: v ? v.toISOString().split('T')[0] : '' })
          }
          required
        />
        <DatePicker
          label="Invoice Date"
          value={form.invoiceDate ? new Date(form.invoiceDate) : undefined}
          onChange={v =>
            update({ invoiceDate: v ? v.toISOString().split('T')[0] : '' })
          }
          required
        />
        <DatePicker
          label="Due Date"
          value={form.dueDate ? new Date(form.dueDate) : undefined}
          onChange={v =>
            update({ dueDate: v ? v.toISOString().split('T')[0] : '' })
          }
          required
        />
        <DropDownList
          label="Budget Head"
          textField="label"
          valueField="value"
          data={BUDGET_OPTIONS}
          value={form.budgetHead}
          onChange={v => update({ budgetHead: v as string })}
        />
      </FormGrid>

      <p className="text-xs font-semibold text-gray-500 uppercase mt-5 mb-3">
        Amount & Tax Details
      </p>
      <FormGrid columns={3}>
        <NumberBox
          label="Base Amount (₹)"
          value={form.baseAmount}
          onChange={v => update({ baseAmount: v ?? 0 })}
          required
        />
        <DropDownList
          label="GST Type"
          textField="label"
          valueField="value"
          data={GST_TYPE_OPTIONS}
          value={form.gstType}
          onChange={v => update({ gstType: v as string })}
        />
        <DropDownList
          label="GST %"
          textField="label"
          valueField="value"
          data={GST_PCT_OPTIONS}
          value={form.gstPct}
          onChange={v => update({ gstPct: v as number })}
        />
        <NumberBox
          label="GST Amount (₹)"
          value={form.gstAmount}
          onChange={() => {}}
        />
        <DropDownList
          label="TDS %"
          textField="label"
          valueField="value"
          data={TDS_PCT_OPTIONS}
          value={form.tdsPct}
          onChange={v => update({ tdsPct: v as number })}
        />
        <NumberBox
          label="TDS Amount (₹)"
          value={form.tdsAmount}
          onChange={() => {}}
        />
        <NumberBox
          label="Cess %"
          value={form.cessPct}
          onChange={v => update({ cessPct: v ?? 0 })}
        />
        <NumberBox
          label="Cess Amount (₹)"
          value={form.cessAmount}
          onChange={() => {}}
        />
        <NumberBox
          label="Security Deposit (₹)"
          value={form.securityDeposit}
          onChange={v => update({ securityDeposit: v ?? 0 })}
        />
      </FormGrid>

      <p className="text-xs font-semibold text-gray-500 uppercase mt-5 mb-3">
        Additional Details
      </p>
      <FormGrid columns={2}>
        <TextArea
          label="Purpose of Bill"
          placeholder="Brief description of what this bill is for"
          value={form.purposeOfBill || ''}
          onChange={v => update({ purposeOfBill: v })}
          required
        />
        <FileUpload
          label="Upload Bill (Optional)"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeKB={5120} // 5MB
          uploadNote="Max size: 5MB. Formats: PDF, JPG, PNG"
          value={form.attachment}
          onChange={f => update({ attachment: f })}
        />
      </FormGrid>

      <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-600 font-semibold uppercase mb-1">
          Net Payable Amount
        </p>
        <p className="text-2xl font-bold text-blue-700">
          ₹{form.netPayable.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-blue-500 mt-1">
          Base + GST − TDS − Cess − Security Deposit
        </p>
      </div>

      <FormActions
        isEditMode={false}
        isLoading={createMut.isPending}
        onSave={() => {}}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}

function VendorBillDetail({
  item,
  onClose,
}: {
  item: VendorBillItem;
  onClose: () => void;
}) {
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
        {[
          ['Bill No.', item.billNo],
          ['Bill Date', item.billDate],
          ['Vendor', item.vendor],
          ['Invoice No.', item.invoiceNo],
          ['Invoice Date', item.invoiceDate],
          ['Due Date', item.dueDate],
          ['Budget Head', item.budgetHead],
          ['GST Type', item.gstType],
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
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              ['Base Amount', item.baseAmount],
              [`GST (${item.gstType} @ ${item.gstPct}%)`, item.gstAmount],
              [`TDS Deduction (${item.tdsPct}%)`, -item.tdsAmount],
              item.cessAmount > 0
                ? [`Cess (${item.cessPct}%)`, -item.cessAmount]
                : null,
              item.securityDeposit > 0
                ? ['Security Deposit', -item.securityDeposit]
                : null,
            ]
              .filter(Boolean)
              .map(row => {
                const [desc, amt] = row as [string, number];
                return (
                  <tr key={desc}>
                    <td className="px-4 py-3 text-gray-800">{desc}</td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${amt < 0 ? 'text-red-600' : 'text-gray-800'}`}
                    >
                      {amt < 0
                        ? `−₹${Math.abs(amt).toLocaleString('en-IN')}`
                        : `₹${amt.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot className="bg-gray-50 border-t">
            <tr>
              <td className="px-4 py-3 font-bold text-gray-900">Net Payable</td>
              <td className="px-4 py-3 font-bold text-blue-700 text-right text-lg">
                ₹{item.netPayable.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
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
