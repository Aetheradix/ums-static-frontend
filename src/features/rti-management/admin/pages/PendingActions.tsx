import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import {
  type RTI,
  rtis as initialRtis,
  rtiAssignments as initialAssignments,
  rtiActivities as initialActivities,
} from '../../data';
import { rtiUrls } from '../../urls';

export default function PendingActions() {
  const [rtis, setRtis] = useState<RTI[]>(initialRtis);
  const [assignments] = useState(initialAssignments);
  const [, setActivities] = useState(initialActivities);
  const [reviewPopup, setReviewPopup] = useState<{
    rti: RTI;
    assignmentId: string;
  } | null>(null);
  const [replyPopup, setReplyPopup] = useState<{ rti: RTI } | null>(null);
  const [finalReply, setFinalReply] = useState('');

  const pendingReview = rtis.filter(r => {
    const deptReplies = assignments.filter(
      a => a.rtiId === r.id && a.status === 'Replied'
    );
    return deptReplies.length > 0 && r.status === 'Forwarded';
  });

  const readyForFinal = rtis.filter(r => {
    const allReplied = assignments
      .filter(a => a.rtiId === r.id)
      .every(a => a.status === 'Replied');
    return (
      allReplied && (r.status === 'Forwarded' || r.status === 'In Progress')
    );
  });

  const deptReplies = reviewPopup
    ? assignments.filter(
        a => a.rtiId === reviewPopup.rti.id && a.status === 'Replied'
      )
    : [];

  const handleApproveReply = (rti: RTI) => {
    setRtis(prev =>
      prev.map(r =>
        r.id === rti.id ? { ...r, status: 'In Progress' as const } : r
      )
    );
    setActivities(prev => [
      {
        id: `L${Date.now()}`,
        rtiId: rti.id,
        action: 'Department Reply Approved',
        performedBy: 'CPIO Office',
        role: 'CPIO',
        timestamp: new Date().toISOString().split('T')[0],
        details: 'Department reply reviewed and approved.',
      },
      ...prev,
    ]);
    setReviewPopup(null);
    ToastService.success('Department reply approved.');
  };

  const handleSendFinalReply = () => {
    if (!replyPopup || !finalReply.trim()) {
      ToastService.error('Please enter the final reply.');
      return;
    }
    setRtis(prev =>
      prev.map(r =>
        r.id === replyPopup.rti.id
          ? {
              ...r,
              status: 'Closed' as const,
              finalReply: finalReply.trim(),
              closedOn: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
    setActivities(prev => [
      {
        id: `L${Date.now()}`,
        rtiId: replyPopup.rti.id,
        action: 'Final Reply Issued',
        performedBy: 'CPIO Office',
        role: 'CPIO',
        timestamp: new Date().toISOString().split('T')[0],
        details: 'Final reply sent to applicant.',
      },
      ...prev,
    ]);
    setReplyPopup(null);
    setFinalReply('');
    ToastService.success('Final reply sent and RTI closed.');
  };

  const handleSaveDraft = () => {
    ToastService.success('Draft saved.');
  };

  const reviewColumns = [
    { field: 'rtiNumber' as keyof RTI, header: 'RTI #' },
    { field: 'applicantName' as keyof RTI, header: 'Applicant' },
    {
      header: 'Subject',
      cell: (item: RTI) => (
        <span className="text-sm">
          {item.subject.length > 40
            ? `${item.subject.slice(0, 40)}...`
            : item.subject}
        </span>
      ),
    },
    {
      header: 'Department Replies',
      cell: (item: RTI) => {
        const replies = assignments.filter(
          a => a.rtiId === item.id && a.status === 'Replied'
        );
        return (
          <span className="text-sm font-medium">
            {replies.length} reply(ies)
          </span>
        );
      },
    },
    {
      header: 'Action',
      cell: (item: RTI) => (
        <Button
          icon="rate_review"
          label="Review"
          variant="outlined"
          size="small"
          onClick={() => setReviewPopup({ rti: item, assignmentId: item.id })}
        />
      ),
    },
  ];

  const replyColumns = [
    { field: 'rtiNumber' as keyof RTI, header: 'RTI #' },
    { field: 'applicantName' as keyof RTI, header: 'Applicant' },
    {
      header: 'Subject',
      cell: (item: RTI) => (
        <span className="text-sm">
          {item.subject.length > 40
            ? `${item.subject.slice(0, 40)}...`
            : item.subject}
        </span>
      ),
    },
    {
      header: 'Assigned To',
      cell: (item: RTI) => {
        const depts = assignments
          .filter(a => a.rtiId === item.id && a.status === 'Replied')
          .map(a => a.department);
        return <span className="text-sm">{depts.join(', ')}</span>;
      },
    },
    {
      header: 'Action',
      cell: (item: RTI) => (
        <Button
          icon="send"
          label="Reply"
          variant="primary"
          size="small"
          onClick={() => {
            setReplyPopup({ rti: item });
            setFinalReply(item.finalReply || '');
          }}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Pending Actions"
      description="Review department replies and issue final responses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Pending Actions' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={[
            {
              title: `Pending Review (${pendingReview.length})`,
              content: (
                <GridPanel
                  data={pendingReview}
                  searchBox
                  searchPlaceholder="Search RTIs to review..."
                  columns={reviewColumns}
                />
              ),
            },
            {
              title: `Final Reply (${readyForFinal.length})`,
              content: (
                <GridPanel
                  data={readyForFinal}
                  searchBox
                  searchPlaceholder="Search RTIs for final reply..."
                  columns={replyColumns}
                />
              ),
            },
          ]}
        />
      </FormCard>

      {reviewPopup && (
        <FormPopup
          visible
          onHide={() => setReviewPopup(null)}
          title={`Review Replies: ${reviewPopup.rti.rtiNumber}`}
          subtitle="Review department responses before proceeding."
          size="lg"
        >
          <div className="flex flex-col gap-4">
            {deptReplies.map(a => (
              <div
                key={a.id}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      {a.department}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({a.officer})
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Replied: {a.repliedOn}
                  </span>
                </div>
                <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-100">
                  {a.reply}
                </p>
                {a.replyAttachments.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {a.replyAttachments.map(f => (
                      <span
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setReviewPopup(null)}
            />
            <Button
              label="Approve Replies"
              variant="primary"
              onClick={() => handleApproveReply(reviewPopup.rti)}
            />
          </div>
        </FormPopup>
      )}

      {replyPopup && (
        <FormPopup
          visible
          onHide={() => {
            setReplyPopup(null);
            setFinalReply('');
          }}
          title={`Final Reply: ${replyPopup.rti.rtiNumber}`}
          subtitle="Draft and send the final response to the applicant."
          size="lg"
        >
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-2">
              Applicant:{' '}
              <span className="font-medium text-gray-700">
                {replyPopup.rti.applicantName}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Subject:{' '}
              <span className="font-medium text-gray-700">
                {replyPopup.rti.subject}
              </span>
            </div>
          </div>
          <TextArea
            label="Final Reply"
            placeholder="Type the final response to the applicant..."
            value={finalReply}
            onChange={v => setFinalReply(v)}
            rows={6}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => {
                setReplyPopup(null);
                setFinalReply('');
              }}
            />
            <Button
              label="Save Draft"
              variant="outlined"
              onClick={handleSaveDraft}
            />
            <Button
              label="Send Reply & Close"
              variant="primary"
              onClick={handleSendFinalReply}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
