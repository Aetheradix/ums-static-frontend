import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function FeeGeneration() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentId: '',
    facilityId: '',
    month: '',
    startDate: '',
    lastDate: '',
    amount: '',
    status: 'Active',
    visible: 'Yes',
  });

  return (
    <FormPage
      title="Student Fee Component (Fee Generation)"
      description="Generate or map fee components to specific students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/fee-generation',
        },
        { label: 'Fee Generation' },
      ]}
    >
      <FormCard title="Generate Fee" icon="receipt">
        <FormGrid columns={3}>
          <TextBox
            label="Student ID *"
            value={form.studentId}
            onChange={v => setForm({ ...form, studentId: v })}
          />
          <DropDownList
            label="Fee Component / Facility *"
            data={data.feeComponents.map(fc => ({ id: fc.id, text: fc.name }))}
            textField="text"
            valueField="id"
            value={form.facilityId}
            onChange={v => setForm({ ...form, facilityId: v as string })}
          />
          <TextBox
            label="Billing Month"
            value={form.month}
            onChange={v => setForm({ ...form, month: v })}
            placeholder="e.g. August 2026"
          />

          <TextBox
            label="Amount (₹) *"
            value={form.amount}
            onChange={v => setForm({ ...form, amount: v })}
          />
          <TextBox
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={v => setForm({ ...form, startDate: v })}
          />
          <TextBox
            label="Last Date"
            type="date"
            value={form.lastDate}
            onChange={v => setForm({ ...form, lastDate: v })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Generate" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Generated Fees List" icon="list">
        <GridPanel
          data={data.feeGenerations}
          columns={[
            { field: 'studentId', header: 'Student ID' },
            {
              field: 'facilityId',
              header: 'Fee Type',
              cell: (item: any) =>
                (
                  <>
                    {
                      data.feeComponents.find(
                        fc => fc.facilityId === item.facilityId
                      )?.name
                    }
                  </>
                ) || 'Hostel Term Fee',
            },
            { field: 'month', header: 'Month' },
            { field: 'amount', header: 'Amount (₹)' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'lastDate', header: 'Due Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
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
