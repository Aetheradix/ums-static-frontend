import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function FeeCollection() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    feeComponentId: '',
    amountPaid: '',
    paymentDate: '',
    receiptNo: '',
    status: 'Paid',
  });

  return (
    <FormPage
      title="Fee Collection & Receipt"
      description="Record student fee payments and generate receipts."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/fee-collection',
        },
        { label: 'Fee Collection' },
      ]}
    >
      <FormCard title="Record Payment" icon="price_check">
        <FormGrid columns={4}>
          <TextBox
            label="Student ID *"
            value={form.studentId}
            onChange={v => setForm({ ...form, studentId: v })}
          />
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <DropDownList
            label="Fee Component *"
            data={data.feeComponents.map(fc => ({ id: fc.id, text: fc.name }))}
            textField="text"
            valueField="id"
            value={form.feeComponentId}
            onChange={v => setForm({ ...form, feeComponentId: v as string })}
          />
          <TextBox
            label="Amount Paid (₹) *"
            value={form.amountPaid}
            onChange={v => setForm({ ...form, amountPaid: v })}
          />

          <TextBox
            label="Payment Date"
            type="date"
            value={form.paymentDate}
            onChange={v => setForm({ ...form, paymentDate: v })}
          />
          <TextBox
            label="Receipt No."
            value={form.receiptNo}
            onChange={v => setForm({ ...form, receiptNo: v })}
          />
          <DropDownList
            label="Status"
            data={[
              { id: 'Paid', text: 'Paid' },
              { id: 'Pending', text: 'Pending' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Record Payment" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Collection List" icon="list">
        <GridPanel
          data={data.feeCollections}
          columns={[
            { field: 'receiptNo', header: 'Receipt No' },
            { field: 'studentId', header: 'Student ID' },
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'feeComponentId',
              header: 'Fee Component',
              cell: (item: any) =>
                (
                  <>
                    {
                      data.feeComponents.find(
                        fc => fc.id === item.feeComponentId
                      )?.name
                    }
                  </>
                ) || 'Hostel Fee',
            },
            { field: 'amountPaid', header: 'Amount Paid (₹)' },
            { field: 'paymentDate', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
