import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockDAKReceipts } from '../../data';

export default function DakList() {
  const navigate = useNavigate();

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'DAK Receipts' },
      ]}
      title="DAK Receipts"
      description="View and manage DAK (Diary & Dak) receipts"
    >
      <InfoBanner
        title="About DAK Receipts"
        message="Review the list of incoming physical postal documents (Dak) dispatched to your office."
      />
      <GridPanel
        title="DAK Receipts"
        data={mockDAKReceipts}
        columns={
          [
            { field: 'diaryNumber', header: 'Diary #' },
            { field: 'senderName', header: 'Sender' },
            { field: 'subject', header: 'Subject' },
            { field: 'modeOfReceipt', header: 'Mode' },
            {
              field: 'assignedDepartmentName',
              header: 'Dept.',
              cell: (row: any) => (
                <span>{row.assignedDepartmentName || '—'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (row: any) => (
                <StatusBadge
                  label={row.status}
                  variant={
                    row.status === 'Registered'
                      ? 'neutral'
                      : row.status === 'Processed'
                        ? 'pending'
                        : 'approved'
                  }
                />
              ),
            },
            {
              field: 'receivedDate',
              header: 'Received',
              cell: (row: any) => (
                <span className="text-xs">{row.receivedDate}</span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <Button
                  icon="visibility"
                  label="View"
                  onClick={() =>
                    navigate(
                      `/file-management-tracking/employee/dak/view/${row.id}`
                    )
                  }
                />
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
        toolbar={
          <Button
            label="Create DAK"
            icon="add"
            onClick={() =>
              navigate('/file-management-tracking/employee/dak/create')
            }
          />
        }
      />
    </FormPage>
  );
}
