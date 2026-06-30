import { useParams, useNavigate } from 'react-router-dom';
import { FormPage, FormCard, Stepper } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockContent } from '../../mockdata';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';

export default function ContentLifecycle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = mockContent.find(c => c.id === Number(id));

  if (!item) {
    return (
      <FormPage
        title="Content Not Found"
        breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }]}
      >
        <div className="p-8 text-center text-gray-500">
          Content with ID {id} does not exist.
        </div>
        <Button
          label="Go Back"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
      </FormPage>
    );
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Draft':
        return 0;
      case 'Submitted':
        return 1;
      case 'Pending Review':
        return 2;
      case 'Approved':
        return 3;
      case 'Published':
        return 4;
      default:
        return 2;
    }
  };

  const steps = [
    { label: 'Draft', description: 'Created by department' },
    { label: 'Submitted', description: 'Locked for review' },
    { label: 'Under Review', description: 'Assigned to reviewer' },
    { label: 'Approved', description: 'Ready to publish' },
    { label: 'Published', description: 'Live on system' },
  ];

  // Generate dynamic dummy history based on the current step index
  const currentIndex = getStepIndex(item.status);

  const generateHistory = () => {
    const history = [];
    if (currentIndex >= 4 || item.status === 'Published') {
      history.push({
        title: 'Published',
        date: '2026-06-30 10:32 AM',
        user: 'System Admin',
        remarks: 'Content finalized and active on the portal.',
        color: 'bg-green-500',
      });
    }
    if (currentIndex >= 3 || item.status === 'Approved') {
      history.push({
        title: 'Approved',
        date: '2026-06-29 03:45 PM',
        user: 'Review Committee',
        remarks: 'Content verified and approved for publishing.',
        color: 'bg-blue-500',
      });
    }
    if (item.status === 'Rejected') {
      history.push({
        title: 'Rejected',
        date: '2026-06-28 01:15 PM',
        user: 'Review Committee',
        remarks: 'Does not meet the publishing guidelines.',
        color: 'bg-red-500',
      });
    }
    if (item.status === 'On Hold') {
      history.push({
        title: 'Placed on Hold',
        date: '2026-06-28 11:15 AM',
        user: 'Review Committee',
        remarks: 'Awaiting further clarification.',
        color: 'bg-purple-500',
      });
    }
    if (currentIndex >= 2) {
      history.push({
        title: 'Assigned for Review',
        date: '2026-06-27 09:00 AM',
        user: 'System',
        remarks: 'Routed to the appropriate review group.',
        color: 'bg-yellow-500',
      });
    }
    if (currentIndex >= 1) {
      history.push({
        title: 'Submitted',
        date: '2026-06-26 10:15 AM',
        user: item.submittedBy || item.createdBy,
        remarks: '',
        color: 'bg-indigo-500',
      });
    }

    // Everyone starts as Draft
    history.push({
      title: 'Draft Created',
      date: '2026-06-25 09:15 AM',
      user: item.createdBy,
      remarks: 'Initial content structure created.',
      color: 'bg-gray-400',
    });

    return history;
  };

  const statusHistory = generateHistory();

  return (
    <FormPage
      title="Content Lifecycle Tracking"
      description="Track structural status transitions and editorial timeline."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Tracking', to: cfsUrls.tracking.list },
        { label: 'Lifecycle' },
      ]}
      headerAction={
        <Button
          label="Back to List"
          icon="pi pi-arrow-left"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
      }
    >
      <FormCard title={`Tracker: ${item.title}`}>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Current Status
              </span>
              <div className="mt-1">
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Published' || item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Rejected'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Initiated By
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.createdBy}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Organizational Unit
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.organizationalUnitName}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Start Date
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.startDate}
              </span>
            </div>
          </div>

          <div className="py-8">
            <Stepper steps={steps} activeStep={getStepIndex(item.status)} />
          </div>

          <div className="mt-6">
            <h4 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">
              Status Log History
            </h4>
            <div className="relative border-l-2 border-gray-200 ml-4 pl-6 flex flex-col gap-6">
              {statusHistory.map((log, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-9 top-0.5 ${log.color} w-6 h-6 rounded-full border-4 border-white flex items-center justify-center`}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">
                        {log.title}
                      </span>
                      <span className="text-xs text-gray-500">{log.date}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Action performed by {log.user}
                    </span>
                    {log.remarks && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-150 mt-1">
                        "{log.remarks}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
