import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextBox,
  DatePicker,
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
import { VENDOR_BILLS } from '../../../mock-data';

type BillItem = (typeof VENDOR_BILLS)[0];
const QK = ['@fsc/vendor-bills'];
function useVendorBillsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...VENDOR_BILLS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; bill: BillItem };

export default function List() {
  const { data, isLoading } = useVendorBillsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Vendor Bill"
      description="Record and process vendor invoices against GRNs or direct services."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by bill no, vendor, GRN ref..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'billNo', header: 'Bill No' },
            { field: 'billDate', header: 'Bill Date' },
            { field: 'vendor', header: 'Vendor' },
            { field: 'grnReference', header: 'GRN Ref' },
            {
              field: 'amount',
              header: 'Base (₹)',
              cell: (i: BillItem) => (
                <span>₹{i.amount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'gst',
              header: 'GST (₹)',
              cell: (i: BillItem) => (
                <span>₹{i.gst.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'totalAmount',
              header: 'Total (₹)',
              cell: (i: BillItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.totalAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'dueDate', header: 'Due Date' },
            {
              field: 'paymentStatus',
              header: 'Status',
              sortable: false,
              cell: (i: BillItem) => (
                <StatusBadge
                  label={i.paymentStatus}
                  variant={
                    i.paymentStatus === 'Approved' ||
                    i.paymentStatus === 'Delivered' ||
                    i.paymentStatus === 'Good' ||
                    i.paymentStatus === 'Paid' ||
                    i.paymentStatus === 'Active' ||
                    i.paymentStatus === 'Completed' ||
                    i.paymentStatus === 'Filed' ||
                    i.paymentStatus === 'Deposited' ||
                    i.paymentStatus === 'Issued' ||
                    i.paymentStatus === 'Matched' ||
                    i.paymentStatus === 'Open'
                      ? 'approved'
                      : i.paymentStatus === 'Pending' ||
                          i.paymentStatus === 'Draft' ||
                          i.paymentStatus === 'Defective' ||
                          i.paymentStatus === 'Repair' ||
                          i.paymentStatus === 'Medium'
                        ? 'pending'
                        : i.paymentStatus === 'Closed' ||
                            i.paymentStatus === 'Retired' ||
                            i.paymentStatus === 'Low' ||
                            i.paymentStatus === 'Cancelled'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '100px',
              cell: (i: BillItem) => (
                <div className="flex gap-2">
                  <Button
                    icon="download"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', bill: i })}
                  />
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
        subtitle="Enter a new vendor invoice."
        size="lg"
      >
        <BillForm onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Vendor Bill: ${popup.mode === 'view' ? popup.bill.billNo : ''}`}
        subtitle="Review vendor invoice details."
        size="lg"
      >
        {popup.mode === 'view' && (
          <BillDetailsView bill={popup.bill} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BillForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    billNo: '',
    billDate: '',
    vendor: '',
    grnReference: '',
    amount: 0,
    gst: 0,
    dueDate: '',
    paymentStatus: 'Pending',
    poNo: '',
  });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <FormGrid columns={2}>
        <TextBox
          label="Bill No."
          placeholder="Vendor invoice number"
          value={form.billNo}
          onChange={v => setForm(p => ({ ...p, billNo: v }))}
          required
        />
        <DatePicker
          label="Bill Date"
          value={form.billDate ? new Date(form.billDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              billDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <TextBox
          label="Vendor"
          placeholder="Select vendor"
          value={form.vendor}
          onChange={v => setForm(p => ({ ...p, vendor: v }))}
          required
        />
        <TextBox
          label="GRN Reference"
          placeholder="Optional"
          value={form.grnReference}
          onChange={v => setForm(p => ({ ...p, grnReference: v }))}
        />
        <NumberBox
          label="Base Amount (₹)"
          value={form.amount}
          onChange={v => setForm(p => ({ ...p, amount: v ?? 0 }))}
          required
        />
        <NumberBox
          label="GST Amount (₹)"
          value={form.gst}
          onChange={v => setForm(p => ({ ...p, gst: v ?? 0 }))}
          required
        />
        <DatePicker
          label="Due Date"
          value={form.dueDate ? new Date(form.dueDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              dueDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Status"
          data={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Paid', value: 'Paid' },
            { label: 'Overdue', value: 'Overdue' },
          ]}
          value={form.paymentStatus}
          onChange={v => setForm(p => ({ ...p, paymentStatus: v as string }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={false}
        onSave={() => {}}
        onReset={() => {}}
      />
    </form>
  );
}

function BillDetailsView({
  bill,
  onClose,
}: {
  bill: BillItem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Vendor
          </p>
          <p className="text-sm font-medium text-gray-900">{bill.vendor}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Bill Date
          </p>
          <p className="text-sm font-medium text-gray-900">{bill.billDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Due Date
          </p>
          <p className="text-sm font-medium text-gray-900">{bill.dueDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            GRN Ref
          </p>
          <p className="text-sm font-medium text-gray-900">
            {bill.grnReference || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Status
          </p>
          <StatusBadge
            label={bill.paymentStatus}
            variant={
              bill.paymentStatus === 'Paid'
                ? 'approved'
                : bill.paymentStatus === 'Pending'
                  ? 'pending'
                  : 'neutral'
            }
          />
        </div>
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
            <tr>
              <td className="px-4 py-3 text-gray-800">Base Amount</td>
              <td className="px-4 py-3 text-gray-800 text-right font-medium">
                {bill.amount.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-800">GST</td>
              <td className="px-4 py-3 text-gray-800 text-right font-medium">
                {bill.gst.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50 border-t">
            <tr>
              <td className="px-4 py-3 font-bold text-gray-900">Total</td>
              <td className="px-4 py-3 font-bold text-blue-700 text-right text-lg">
                {bill.totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button label="Close" variant="outlined" onClick={onClose} />
        <Button
          label="Download PDF"
          icon="download"
          variant="primary"
          onClick={() => {
            ToastService.success('Downloading PDF...');
            onClose();
          }}
        />
      </div>
    </div>
  );
}
