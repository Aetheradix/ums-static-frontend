import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';
import type { ContentItem } from '../../types';

export default function TrackingList() {
  const navigate = useNavigate();

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
      case 'Submitted':
        return 'neutral';
      default:
        return 'neutral';
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
      field: 'status',
      header: 'Current Status',
      sortable: true,
      cell: (rowData: ContentItem) => (
        <StatusBadge
          label={rowData.status}
          variant={getStatusVariant(rowData.status)}
        />
      ),
    },
    {
      field: 'submittedBy',
      header: 'Submitted By',
      sortable: true,
      cell: (rowData: ContentItem) => <span>{rowData.submittedBy || '-'}</span>,
    },
    {
      field: 'submittedDate',
      header: 'Submission Date',
      sortable: true,
      cell: (rowData: ContentItem) => (
        <span>{rowData.submittedDate || '-'}</span>
      ),
    },
    {
      field: 'startDate',
      header: 'Start Date',
      sortable: true,
    },
    {
      field: 'id',
      header: 'Track',
      width: '100px',
      cell: (rowData: ContentItem) => (
        <Button
          variant="outlined"
          label="Track"
          icon="pi pi-compass"
          onClick={() => navigate(cfsUrls.tracking.lifecycle(rowData.id))}
          size="small"
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Content Tracking"
      breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }, { label: 'Tracking' }]}
    >
      <FormCard>
        {/* Basic Mock Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter keywords..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white">
              <option>All Statuses</option>
              <option>Submitted</option>
              <option>Pending Review</option>
              <option>Approved</option>
              <option>Published</option>
              <option>On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white">
              <option>All Categories</option>
              <option>Notices</option>
              <option>Circulars</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button label="Apply Filters" variant="primary" />
            <Button label="Reset" variant="text" />
          </div>
        </div>

        <GridPanel
          data={mockContent.filter(c => c.status !== 'Draft')} // Exclude drafts from tracking
          columns={columns}
          pagination={{ rows: 10 }}
        />
      </FormCard>
    </FormPage>
  );
}
