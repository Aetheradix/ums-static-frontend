import { useParams, useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';
import { ToastService } from 'services';

export default function ViewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const content = mockContent.find(c => c.id === Number(id));

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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      ToastService.success('Draft deleted successfully');
      navigate(cfsUrls.ouAdmin.myContent);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Submit this draft for review?')) {
      ToastService.success('Content submitted successfully');
      navigate(cfsUrls.ouAdmin.myContent);
    }
  };

  const handleAction = (action: string) => {
    ToastService.success(`Action '${action}' recorded`);
  };

  return (
    <FormPage
      title={`View: ${content.title}`}
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Content', to: cfsUrls.ouAdmin.myContent },
        { label: 'View Content' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - 70% */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FormCard>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>

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

              <div
                className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-150"
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

          {/* Action Buttons based on status */}
          <div className="flex flex-wrap gap-3 justify-end">
            {content.status === 'Draft' && (
              <>
                <Button
                  label="Delete Draft"
                  variant="danger"
                  onClick={handleDelete}
                />
                <Button
                  label="Edit Content"
                  variant="outlined"
                  onClick={() =>
                    navigate(cfsUrls.ouAdmin.editContent(content.id))
                  }
                />
                <Button
                  label="Submit for Review"
                  variant="primary"
                  onClick={handleSubmit}
                />
              </>
            )}
            {content.status === 'Returned' && (
              <>
                <Button
                  label="Edit Content"
                  variant="outlined"
                  onClick={() =>
                    navigate(cfsUrls.ouAdmin.editContent(content.id))
                  }
                />
                <Button
                  label="Resubmit for Review"
                  variant="primary"
                  onClick={handleSubmit}
                />
              </>
            )}
            {content.status === 'Pending Review' && (
              <>
                <Button
                  label="Return for Correction"
                  variant="outlined"
                  onClick={() => handleAction('Return')}
                />
                <Button
                  label="Place on Hold"
                  variant="outlined"
                  onClick={() => handleAction('Hold')}
                />
                <Button
                  label="Reject"
                  variant="danger"
                  onClick={() => handleAction('Reject')}
                />
                <Button
                  label="Approve"
                  variant="success"
                  onClick={() => handleAction('Approve')}
                />
              </>
            )}
            {content.status === 'Approved' && (
              <>
                <Button
                  label="Reject"
                  variant="danger"
                  onClick={() => handleAction('Reject')}
                />
                <Button
                  label="Publish Content"
                  variant="success"
                  onClick={() => handleAction('Publish')}
                />
              </>
            )}
            {content.status === 'Published' && (
              <>
                <Button
                  label="Track Lifecycle"
                  variant="outlined"
                  onClick={() =>
                    navigate(cfsUrls.tracking.lifecycle(content.id))
                  }
                />
                <Button
                  label="Unpublish"
                  variant="danger"
                  onClick={() => handleAction('Unpublish')}
                />
              </>
            )}
            {(content.status === 'Submitted' ||
              content.status === 'Rejected' ||
              content.status === 'Expired') && (
              <Button
                label="Track Lifecycle"
                variant="outlined"
                onClick={() => navigate(cfsUrls.tracking.lifecycle(content.id))}
              />
            )}
          </div>
        </div>

        {/* Right Panel - 30% */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <FormCard title="Metadata">
            <div className="p-4 flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-1 border-b pb-2">
                <span className="text-gray-500 font-medium">Org Unit</span>
                <span className="text-gray-900 text-right">
                  {content.organizationalUnitName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-2">
                <span className="text-gray-500 font-medium">Content Type</span>
                <span className="text-gray-900 text-right">
                  {content.contentType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-2">
                <span className="text-gray-500 font-medium">Visibility</span>
                <span className="text-gray-900 text-right">
                  {content.visibility}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-2">
                <span className="text-gray-500 font-medium">Start Date</span>
                <span className="text-gray-900 text-right">
                  {content.startDate}
                </span>
              </div>
              {content.endDate && (
                <div className="grid grid-cols-2 gap-1 border-b pb-2">
                  <span className="text-gray-500 font-medium">End Date</span>
                  <span className="text-gray-900 text-right">
                    {content.endDate}
                  </span>
                </div>
              )}
              {content.tags && content.tags.length > 0 && (
                <div className="pt-2">
                  <span className="text-gray-500 font-medium block mb-2">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {content.tags.map(t => (
                      <span
                        key={t}
                        className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormCard>

          <FormCard title="Audit Information">
            <div className="p-4 flex flex-col gap-3 text-sm">
              <div>
                <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider">
                  Created
                </span>
                <span className="text-gray-900 font-medium">
                  {content.createdBy}
                </span>
                <span className="text-gray-500 block text-xs">
                  {content.createdDate}
                </span>
              </div>
              {content.submittedBy && (
                <div>
                  <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider">
                    Submitted
                  </span>
                  <span className="text-gray-900 font-medium">
                    {content.submittedBy}
                  </span>
                  <span className="text-gray-500 block text-xs">
                    {content.submittedDate}
                  </span>
                </div>
              )}
            </div>
          </FormCard>

          {/* Simple Timeline for status */}
          <FormCard title="Status Flow">
            <div className="p-4">
              <div className="relative border-l-2 border-gray-200 ml-3 flex flex-col gap-4">
                <div className="relative pl-6">
                  <span className="absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <span className="text-sm font-medium text-gray-900 block leading-tight">
                    Draft
                  </span>
                  <span className="text-xs text-gray-500">
                    {content.createdDate}
                  </span>
                </div>
                {content.status !== 'Draft' && (
                  <div className="relative pl-6">
                    <span className="absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <span className="text-sm font-medium text-gray-900 block leading-tight">
                      Submitted
                    </span>
                    <span className="text-xs text-gray-500">
                      {content.submittedDate}
                    </span>
                  </div>
                )}
                {(content.status === 'Approved' ||
                  content.status === 'Published') && (
                  <div className="relative pl-6">
                    <span className="absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <span className="text-sm font-medium text-gray-900 block leading-tight">
                      Approved
                    </span>
                  </div>
                )}
                {content.status === 'Published' && (
                  <div className="relative pl-6">
                    <span className="absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full bg-green-500 ring-4 ring-white" />
                    <span className="text-sm font-medium text-gray-900 block leading-tight">
                      Published
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
