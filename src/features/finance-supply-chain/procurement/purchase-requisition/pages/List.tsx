import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  NumberBox,
  DropDownList,
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
import { PURCHASE_REQUISITIONS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type PRItem = (typeof PURCHASE_REQUISITIONS)[0];
const QK = ['@fsc/purchase-requisitions'];
function usePRQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...PURCHASE_REQUISITIONS],
  });
  return { data, isLoading };
}

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = usePRQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Purchase Requisition"
      description="Manage material and service requests from departments."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by PR no, department, item..."
          columns={[
            { field: 'prNo', header: 'PR No' },
            { field: 'date', header: 'Date' },
            { field: 'department', header: 'Department' },
            { field: 'item', header: 'Item' },
            { field: 'quantity', header: 'Quantity' },
            { field: 'estimatedCost', header: 'Est. Cost' },
            {
              field: 'priority',
              header: 'Priority',
              sortable: false,
              cell: (i: PRItem) => (
                <StatusBadge
                  label={i.priority}
                  variant={
                    i.priority === 'Approved' ||
                    i.priority === 'Delivered' ||
                    i.priority === 'Good' ||
                    i.priority === 'Paid' ||
                    i.priority === 'Active' ||
                    i.priority === 'Completed' ||
                    i.priority === 'Filed' ||
                    i.priority === 'Deposited' ||
                    i.priority === 'Issued' ||
                    i.priority === 'Matched' ||
                    i.priority === 'Open'
                      ? 'approved'
                      : i.priority === 'Pending' ||
                          i.priority === 'Draft' ||
                          i.priority === 'Defective' ||
                          i.priority === 'Repair' ||
                          i.priority === 'Medium'
                        ? 'pending'
                        : i.priority === 'Closed' ||
                            i.priority === 'Retired' ||
                            i.priority === 'Low' ||
                            i.priority === 'Cancelled' ||
                            i.priority === 'Overdue'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: PRItem) => (
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
                            i.status === 'Cancelled' ||
                            i.status === 'Overdue'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create PR"
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
        title="Create Purchase Requisition"
        subtitle="Submit a new request for procurement."
        size="lg"
      >
        <PRForm onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function PRForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    prNo: '',
    date: '',
    department: '',
    item: '',
    quantity: 0,
    estimatedCost: 0,
    priority: 'Medium',
    status: 'Draft',
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
          label="PR No."
          placeholder="Auto-generated"
          value={form.prNo}
          onChange={v => setForm(p => ({ ...p, prNo: v }))}
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
          label="Department"
          placeholder="Requesting department"
          value={form.department}
          onChange={v => setForm(p => ({ ...p, department: v }))}
          required
        />
        <TextBox
          label="Item"
          placeholder="What is needed?"
          value={form.item}
          onChange={v => setForm(p => ({ ...p, item: v }))}
          required
        />
        <NumberBox
          label="Quantity"
          value={form.quantity}
          onChange={v => setForm(p => ({ ...p, quantity: v ?? 0 }))}
          required
        />
        <NumberBox
          label="Estimated Cost"
          value={form.estimatedCost}
          onChange={v => setForm(p => ({ ...p, estimatedCost: v ?? 0 }))}
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Priority"
          data={[
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
          ]}
          value={form.priority}
          onChange={v => setForm(p => ({ ...p, priority: v as string }))}
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
