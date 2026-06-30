import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';

export default function VersionHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);

  const content = mockContent.find(c => c.id === Number(id)) || mockContent[0];

  // Inline mock versions based on the content item
  const mockVersions = [
    {
      version: '1.2',
      status: 'Published',
      date: '2026-06-25 10:00 AM',
      author: 'OU Admin',
      changes: 'Final published version with all corrections.',
    },
    {
      version: '1.1',
      status: 'Pending Review',
      date: '2026-06-24 02:30 PM',
      author: 'OU Admin',
      changes: 'Incorporated reviewer feedback.',
    },
    {
      version: '1.0',
      status: 'Returned',
      date: '2026-06-23 11:15 AM',
      author: 'Reviewer',
      changes: 'Returned for correction.',
    },
    {
      version: '0.9',
      status: 'Submitted',
      date: '2026-06-22 09:00 AM',
      author: 'OU Admin',
      changes: 'Initial draft submitted.',
    },
    {
      version: '0.1',
      status: 'Draft',
      date: '2026-06-20 04:45 PM',
      author: 'OU Admin',
      changes: 'Document creation.',
    },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Published':
        return 'approved';
      case 'Pending Review':
        return 'pending';
      case 'Returned':
        return 'pending';
      case 'Submitted':
        return 'neutral';
      case 'Draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const columns: Controls.ColumnProps<any>[] = [
    { field: 'version', header: 'Version', width: '100px' },
    {
      field: 'status',
      header: 'Status',
      cell: (item: any) => (
        <StatusBadge
          label={item.status}
          variant={getBadgeVariant(item.status)}
        />
      ),
    },
    { field: 'date', header: 'Date & Time' },
    { field: 'author', header: 'Author' },
    { field: 'changes', header: 'Change Summary' },
    {
      field: 'version',
      header: 'Action',
      width: '100px',
      cell: (item: any) => (
        <Button
          variant="outlined"
          label="View"
          onClick={() => setSelectedVersion(item)}
          size="small"
        />
      ),
    },
  ];

  return (
    <FormPage
      title={`Version History: ${content.title}`}
      description="View the complete version lifecycle of this content item."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'All Content', to: cfsUrls.admin.allContent },
        { label: 'Version History' },
      ]}
      headerAction={
        <Button
          label="Back to Content"
          icon="pi pi-arrow-left"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
      }
    >
      <FormCard>
        <GridPanel
          data={mockVersions}
          columns={columns}
          pagination={{ rows: 10 }}
        />
      </FormCard>

      <FormPopup
        visible={!!selectedVersion}
        onHide={() => setSelectedVersion(null)}
        title={`Version ${selectedVersion?.version} Details`}
        size="lg"
      >
        {selectedVersion && (
          <div className="flex flex-col gap-4 p-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold block text-gray-500">
                  Version
                </span>
                <span className="text-lg font-bold">
                  {selectedVersion.version}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-gray-500">
                  Status
                </span>
                <StatusBadge
                  label={selectedVersion.status}
                  variant={getBadgeVariant(selectedVersion.status)}
                  className="mt-1 block"
                />
              </div>
              <div>
                <span className="font-semibold block text-gray-500">
                  Author
                </span>
                <span>{selectedVersion.author}</span>
              </div>
              <div>
                <span className="font-semibold block text-gray-500">
                  Date & Time
                </span>
                <span>{selectedVersion.date}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-semibold block text-gray-500">
                Change Summary
              </span>
              <p className="bg-gray-50 p-3 rounded border border-gray-150 mt-1 shadow-inner">
                {selectedVersion.changes}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-end gap-3">
              <Button
                variant="outlined"
                label="Close"
                onClick={() => setSelectedVersion(null)}
              />
              <Button
                variant="primary"
                label="Restore This Version"
                icon="pi pi-history"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to restore this version?'
                    )
                  ) {
                    setSelectedVersion(null);
                  }
                }}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
