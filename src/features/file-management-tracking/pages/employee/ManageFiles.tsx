import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import {
  ConfidentialityBadge,
  FileStatusBadge,
  InfoBanner,
  PriorityBadge,
} from '../../components';
import { mockFiles, mockUsers } from '../../data';

export default function ManageFiles() {
  const navigate = useNavigate();
  const currentUser = mockUsers[8];
  const myFiles = mockFiles.filter(f => f.createdBy === currentUser.id);

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'My Files' },
      ]}
      title="My Files"
      description="View, create, and manage your eFiles"
    >
      <InfoBanner
        title="About My Files"
        message="Access your active desk. Review, update, and process the files currently assigned to you."
      />
      <GridPanel
        title="My Files"
        data={myFiles}
        columns={
          [
            { field: 'fileNumber', header: 'File #' },
            { field: 'title', header: 'Title' },
            { field: 'categoryName', header: 'Category' },
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
            {
              header: 'Conf.',
              cell: (row: any) => (
                <ConfidentialityBadge level={row.confidentialityName} />
              ),
            },
            {
              field: 'updatedAt',
              header: 'Last Updated',
              cell: (row: any) => (
                <span className="text-xs">{row.updatedAt}</span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <div className="flex gap-1">
                  <Button
                    label="View"
                    icon="visibility"
                    onClick={() =>
                      navigate(
                        `/file-management-tracking/employee/view/${row.id}`
                      )
                    }
                  />
                  <Button
                    label="Part-file"
                    icon="alt_route"
                    tooltip="Create Part File"
                    onClick={() =>
                      navigate(
                        `/file-management-tracking/employee/part-file/${row.id}`
                      )
                    }
                  />
                </div>
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
        toolbar={
          <Button
            label="Create New File"
            icon="add"
            onClick={() =>
              navigate('/file-management-tracking/employee/create')
            }
          />
        }
      />
    </FormPage>
  );
}
