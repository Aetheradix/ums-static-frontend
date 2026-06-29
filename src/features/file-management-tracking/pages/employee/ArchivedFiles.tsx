import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import { ConfidentialityBadge } from '../../components';
import { mockFiles, mockUsers } from '../../data';

export default function ArchivedFiles() {
  const navigate = useNavigate();
  const currentUser = mockUsers[9];
  const archivedFiles = mockFiles.filter(
    f =>
      f.createdBy === currentUser.id &&
      (f.currentStatus === 'Archived' || f.currentStatus === 'Closed')
  );

  return (
    <FormPage
      title="Archived Files"
      description="View your closed and archived files"
    >
      <GridPanel
        title="Archived Files"
        data={archivedFiles}
        columns={
          [
            { field: 'fileNumber', header: 'File #' },
            { field: 'title', header: 'Title' },
            { field: 'categoryName', header: 'Category' },
            {
              header: 'Conf.',
              cell: (row: any) => (
                <ConfidentialityBadge level={row.confidentialityName} />
              ),
            },
            {
              field: 'currentStatus',
              header: 'Status',
              cell: (row: any) => (
                <StatusBadge
                  label={row.currentStatus}
                  variant={
                    row.currentStatus === 'Closed' ? 'approved' : 'neutral'
                  }
                />
              ),
            },
            {
              field: 'archivedAt',
              header: 'Archived',
              cell: (row: any) => (
                <span className="text-xs">
                  {row.archivedAt || row.updatedAt}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <Button
                  icon="visibility"
                  variant="text"
                  size="small"
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
