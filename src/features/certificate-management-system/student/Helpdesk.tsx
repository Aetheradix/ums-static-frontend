import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';

const issueTypes = [
  { name: 'Application taking too long', value: 'delay' },
  { name: 'Payment deducted but status pending', value: 'payment' },
  { name: 'Error in generated certificate', value: 'error' },
  { name: 'Other', value: 'other' },
];

export default function Helpdesk() {
  const [form, setForm] = useState({
    type: 'delay',
    description: '',
    applicationNo: 'RGPV/BON/2026/0099',
  });

  const [data] = useState([
    {
      id: 1,
      ticketNo: 'TKT-1001',
      type: 'Payment deducted but status pending',
      date: '22-06-2026',
      status: 'Resolved',
    },
  ]);

  const handleSubmit = () => {
    alert('Support ticket raised successfully! Our team will respond shortly.');
  };

  const columns = [
    { field: 'ticketNo', header: 'Ticket No' },
    { field: 'type', header: 'Issue Type' },
    { field: 'date', header: 'Date Raised' },
    {
      field: 'status',
      header: 'Status',
      cell: (r: any) => (
        <StatusBadge
          label={r.status}
          variant={r.status === 'Resolved' ? 'approved' : 'pending'}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Helpdesk & Support"
      description="Raise a ticket if you are facing issues with your certificate application or payment."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'Helpdesk' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <FormCard title="Raise a New Ticket">
            <FormGrid columns={1}>
              <TextBox
                label="Application No (Optional)"
                value={form.applicationNo}
                onChange={v => setForm({ ...form, applicationNo: v })}
              />
              <DropDownList
                label="Issue Type"
                data={issueTypes}
                textField="name"
                optionValue="value"
                value={form.type}
                onChange={v => setForm({ ...form, type: String(v) })}
                required
              />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>
            </FormGrid>
            <div className="mt-6 flex justify-end">
              <Button
                label="Submit Ticket"
                variant="primary"
                icon="send"
                onClick={handleSubmit}
                disabled={!form.description}
              />
            </div>
          </FormCard>
        </div>

        <div className="lg:col-span-2">
          <GridPanel
            title="My Tickets"
            columns={columns as any}
            data={data}
            emptyMessage="You have not raised any tickets yet."
          />
        </div>
      </div>
    </FormPage>
  );
}
