import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function DisciplinaryAction() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    reason: '',
    fineAmount: '',
    actionTaken: '',
    date: '',
    status: 'Pending',
  });

  return (
    <FormPage
      title="Disciplinary Action & Fine Entry"
      description="Record disciplinary actions and fines issued to students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/disciplinary-action',
        },
        { label: 'Disciplinary Action' },
      ]}
    >
      <FormCard title="Record Action / Fine" icon="gavel">
        <FormGrid columns={3}>
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <TextBox
            label="Reason *"
            value={form.reason}
            onChange={v => setForm({ ...form, reason: v })}
          />
          <TextBox
            label="Fine Amount (₹)"
            value={form.fineAmount}
            onChange={v => setForm({ ...form, fineAmount: v })}
          />

          <TextBox
            label="Action Taken"
            value={form.actionTaken}
            onChange={v => setForm({ ...form, actionTaken: v })}
          />
          <TextBox
            label="Date"
            type="date"
            value={form.date}
            onChange={v => setForm({ ...form, date: v })}
          />
          <DropDownList
            label="Status"
            data={[
              { id: 'Pending', text: 'Pending' },
              { id: 'Actioned', text: 'Actioned' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Record Entry" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Disciplinary Logs" icon="list">
        <GridPanel
          data={data.disciplinaryActions}
          columns={[
            { field: 'date', header: 'Date' },
            { field: 'studentName', header: 'Student Name' },
            { field: 'reason', header: 'Reason' },
            { field: 'actionTaken', header: 'Action Taken' },
            { field: 'fineAmount', header: 'Fine (₹)' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Actioned'
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
