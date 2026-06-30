import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockContent, mockActivityLogs } from '../../mockdata';
import { ToastService } from 'services';

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const content = mockContent.find(c => c.id === Number(id));

  const [remarks, setRemarks] = useState('');

  if (!content) {
    return (
      <FormPage
        title="Content Not Found"
        breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }]}
      >
        <div className="p-8 text-center text-gray-500">
          The requested content could not be found.
        </div>
      </FormPage>
    );
  }

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

  const handleAction = (action: string) => {
    if (
      (action === 'Reject' || action === 'Hold' || action === 'Return') &&
      remarks.trim().length < 20
    ) {
      ToastService.error(
        `Remarks are required (min 20 chars) when selecting ${action}.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} this content?`)) {
      ToastService.success(`Content has been marked as ${action}.`);
      navigate(cfsUrls.reviewer.pending);
    }
  };

  // Filter logs for this item
  const itemLogs = mockActivityLogs.filter(
    log => log.affectedItem === content.title
  );

  return (
    <FormPage
      title="Content Review"
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Pending Review', to: cfsUrls.reviewer.pending },
        { label: 'Review Detail' },
      ]}
    >
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <Button
          variant="text"
          icon="pi pi-chevron-left"
          label="Previous Item"
        />
        <span className="text-gray-500 font-medium text-sm">
          Reviewing 1 of 5 items
        </span>
        <Button variant="text" icon="pi pi-chevron-right" label="Next Item" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Content Details (65%) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FormCard>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {content.publishingCategoryTitle}
                </span>
                {content.subCategoryTitle && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {content.subCategoryTitle}
                  </span>
                )}
                <StatusBadge
                  label={content.status}
                  variant={getStatusVariant(content.status)}
                />
                <StatusBadge
                  label={`${content.priority} Priority`}
                  variant={getPriorityVariant(content.priority)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-150 text-sm">
                <div>
                  <span className="text-gray-500 font-medium block">
                    Organizational Unit
                  </span>
                  <span className="text-gray-900">
                    {content.organizationalUnitName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">
                    Submitted By
                  </span>
                  <span className="text-gray-900">{content.submittedBy}</span>
                  <span className="text-gray-500 ml-2 text-xs">
                    on {content.submittedDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">
                    Start Date
                  </span>
                  <span className="text-gray-900">{content.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">
                    Visibility
                  </span>
                  <span className="text-gray-900">{content.visibility}</span>
                </div>
              </div>

              <div
                className="prose max-w-none text-gray-700 bg-white p-4 rounded-lg border border-gray-200"
                dangerouslySetInnerHTML={{ __html: content.description }}
              />

              {content.attachments && content.attachments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    Attachments
                  </h3>
                  <div className="flex flex-col gap-2">
                    {content.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3">
                          <i className="pi pi-file text-blue-500 text-xl" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.size} • {file.type}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormCard>
        </div>

        {/* Right Panel - Action Panel (35%) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <FormCard title="Take Action">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Button
                  label="Approve & Publish"
                  variant="success"
                  icon="pi pi-check-circle"
                  onClick={() => handleAction('Approve & Publish')}
                  className="w-full justify-center"
                />
                <Button
                  label="Recommend Approval"
                  variant="outlined"
                  icon="pi pi-thumbs-up"
                  onClick={() => handleAction('Recommend Approve')}
                  className="w-full justify-center"
                />

                <div className="border-t border-gray-200 my-1"></div>

                <Button
                  label="Reject Content"
                  variant="danger"
                  icon="pi pi-times-circle"
                  onClick={() => handleAction('Reject')}
                  className="w-full justify-center"
                />
                <Button
                  label="Return for Correction"
                  variant="warning"
                  icon="pi pi-refresh"
                  onClick={() => handleAction('Return')}
                  className="w-full justify-center"
                />
                <Button
                  label="Place on Hold"
                  variant="outlined"
                  icon="pi pi-pause"
                  onClick={() => handleAction('Hold')}
                  className="w-full justify-center"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks / Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter reasoning for rejection, hold, or correction notes..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  Required when Rejecting, Holding, or Returning. Minimum 20
                  characters.
                </span>
              </div>
            </div>
          </FormCard>

          {/* Submission History Timeline */}
          {itemLogs.length > 0 && (
            <FormCard title="Review History">
              <div className="p-4">
                <div className="relative border-l-2 border-gray-200 ml-3 flex flex-col gap-6">
                  {itemLogs.map((log, index) => (
                    <div key={index} className="relative pl-6">
                      <span className="absolute -left-2 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {log.action}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {log.user} ({log.role})
                        </span>
                        <span className="text-xs text-gray-500">
                          {log.timestamp}
                        </span>
                        {log.remarks && (
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                            "{log.remarks}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FormCard>
          )}
        </div>
      </div>
    </FormPage>
  );
}
