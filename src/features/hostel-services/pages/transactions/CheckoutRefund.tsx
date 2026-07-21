import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function CheckoutRefund() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    roomId: '',
    vacateDate: '',
    depositAmount: '',
    refundAmount: '',
    refundStatus: 'Pending',
  });

  return (
    <FormPage
      title="Vacate/Checkout & Deposit Refund"
      description="Process student checkouts and initiate deposit refunds."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/checkout-refund',
        },
        { label: 'Checkout & Refund' },
      ]}
    >
      <FormCard title="Process Checkout" icon="exit_to_app">
        <FormGrid columns={3}>
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <TextBox
            label="Room No *"
            value={form.roomId}
            onChange={v => setForm({ ...form, roomId: v })}
          />
          <TextBox
            label="Vacate Date *"
            type="date"
            value={form.vacateDate}
            onChange={v => setForm({ ...form, vacateDate: v })}
          />

          <TextBox
            label="Deposit Amount (₹)"
            value={form.depositAmount}
            onChange={v => setForm({ ...form, depositAmount: v })}
          />
          <TextBox
            label="Refund Amount (₹)"
            value={form.refundAmount}
            onChange={v => setForm({ ...form, refundAmount: v })}
          />
          <DropDownList
            label="Refund Status"
            data={[
              { id: 'Pending', text: 'Pending' },
              { id: 'Processed', text: 'Processed' },
            ]}
            textField="text"
            valueField="id"
            value={form.refundStatus}
            onChange={v => setForm({ ...form, refundStatus: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Process Checkout"
            variant="primary"
            onClick={() => {}}
          />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Checkout Logs" icon="list">
        <GridPanel
          data={data.checkouts}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'roomId', header: 'Room No' },
            { field: 'vacateDate', header: 'Vacate Date' },
            { field: 'depositAmount', header: 'Deposit (₹)' },
            { field: 'refundAmount', header: 'Refund (₹)' },
            {
              field: 'refundStatus',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.refundStatus === 'Processed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.refundStatus}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
