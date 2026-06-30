import { useState } from 'react';

import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockReviewHistory, mockContent } from '../../mockdata';
import type { ReviewAction } from '../../types';

export default function ReviewHistory() {
  const [selectedReview, setSelectedReview] = useState<ReviewAction | null>(
    null
  );

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'Approve':
        return 'approved';
      case 'Recommend Approve':
        return 'approved';
      case 'Reject':
        return 'rejected';
      case 'Hold':
        return 'neutral';
      case 'Return':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const columns: Controls.ColumnProps<ReviewAction>[] = [
    { field: 'id', header: 'ID', width: '80px' },
    {
      field: 'contentId',
      header: 'Content',
      sortable: true,
      cell: (item: ReviewAction) => {
        const c = mockContent.find(c => c.id === item.contentId);
        return <span>{c ? c.title : `Content #${item.contentId}`}</span>;
      },
    },
    {
      field: 'action',
      header: 'Action Taken',
      sortable: true,
      cell: (item: ReviewAction) => (
        <StatusBadge
          label={item.action}
          variant={getActionBadgeVariant(item.action)}
        />
      ),
    },
    { field: 'performedBy', header: 'Reviewer', sortable: true },
    { field: 'performedRole', header: 'Role', sortable: true },
    { field: 'timestamp', header: 'Date & Time', sortable: true },
    {
      field: 'id',
      header: 'Details',
      width: '100px',
      cell: (item: ReviewAction) => (
        <Button
          variant="outlined"
          label="View"
          onClick={() => setSelectedReview(item)}
          size="small"
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Review History"
      description="View the history of content reviews and decisions made by reviewers."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Review History' },
      ]}
    >
      <FormCard>
        <div className="mb-4 flex flex-wrap gap-4 p-3 bg-white border border-gray-200 rounded-lg">
          {/* Filters */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Action
            </label>
            <select className="border border-gray-300 rounded p-1.5 text-sm bg-white">
              <option>All Actions</option>
              <option>Approve</option>
              <option>Reject</option>
              <option>Return</option>
              <option>Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reviewer
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded p-1.5 text-sm"
              placeholder="Search name..."
            />
          </div>
        </div>

        <GridPanel
          data={mockReviewHistory}
          columns={columns}
          pagination={{ rows: 10 }}
        />
      </FormCard>

      <FormPopup
        visible={!!selectedReview}
        onHide={() => setSelectedReview(null)}
        title="Review Decision Details"
      >
        {selectedReview && (
          <div className="flex flex-col gap-3 p-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold block text-gray-500">
                Content Reference
              </span>
              <span>
                {mockContent.find(c => c.id === selectedReview.contentId)
                  ?.title || `ID: ${selectedReview.contentId}`}
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Action Taken
              </span>
              <StatusBadge
                label={selectedReview.action}
                variant={getActionBadgeVariant(selectedReview.action)}
                className="mt-1"
              />
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Reviewer
              </span>
              <span>
                {selectedReview.performedBy} ({selectedReview.performedRole})
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Date & Time
              </span>
              <span>{selectedReview.timestamp}</span>
            </div>
            {selectedReview.remarks && (
              <div>
                <span className="font-semibold block text-gray-500">
                  Remarks / Notes
                </span>
                <p className="bg-gray-50 p-3 rounded border border-gray-150 mt-1 shadow-inner">
                  {selectedReview.remarks}
                </p>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
