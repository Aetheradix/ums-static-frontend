import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockContent, mockCategories } from '../../mockdata';
import type { ContentItem } from '../../types';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';

export default function PendingReviewQueue() {
  const navigate = useNavigate();
  const [items] = useState<ContentItem[]>(
    mockContent.filter(c => c.status === 'Pending Review')
  );

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredItems = items.filter(item => {
    let match = true;
    if (fromDate && new Date(item.submittedDate || '') < new Date(fromDate))
      match = false;
    if (toDate && new Date(item.submittedDate || '') > new Date(toDate))
      match = false;
    if (priorityFilter && item.priority !== priorityFilter) match = false;
    if (categoryFilter && item.publishingCategoryId !== Number(categoryFilter))
      match = false;
    return match;
  });

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

  const columns: Controls.ColumnProps<ContentItem>[] = [
    { field: 'id', header: 'ID', width: '80px' },
    { field: 'title', header: 'Title', sortable: true },
    { field: 'publishingCategoryTitle', header: 'Category', sortable: true },
    { field: 'organizationalUnitName', header: 'OU', sortable: true },
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
      cell: (item: ContentItem) => (
        <StatusBadge label={item.status} variant="pending" />
      ),
    },
    { field: 'submittedDate', header: 'Submitted Date', sortable: true },
    {
      field: 'id',
      header: 'Action',
      width: '130px',
      cell: (item: ContentItem) => (
        <Button
          variant="primary"
          label="Review Item"
          size="small"
          onClick={() => navigate(cfsUrls.reviewer.detail(item.id))}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Pending Review Queue"
      description="Review and process content requests awaiting verification."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Pending Review' },
      ]}
    >
      {/* Filters Bar */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Submitted From
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
            Submitted To
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded p-1.5 text-sm"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Priority
          </label>
          <select
            className="border border-gray-300 rounded p-1.5 text-sm w-32 bg-white"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Category
          </label>
          <select
            className="border border-gray-300 rounded p-1.5 text-sm w-40 bg-white"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {mockCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <Button
          label="Reset Filters"
          variant="text"
          onClick={() => {
            setFromDate('');
            setToDate('');
            setPriorityFilter('');
            setCategoryFilter('');
          }}
        />
      </div>

      <FormCard>
        <GridPanel
          data={filteredItems}
          loading={false}
          searchBox
          columns={columns}
          pagination={{ rows: 10 }}
        />
      </FormCard>
    </FormPage>
  );
}
