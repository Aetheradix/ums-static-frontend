import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextBox,
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
import { GOODS_RECEIPTS } from '../../../mock-data';

type GRNItem = (typeof GOODS_RECEIPTS)[0];
const QK = ['@fsc/goods-receipts'];

function useGRNQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...GOODS_RECEIPTS],
  });
  return { data, isLoading };
}

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'receipt'; item: GRNItem };

export default function List() {
  const { data, isLoading } = useGRNQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Goods Receipt Note (GRN)"
      description="Record and inspect goods received from vendors."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by GRN no, PO no, vendor..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'grnNo', header: 'GRN No' },
            { field: 'date', header: 'Date' },
            { field: 'poNo', header: 'PO Ref' },
            { field: 'vendor', header: 'Vendor' },
            { field: 'item', header: 'Item' },
            { field: 'quantityOrdered', header: 'Ordered' },
            { field: 'quantityReceived', header: 'Received' },
            {
              field: 'condition',
              header: 'Condition',
              sortable: false,
              cell: (i: GRNItem) => (
                <StatusBadge
                  label={i.condition}
                  variant={
                    i.condition === 'Approved' ||
                    i.condition === 'Delivered' ||
                    i.condition === 'Good' ||
                    i.condition === 'Paid' ||
                    i.condition === 'Active' ||
                    i.condition === 'Completed' ||
                    i.condition === 'Filed' ||
                    i.condition === 'Deposited' ||
                    i.condition === 'Issued' ||
                    i.condition === 'Matched' ||
                    i.condition === 'Open'
                      ? 'approved'
                      : i.condition === 'Pending' ||
                          i.condition === 'Draft' ||
                          i.condition === 'Defective' ||
                          i.condition === 'Repair' ||
                          i.condition === 'Medium'
                        ? 'pending'
                        : i.condition === 'Closed' ||
                            i.condition === 'Retired' ||
                            i.condition === 'Low' ||
                            i.condition === 'Cancelled'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
            { field: 'receivedBy', header: 'Received By' },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              width: '100px',
              cell: (i: GRNItem) => (
                <Button
                  label="Receipt"
                  icon="file"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'receipt', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create GRN"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      {/* Create GRN Modal */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Goods Receipt Note"
        subtitle="Record physical receipt of goods."
        size="lg"
      >
        <GRNForm onClose={closePopup} />
      </FormPopup>

      {/* Receipt Preview Modal */}
      <FormPopup
        visible={popup.mode === 'receipt'}
        onHide={closePopup}
        title=""
        subtitle=""
        size="lg"
      >
        {popup.mode === 'receipt' && (
          <div className="bg-white px-2 py-4 sm:px-8 sm:py-6 font-sans text-gray-800">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Goods Receipt Note
              </h1>
            </div>

            <div className="flex justify-between items-start mb-8">
              {/* Bill To / Vendor */}
              <div>
                <h3 className="font-bold text-gray-400 uppercase tracking-wide mb-2 text-xs">
                  Vendor Details
                </h3>
                <p className="font-bold text-sm text-gray-800">
                  {popup.item.vendor}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  PO Ref:{' '}
                  <span className="text-gray-800">{popup.item.poNo}</span>
                </p>
              </div>

              {/* Receipt Info */}
              <div className="text-right text-sm text-gray-800 space-y-1">
                <p className="font-medium text-gray-500">
                  GRN No:{' '}
                  <span className="font-bold text-gray-900">
                    {popup.item.grnNo}
                  </span>
                </p>
                <p className="font-medium text-gray-500">
                  Date:{' '}
                  <span className="font-bold text-gray-900">
                    {new Date(popup.item.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden mb-8 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-4 py-3 border-r border-gray-200">
                      Item Description
                    </th>
                    <th className="px-4 py-3 border-r border-gray-200 text-center w-24">
                      Ordered
                    </th>
                    <th className="px-4 py-3 border-r border-gray-200 text-center w-24">
                      Received
                    </th>
                    <th className="px-4 py-3 border-r border-gray-200 text-right w-32">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 border-r border-gray-200 font-medium text-gray-900">
                      {popup.item.item}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-center font-medium text-gray-600">
                      {popup.item.quantityOrdered}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-center font-bold text-gray-900 bg-gray-50/50">
                      {popup.item.quantityReceived}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-right font-medium text-gray-600">
                      ₹
                      {(
                        popup.item.unitPrice ||
                        popup.item.totalAmount /
                          (popup.item.quantityReceived || 1)
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">
                      ₹
                      {popup.item.totalAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mb-10 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-6 bg-gray-50 p-4 rounded-md border border-gray-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Condition:
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${popup.item.condition === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                  >
                    {popup.item.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Received By:
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {popup.item.receivedBy}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Value
                </p>
                <h2 className="text-xl font-black text-indigo-600">
                  ₹
                  {popup.item.totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </h2>
              </div>
            </div>

            {/* Footer Text */}
            <div className="text-xs text-gray-500 space-y-2 mt-4 pt-4 border-t border-gray-200">
              <p>
                This document is a computer-generated Goods Receipt Note (GRN)
                and confirms the physical receipt of the above-mentioned goods.
              </p>
              <p>
                For any discrepancies, please contact the procurement department
                immediately.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 mt-8 border-t border-gray-100 gap-3 print:hidden">
              <Button label="Close" variant="outlined" onClick={closePopup} />
              <Button
                label="Print Receipt"
                icon="print"
                variant="primary"
                onClick={() => window.print()}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}

function GRNForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: Omit<GRNItem, 'id'>) => {
      return { id: Date.now(), ...data } as GRNItem;
    },
    onSuccess: newGrn => {
      const prev = qc.getQueryData<GRNItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...prev, newGrn]);
      onClose();
    },
  });

  const BLANK = {
    grnNo: '',
    date: '',
    poNo: '',
    vendor: '',
    item: '',
    quantityOrdered: 0,
    quantityReceived: 0,
    unitPrice: 0,
    totalAmount: 0,
    condition: 'Good',
    receivedBy: '',
  };
  const [form, setForm] = useState(BLANK);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="GRN No."
          placeholder="Auto-generated"
          value={form.grnNo}
          onChange={v => setForm(p => ({ ...p, grnNo: v }))}
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
          label="PO Reference"
          placeholder="e.g. PO-2024-001"
          value={form.poNo}
          onChange={v => setForm(p => ({ ...p, poNo: v }))}
          required
        />
        <TextBox
          label="Vendor"
          placeholder="Vendor name"
          value={form.vendor}
          onChange={v => setForm(p => ({ ...p, vendor: v }))}
          required
        />
        <TextBox
          label="Item"
          placeholder="Item received"
          value={form.item}
          onChange={v => setForm(p => ({ ...p, item: v }))}
          required
        />
        <NumberBox
          label="Quantity Ordered"
          value={form.quantityOrdered}
          onChange={v => setForm(p => ({ ...p, quantityOrdered: v ?? 0 }))}
          required
        />
        <NumberBox
          label="Quantity Received"
          value={form.quantityReceived}
          onChange={v => setForm(p => ({ ...p, quantityReceived: v ?? 0 }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Condition"
          data={[
            { label: 'Good', value: 'Good' },
            { label: 'Damaged', value: 'Damaged' },
            { label: 'Defective', value: 'Defective' },
          ]}
          value={form.condition}
          onChange={v => setForm(p => ({ ...p, condition: v as string }))}
        />
        <TextBox
          label="Received By"
          placeholder="Name of receiver"
          value={form.receivedBy}
          onChange={v => setForm(p => ({ ...p, receivedBy: v }))}
          required
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={mutation.isPending}
        onSave={() => handleSubmit}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}
