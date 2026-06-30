import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel, Tabs } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';
import type { ContentItem } from '../../types';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { ToastService } from 'services';

export default function MyContentList() {
  const navigate = useNavigate();
  const [contentList, setContentList] = useState<ContentItem[]>(mockContent);
  const [activeTab, setActiveTab] = useState('All');

  // Date Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getBadgeVariant = (status: string) => {
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

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      setContentList(contentList.filter(c => c.id !== id));
      ToastService.success('Draft deleted successfully.');
    }
  };

  const handleSubmit = (id: number) => {
    if (window.confirm('Submit this draft for review?')) {
      setContentList(
        contentList.map(c => (c.id === id ? { ...c, status: 'Submitted' } : c))
      );
      ToastService.success('Content submitted successfully.');
    }
  };

  // Compute tabs with counts
  const statuses = [
    'All',
    'Draft',
    'Submitted',
    'Pending Review',
    'Approved',
    'Rejected',
    'On Hold',
    'Published',
    'Expired',
  ];

  const tabs = statuses.map(status => {
    const count =
      status === 'All'
        ? contentList.length
        : contentList.filter(c => c.status === status).length;

    return {
      title: (
        <div className="flex items-center gap-2">
          <span>{status}</span>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      ),
      content: <></>,
    };
  });

  const filteredContent = contentList.filter(item => {
    let match = true;
    if (activeTab !== 'All' && item.status !== activeTab) {
      match = false;
    }
    if (fromDate && new Date(item.startDate) < new Date(fromDate))
      match = false;
    if (toDate && new Date(item.startDate) > new Date(toDate)) match = false;
    return match;
  });

  const columns: Controls.ColumnProps<ContentItem>[] = [
    { field: 'id', header: '#', width: '60px' },
    { field: 'title', header: 'Title', sortable: true },
    { field: 'publishingCategoryTitle', header: 'Category', sortable: true },
    { field: 'subCategoryTitle', header: 'Sub-Category', sortable: true },
    {
      field: 'priority',
      header: 'Priority',
      sortable: true,
      cell: (item: ContentItem) => (
        <StatusBadge
          label={item.priority}
          variant={getPriorityVariant(item.priority)}
        />
      ),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      cell: (item: ContentItem) => (
        <StatusBadge
          label={item.status}
          variant={getBadgeVariant(item.status)}
        />
      ),
    },
    { field: 'startDate', header: 'Start Date', sortable: true },
    { field: 'endDate', header: 'End Date', sortable: true },
    {
      field: 'id',
      header: 'Actions',
      width: '180px',
      cell: (item: ContentItem) => (
        <div className="flex items-center gap-2">
          {item.status === 'Draft' ? (
            <>
              <Button
                variant="text"
                icon="pi pi-pencil"
                tooltip="Edit Draft"
                onClick={() => navigate(cfsUrls.ouAdmin.editContent(item.id))}
              />
              <Button
                variant="text"
                icon="pi pi-send"
                tooltip="Submit"
                onClick={() => handleSubmit(item.id)}
              />
              <Button
                variant="text"
                icon="pi pi-trash"
                tooltip="Delete"
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              />
            </>
          ) : item.status === 'Returned' ? (
            <>
              <Button
                variant="text"
                icon="pi pi-pencil"
                tooltip="Edit & Resubmit"
                onClick={() => navigate(cfsUrls.ouAdmin.editContent(item.id))}
              />
              <Button
                variant="text"
                icon="pi pi-eye"
                tooltip="View Detail"
                onClick={() => navigate(cfsUrls.content.view(item.id))}
              />
            </>
          ) : (
            <>
              <Button
                variant="text"
                icon="pi pi-eye"
                tooltip="View Detail"
                onClick={() => navigate(cfsUrls.content.view(item.id))}
              />
              <Button
                variant="text"
                icon="pi pi-history"
                tooltip="Track Lifecycle"
                onClick={() => navigate(cfsUrls.tracking.lifecycle(item.id))}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="My Content Submissions"
      description="View and track all content submissions initiated by your department/OU."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'My Content' },
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
      {/* Date Filter Bar */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Start Date From
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded p-1.5 text-sm"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Start Date To
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded p-1.5 text-sm"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <Button
          label="Reset Dates"
          variant="text"
          onClick={() => {
            setFromDate('');
            setToDate('');
          }}
        />
      </div>

      <FormCard>
        <div className="border-b border-gray-200 mb-4 px-2">
          <Tabs
            tabs={tabs}
            activeIndex={statuses.indexOf(activeTab)}
            onTabChange={e => setActiveTab(statuses[e.index])}
          />
        </div>

        <GridPanel
          data={filteredContent}
          columns={columns}
          pagination={{ rows: 10 }}
          searchPlaceholder="Search content..."
        />
      </FormCard>
    </FormPage>
  );
}
