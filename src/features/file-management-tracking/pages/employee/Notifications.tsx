import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockNotifications, mockUsers } from '../../data';

export default function Notifications() {
  const navigate = useNavigate();
  const currentUser = mockUsers[9];
  const [notifs, setNotifs] = useState(
    mockNotifications.filter(n => n.recipientUserId === currentUser.id)
  );

  const markAsRead = (id: number) => {
    const n = notifs.find(n => n.id === id);
    if (n) {
      n.isRead = true;
      setNotifs([...notifs]);
    }
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Notifications' },
      ]}
      title="Notifications"
      description="View and manage your in-app notifications"
    >
      <GridPanel
        title="Notifications"
        data={notifs}
        columns={
          [
            {
              field: 'createdAt',
              header: 'Date',
              cell: (row: any) => (
                <span className="text-xs whitespace-nowrap">
                  {row.createdAt}
                </span>
              ),
            },
            {
              field: 'type',
              header: 'Type',
              cell: (row: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.type === 'FileAssigned'
                      ? 'bg-blue-100 text-blue-700'
                      : row.type === 'FileApproved'
                        ? 'bg-green-100 text-green-700'
                        : row.type === 'FileRejected'
                          ? 'bg-red-100 text-red-700'
                          : row.type === 'FileReturned'
                            ? 'bg-yellow-100 text-yellow-700'
                            : row.type === 'FileOverdue'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {row.type}
                </span>
              ),
            },
            { field: 'message', header: 'Message' },
            {
              field: 'sentVia',
              header: 'Channel',
              cell: (row: any) => (
                <span className="text-xs text-gray-500">{row.sentVia}</span>
              ),
            },
            {
              field: 'isRead',
              header: 'Status',
              cell: (row: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs ${row.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700 font-medium'}`}
                >
                  {row.isRead ? 'Read' : 'Unread'}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <div className="flex gap-1">
                  {!row.isRead && (
                    <Button
                      icon="mark_email_read"
                      label="Mark as Read"
                      onClick={() => markAsRead(row.id)}
                    />
                  )}
                  {row.fileId && (
                    <Button
                      icon="visibility"
                      label="View"
                      onClick={() =>
                        navigate(
                          `/file-management-tracking/employee/view/${row.fileId}`
                        )
                      }
                      tooltip="View File"
                    />
                  )}
                </div>
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
