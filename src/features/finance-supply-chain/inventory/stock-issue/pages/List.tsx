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
import { STOCK_ISSUES } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type IssueItem = (typeof STOCK_ISSUES)[0];
const QK = ['@fsc/stock-issues'];
function useStockIssuesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...STOCK_ISSUES],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = useStockIssuesQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Stock Issue"
      description="Issue materials and assets from stores to departments."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by issue no, item, issued to..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'issueNo', header: 'Issue No' },
            { field: 'date', header: 'Date' },
            { field: 'item', header: 'Item' },
            { field: 'quantity', header: 'Quantity' },
            { field: 'issuedTo', header: 'Issued To' },
            { field: 'purpose', header: 'Purpose' },
            { field: 'issuedBy', header: 'Issued By' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: IssueItem) => (
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
              label="New Issue"
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
        title="Issue Stock"
        subtitle="Record a new stock issue to a department."
        size="lg"
      >
        <IssueForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function IssueForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    issueNo: '',
    date: '',
    item: '',
    quantity: 1,
    issuedTo: '',
    purpose: '',
    issuedBy: '',
    status: 'Issued',
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
          label="Issue No."
          placeholder="Auto-generated"
          value={form.issueNo}
          onChange={v => setForm(p => ({ ...p, issueNo: v }))}
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
          label="Item"
          placeholder="Select item"
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
        <TextBox
          label="Issued To"
          placeholder="Department or Person"
          value={form.issuedTo}
          onChange={v => setForm(p => ({ ...p, issuedTo: v }))}
          required
        />
        <TextBox
          label="Purpose"
          placeholder="Reason for issue"
          value={form.purpose}
          onChange={v => setForm(p => ({ ...p, purpose: v }))}
          required
        />
        <TextBox
          label="Issued By"
          placeholder="Your name"
          value={form.issuedBy}
          onChange={v => setForm(p => ({ ...p, issuedBy: v }))}
          required
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
