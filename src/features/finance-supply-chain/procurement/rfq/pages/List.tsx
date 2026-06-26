import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';
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
import { RFQS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type RFQItem = (typeof RFQS)[0];
const QK = ['@fsc/rfqs'];
function useRFQQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...RFQS],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = useRFQQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Request for Quotation (RFQ)"
      description="Manage and issue RFQs to registered vendors based on PRs."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by RFQ no, PR ref, item..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'rfqNo', header: 'RFQ No' },
            { field: 'date', header: 'Date issued' },
            { field: 'prReference', header: 'PR Reference' },
            { field: 'item', header: 'Item' },
            {
              field: 'vendors',
              header: 'Vendors Sent',
              cell: (i: RFQItem) => <span>{i.vendors.join(', ')}</span>,
            },
            { field: 'dueDate', header: 'Due Date' },
            { field: 'createdBy', header: 'Created By' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: RFQItem) => (
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
              label="Create RFQ"
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
        title="Create RFQ"
        subtitle="Issue a new Request for Quotation."
        size="lg"
      >
        <RFQForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function RFQForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    rfqNo: '',
    date: '',
    prReference: '',
    item: '',
    dueDate: '',
    status: 'Open',
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
          label="RFQ No."
          placeholder="Auto-generated"
          value={form.rfqNo}
          onChange={v => setForm(p => ({ ...p, rfqNo: v }))}
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
          label="PR Reference"
          placeholder="e.g. PR-2024-001"
          value={form.prReference}
          onChange={v => setForm(p => ({ ...p, prReference: v }))}
          required
        />
        <TextBox
          label="Item"
          placeholder="e.g. Lab Equipment"
          value={form.item}
          onChange={v => setForm(p => ({ ...p, item: v }))}
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
            { label: 'Open', value: 'Open' },
            { label: 'Closed', value: 'Closed' },
          ]}
          value={form.status}
          onChange={v => setForm(p => ({ ...p, status: v as string }))}
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
