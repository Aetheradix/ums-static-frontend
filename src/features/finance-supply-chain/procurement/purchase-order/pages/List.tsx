import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, NumberBox, DatePicker } from 'shared/components/forms';
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
import { PURCHASE_ORDERS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type POItem = (typeof PURCHASE_ORDERS)[0];
const QK = ['@fsc/purchase-orders'];
function usePOQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...PURCHASE_ORDERS],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = usePOQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Purchase Order"
      description="Manage purchase orders issued to vendors."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by PO no, vendor, item..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'poNo', header: 'PO No' },
            { field: 'date', header: 'Date' },
            { field: 'vendor', header: 'Vendor' },
            { field: 'item', header: 'Item' },
            { field: 'quantity', header: 'Qty' },
            {
              field: 'totalAmount',
              header: 'Total (₹)',
              cell: (i: POItem) => (
                <span className="font-semibold text-blue-700">
                  ₹{i.totalAmount.toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'deliveryDate', header: 'Est. Delivery' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: POItem) => (
                <StatusBadge
                  label={i.status}
                  variant={
                    i.status === 'Approved' ||
                    i.status === 'Delivered' ||
                    i.status === 'Good' ||
                    i.status === 'Paid' ||
                    i.status === 'Active' ||
                    i.status === 'Completed' ||
                    i.status === 'Filed' ||
                    i.status === 'Deposited' ||
                    i.status === 'Issued' ||
                    i.status === 'Matched' ||
                    i.status === 'Open'
                      ? 'approved'
                      : i.status === 'Pending' ||
                          i.status === 'Draft' ||
                          i.status === 'Defective' ||
                          i.status === 'Repair' ||
                          i.status === 'Medium'
                        ? 'pending'
                        : i.status === 'Closed' ||
                            i.status === 'Retired' ||
                            i.status === 'Low' ||
                            i.status === 'Cancelled'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create PO"
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
        title="Create Purchase Order"
        subtitle="Issue a new PO based on approved quotations."
        size="lg"
      >
        <POForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function POForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    poNo: '',
    date: '',
    vendor: '',
    item: '',
    quantity: 1,
    unitPrice: 0,
    deliveryDate: '',
    prReference: '',
    status: 'Pending',
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
          label="PO No."
          placeholder="Auto-generated"
          value={form.poNo}
          onChange={v => setForm(p => ({ ...p, poNo: v }))}
        />
        <DatePicker
          label="Date"
          value={form.date ? new Date(form.date) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              date: v ? v.toISOString().split('T')[0] : '',
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
          label="Item"
          placeholder="Item name"
          value={form.item}
          onChange={v => setForm(p => ({ ...p, item: v }))}
          required
        />
        <NumberBox
          label="Quantity"
          value={form.quantity}
          onChange={v => setForm(p => ({ ...p, quantity: v ?? 1 }))}
          required
        />
        <NumberBox
          label="Unit Price (₹)"
          value={form.unitPrice}
          onChange={v => setForm(p => ({ ...p, unitPrice: v ?? 0 }))}
          required
        />
        <DatePicker
          label="Delivery Date"
          value={form.deliveryDate ? new Date(form.deliveryDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              deliveryDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <TextBox
          label="PR Reference"
          placeholder="e.g. PR-2024-001"
          value={form.prReference}
          onChange={v => setForm(p => ({ ...p, prReference: v }))}
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
