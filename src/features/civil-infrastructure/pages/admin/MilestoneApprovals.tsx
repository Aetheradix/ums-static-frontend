import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'review_milestone'; requestItem: any }
  | { mode: 'view_milestone'; requestItem: any };

export default function MilestoneApprovals() {
  const [paymentRequests, setPaymentRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestone_payment_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [milestoneRemarks, setMilestoneRemarks] = useState('');

  // Watch local storage for external updates (e.g. from site engineer)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('civil_milestone_payment_requests');
      if (saved) {
        setPaymentRequests(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleApproveMilestone = (isApproved: boolean) => {
    if (popup.mode !== 'review_milestone') return;
    const targetReq = popup.requestItem;

    // 1. Update the request status in local storage request list
    const savedRequests = localStorage.getItem(
      'civil_milestone_payment_requests'
    );
    const requests = savedRequests ? JSON.parse(savedRequests) : [];
    const updatedRequests = requests.map((r: any) =>
      r.id === targetReq.id
        ? {
            ...r,
            status: isApproved ? 'Approved by Admin' : 'Rejected by Admin',
            approvalDate: new Date().toISOString().split('T')[0],
            approvalRemarks: milestoneRemarks,
          }
        : r
    );
    localStorage.setItem(
      'civil_milestone_payment_requests',
      JSON.stringify(updatedRequests)
    );
    setPaymentRequests(updatedRequests);

    // 2. If approved, change corresponding milestone status to 'Completed' in civil_milestones!
    const savedMilestones = localStorage.getItem('civil_milestones');
    if (savedMilestones) {
      const milestonesList = JSON.parse(savedMilestones);
      const updatedMilestones = milestonesList.map((m: any) =>
        m.id === targetReq.milestoneId
          ? {
              ...m,
              status: isApproved ? 'Completed' : 'In Progress',
              actualEndDate: isApproved
                ? new Date().toISOString().split('T')[0]
                : undefined,
            }
          : m
      );
      localStorage.setItem(
        'civil_milestones',
        JSON.stringify(updatedMilestones)
      );
    }

    window.dispatchEvent(new Event('storage'));

    ToastService.success(
      isApproved
        ? 'Milestone sign-off approved and forwarded to Finance for payment processing.'
        : 'Milestone sign-off request rejected. Site engineer notified.'
    );
    setPopup({ mode: 'closed' });
    setMilestoneRemarks('');
  };

  return (
    <FormPage
      title="Milestone Sign-off Approvals"
      description="Milestone sign-off requests submitted by site engineers requiring administrative approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Milestone Sign-off Approvals' },
      ]}
    >
      <FormCard subtitle="Review and approve/reject contractor milestone completions and release payment nodes.">
        <GridPanel
          data={paymentRequests}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (r: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {civilWorks.find(w => w.id === r.workId)?.workId || r.workId}
                </span>
              ),
            },
            {
              field: 'milestoneName',
              header: 'Milestone Stage',
              cell: (r: any) => (
                <span style={{ fontWeight: 600 }}>
                  {r.milestoneName} (Milestone #{r.sequenceNo})
                </span>
              ),
            },
            {
              field: 'contractorName',
              header: 'Contractor',
              cell: (r: any) => (
                <span style={{ fontSize: '0.75rem' }}>{r.contractorName}</span>
              ),
            },
            {
              field: 'weightage',
              header: 'Weightage',
              cell: (r: any) => (
                <span style={{ fontWeight: 700 }}>{r.weightage}%</span>
              ),
            },
            {
              field: 'amountToRelease',
              header: 'Release Amount',
              cell: (r: any) => (
                <span style={{ fontWeight: 700 }}>
                  ₹{Number(r.amountToRelease).toLocaleString('en-IN')}
                </span>
              ),
            },
            { field: 'requestDate', header: 'Request Date' },
            {
              field: 'status',
              header: 'Workflow Status',
              cell: (r: any) => {
                let pillCls = 'gray';
                if (r.status === 'Pending Admin Approval') pillCls = 'amber';
                if (r.status === 'Approved by Admin') pillCls = 'blue';
                if (r.status === 'Payment Released') pillCls = 'green';
                if (r.status === 'Rejected by Admin') pillCls = 'red';
                return (
                  <span className={`civil-pill ${pillCls}`}>{r.status}</span>
                );
              },
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (r: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() =>
                      setPopup({ mode: 'view_milestone', requestItem: r })
                    }
                  />
                  {r.status === 'Pending Admin Approval' && (
                    <Button
                      size="small"
                      label="Review"
                      icon="check-square"
                      variant="primary"
                      onClick={() => {
                        setMilestoneRemarks('');
                        setPopup({ mode: 'review_milestone', requestItem: r });
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search requests..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view_milestone' || popup.mode === 'review_milestone'
            ? `${popup.mode === 'review_milestone' ? 'Review' : 'View'} Milestone Sign-off — ${(popup as any).requestItem?.milestoneName}`
            : 'Details'
        }
        subtitle="Review progress parameters and grant sign-off release to the contractor."
        size="lg"
      >
        {popup.mode !== 'closed' && (popup as any).requestItem && (
          <>
            <FormCard
              title="Milestone Sign-off & Payment Release Request"
              subtitle="Details submitted by site engineer"
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem 2rem',
                  fontSize: '0.8125rem',
                }}
              >
                {[
                  ['Work ID / Name', (popup as any).requestItem.workName],
                  [
                    'Milestone Stage',
                    `${(popup as any).requestItem.milestoneName} (Milestone #${(popup as any).requestItem.sequenceNo})`,
                  ],
                  [
                    'Contractor / Vendor',
                    (popup as any).requestItem.contractorName,
                  ],
                  [
                    'Milestone Weightage',
                    `${(popup as any).requestItem.weightage}%`,
                  ],
                  [
                    'Amount to Release',
                    `₹${(popup as any).requestItem.amountToRelease.toLocaleString('en-IN')}`,
                  ],
                  ['Request Date', (popup as any).requestItem.requestDate],
                  ['Workflow Status', (popup as any).requestItem.status],
                  ['Justification Remarks', (popup as any).requestItem.remarks],
                  [
                    'Approval Date',
                    (popup as any).requestItem.approvalDate || '—',
                  ],
                  [
                    'Approval Remarks',
                    (popup as any).requestItem.approvalRemarks || '—',
                  ],
                  [
                    'Payment NEFT/UTR Ref',
                    (popup as any).requestItem.paymentRef || '—',
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      gridColumn:
                        k === 'Justification Remarks' ||
                        k === 'Approval Remarks' ||
                        k === 'Work ID / Name'
                          ? 'span 2'
                          : 'span 1',
                    }}
                  >
                    <div
                      style={{
                        color: '#9ca3af',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        marginBottom: 2,
                      }}
                    >
                      {k}
                    </div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </FormCard>

            {popup.mode === 'review_milestone' && (
              <>
                <TextArea
                  label="Approval / Rejection Remarks *"
                  placeholder="Add administrative review, field validation check notes, or rejection reason..."
                  value={milestoneRemarks}
                  onChange={setMilestoneRemarks}
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Reject Sign-off"
                    variant="danger"
                    icon="close"
                    onClick={() => {
                      if (!milestoneRemarks.trim()) {
                        ToastService.error(
                          'Review remarks are required to reject the sign-off.'
                        );
                        return;
                      }
                      handleApproveMilestone(false);
                    }}
                  />
                  <Button
                    label="Approve Sign-off & Release Payment"
                    variant="primary"
                    icon="check"
                    onClick={() => {
                      if (!milestoneRemarks.trim()) {
                        ToastService.error('Review remarks are required.');
                        return;
                      }
                      handleApproveMilestone(true);
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
