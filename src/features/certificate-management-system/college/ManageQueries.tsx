import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';

const statuses = [
  { name: 'All Statuses', value: 'all' },
  { name: 'Open', value: 'open' },
  { name: 'In Progress', value: 'progress' },
  { name: 'Resolved', value: 'resolved' },
];

export default function ManageQueries() {
  const [data] = useState([
    {
      id: 1,
      ticketNo: 'TKT-1002',
      student: 'Amit Kumar',
      type: 'Application taking too long',
      date: '25-06-2026',
      status: 'Open',
    },
    {
      id: 2,
      ticketNo: 'TKT-1001',
      student: 'Ahmed Khan',
      type: 'Payment deducted but status pending',
      date: '22-06-2026',
      status: 'Resolved',
    },
  ]);

  const [filter, setFilter] = useState('all');

  const handleReply = () => {
    prompt('Enter your reply to the student:');
    alert('Reply sent and ticket status updated to Resolved.');
  };

  const actionTemplate = (rowData: any) => {
    if (rowData.status === 'Resolved') {
      return <Button label="View Thread" variant="outlined" />;
    }
    return (
      <Button
        label="Reply & Resolve"
        variant="primary"
        onClick={() => handleReply()}
      />
    );
  };

  const columns = [
    { field: 'ticketNo', header: 'Ticket No' },
    { field: 'student', header: 'Student' },
    { field: 'type', header: 'Issue Type' },
    { field: 'date', header: 'Date Raised' },
    {
      field: 'status',
      header: 'Status',
      cell: (r: any) => (
        <StatusBadge
          label={r.status}
          variant={
            r.status === 'Resolved'
              ? 'approved'
              : r.status === 'Open'
                ? 'rejected'
                : 'pending'
          }
        />
      ),
    },
    { field: 'actions', header: 'Actions', cell: actionTemplate },
  ];

  return (
    <FormPage
      title="Manage Student Queries"
      description="Respond to helpdesk tickets raised by students regarding certificate applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'College Portal', to: '/home/sub-menu/college-portal' },
        { label: 'Manage Queries' },
      ]}
    >
      <FormCard>
        <div className="flex w-64 mb-4">
          <DropDownList
            label="Filter by Status"
            data={statuses}
            textField="name"
            optionValue="value"
            value={filter}
            onChange={v => setFilter(String(v))}
          />
        </div>
      </FormCard>

      <GridPanel columns={columns as any} data={data} searchBox />
    </FormPage>
  );
}
