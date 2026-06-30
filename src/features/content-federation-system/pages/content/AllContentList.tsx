import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';
import { ToastService } from 'services';
import type { ContentItem } from '../../types';

export default function AllContentList() {
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<ContentItem[]>([]);

  // Simple state for UI interactions
  const [, setRefreshCount] = useState(0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Published':
        return 'approved';
      case 'Approved':
        return 'approved';
      case 'Pending Review':
        return 'pending';
      case 'Rejected':
        return 'rejected';
      case 'On Hold':
        return 'neutral';
      case 'Returned':
        return 'pending';
      case 'Expired':
        return 'neutral';
      case 'Archived':
        return 'neutral';
      case 'Submitted':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'rejected';
      case 'Low':
        return 'neutral';
      default:
        return 'pending';
    }
  };

  const handleBulkAction = (action: string) => {
    if (
      window.confirm(
        `Are you sure you want to bulk ${action.toLowerCase()} ${selectedIds.length} items?`
      )
    ) {
      ToastService.success(
        `Bulk ${action} applied to ${selectedIds.length} items`
      );
      setSelectedIds([]);
      setRefreshCount(c => c + 1);
    }
  };

  const columns: Controls.ColumnProps<ContentItem>[] = [
    {
      field: 'id',
      header: 'ID',
      width: '80px',
    },
    {
      field: 'title',
      header: 'Title',
      sortable: true,
    },
    {
      field: 'publishingCategoryTitle',
      header: 'Category',
      sortable: true,
    },
    {
      field: 'organizationalUnitName',
      header: 'Org Unit',
      sortable: true,
    },
    {
      field: 'priority',
      header: 'Priority',
      sortable: true,
      cell: (rowData: ContentItem) => (
        <StatusBadge
          label={rowData.priority}
          variant={getPriorityVariant(rowData.priority)}
        />
      ),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      cell: (rowData: ContentItem) => (
        <StatusBadge
          label={rowData.status}
          variant={getStatusVariant(rowData.status)}
        />
      ),
    },
    {
      field: 'id',
      header: 'Actions',
      width: '120px',
      cell: (rowData: ContentItem) => (
        <div className="flex gap-2">
          <Button
            variant="text"
            icon="pi pi-eye"
            onClick={() => navigate(cfsUrls.content.view(rowData.id))}
            tooltip="View Content"
          />
          <Button
            variant="text"
            icon="pi pi-history"
            onClick={() => navigate(cfsUrls.tracking.lifecycle(rowData.id))}
            tooltip="Track Lifecycle"
          />
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="All Content (Admin View)"
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'All Content' },
      ]}
      headerAction={
        <Button
          label="Add Content"
          icon="pi pi-plus"
          variant="primary"
          onClick={() => navigate(cfsUrls.ouAdmin.addContent)}
        />
      }
    >
      <FormCard>
        {/* Floating Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              <i className="pi pi-info-circle mr-2" />
              {selectedIds.length} items selected
            </span>
            <div className="flex gap-3">
              <Button
                label="Bulk Approve"
                variant="success"
                icon="pi pi-check"
                onClick={() => handleBulkAction('Approve')}
              />
              <Button
                label="Bulk Reject"
                variant="danger"
                icon="pi pi-times"
                onClick={() => handleBulkAction('Reject')}
              />
              <Button
                label="Clear Selection"
                variant="text"
                onClick={() => setSelectedIds([])}
              />
            </div>
          </div>
        )}

        <GridPanel
          data={mockContent}
          columns={columns}
          pagination={{ rows: 10 }}
          searchPlaceholder="Search content..."
          selectionMode="multiple"
          selection={selectedIds}
          onSelectionChange={e => {
            // In prime react, this returns an array of objects.
            // But GridPanel type signature might be different.
            // We'll store the raw selection from GridPanel.
            setSelectedIds(e.value as any);
          }}
        />
      </FormCard>
    </FormPage>
  );
}
