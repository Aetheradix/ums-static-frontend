import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import { FileStatusBadge, InfoBanner, PriorityBadge } from '../../components';
import { mockFileMovements, mockFiles, mockUsers } from '../../data';

export default function IncomingFiles() {
  const navigate = useNavigate();
  const currentUser = mockUsers[9];
  const assignedFileIds = mockFileMovements
    .filter(m => m.toUserId === currentUser.id)
    .map(m => m.fileId);
  const incomingFiles = mockFiles.filter(
    f =>
      assignedFileIds.includes(f.id) &&
      f.currentStatus !== 'Closed' &&
      f.currentStatus !== 'Archived'
  );

  const getReceivedDate = (fileId: number) => {
    const movements = mockFileMovements.filter(
      m => m.fileId === fileId && m.toUserId === currentUser.id
    );
    return movements.length > 0
      ? movements[movements.length - 1].actionDate
      : '';
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Incoming Files' },
      ]}
      title="Incoming Files"
      description="Files forwarded to you for action"
    >
      <InfoBanner
        title="About Incoming Files"
        message="Review newly forwarded files that have arrived at your desk and require your immediate attention."
      />
      <GridPanel
        title="Incoming Files"
        data={incomingFiles}
        columns={
          [
            { field: 'fileNumber', header: 'File #' },
            { field: 'title', header: 'Title' },
            {
              header: 'Priority',
              cell: (row: any) => <PriorityBadge priority={row.priorityName} />,
            },
            {
              header: 'Status',
              cell: (row: any) => (
                <FileStatusBadge status={row.currentStatus} />
              ),
            },
            { field: 'departmentName', header: 'Department' },
            {
              header: 'Received',
              cell: (row: any) => (
                <span className="text-xs">{getReceivedDate(row.id)}</span>
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
                      `/file-management-tracking/employee/view/${row.id}`
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
      />
    </FormPage>
  );
}
