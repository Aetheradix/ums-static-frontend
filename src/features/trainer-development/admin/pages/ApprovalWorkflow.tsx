import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type ApprovalRequest, approvalRequests } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Approved: 'approved',
  Pending: 'pending',
  Rejected: 'rejected',
  Forwarded: 'neutral',
};

type PopupState =
  | { mode: 'closed' }
  | { mode: 'approve' | 'reject' | 'view'; item: ApprovalRequest };

export default function ApprovalWorkflowPage() {
  const [data] = useState(approvalRequests);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  const close = () => {
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  return (
    <FormPage
      title="Approval Workflow"
      description="Manage multi-level approvals for training programmes, budgets and certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Approvals' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            { field: 'requestNo', header: 'Req No.' },
            {
              field: 'details',
              header: 'Request Details',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.type} • Requested by: {item.requestedBy}
                  </span>
                </div>
              ),
            },
            { field: 'department', header: 'Department' },
            {
              field: 'amount',
              header: 'Amount',
              cell: item =>
                item.amount ? (
                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                    ₹{item.amount.toLocaleString()}
                  </span>
                ) : (
                  <span>-</span>
                ),
            },
            {
              field: 'hierarchy',
              header: 'Approval Stage',
              cell: item => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      flex: 1,
                      background: '#f3f4f6',
                      height: 6,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#3b82f6',
                        width: `${(item.level / item.totalLevels) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    L{item.level}/L{item.totalLevels}
                  </span>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={STATUS_VARIANTS[item.status]}
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: item => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {item.status === 'Pending' ? (
                    <>
                      <Button
                        size="small"
                        icon="check"
                        variant="primary"
                        label="Approve"
                        onClick={() => setPopup({ mode: 'approve', item })}
                      />
                      <Button
                        size="small"
                        icon="times"
                        variant="danger"
                        label=""
                        onClick={() => setPopup({ mode: 'reject', item })}
                      />
                    </>
                  ) : (
                    <Button
                      size="small"
                      icon="eye"
                      variant="outlined"
                      label="View"
                      onClick={() => setPopup({ mode: 'view', item })}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'approve'
            ? 'Approve Request'
            : popup.mode === 'reject'
              ? 'Reject Request'
              : 'Request Details'
        }
        size="default"
      >
        {popup.mode !== 'closed' && (
          <>
            <FormGrid columns={1}>
              <TextBox
                label="Request No"
                value={popup.item.requestNo}
                readOnly
              />
              <TextBox
                label="Request Title"
                value={popup.item.title}
                readOnly
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <TextBox
                  label="Request Type"
                  value={popup.item.type}
                  readOnly
                />
                <TextBox
                  label="Requested By"
                  value={popup.item.requestedBy}
                  readOnly
                />
              </div>
              {popup.item.amount && (
                <TextBox
                  label="Amount"
                  value={`₹${popup.item.amount.toLocaleString()}`}
                  readOnly
                />
              )}
              {popup.mode !== 'view' && (
                <TextBox
                  label="Remarks / Comments"
                  value={remarks}
                  onChange={v => setRemarks(v)}
                  required={popup.mode === 'reject'}
                />
              )}
            </FormGrid>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              <Button label="Cancel" variant="outlined" onClick={close} />
              {popup.mode === 'approve' && (
                <Button
                  label="Confirm Approve"
                  variant="primary"
                  icon="check"
                  onClick={close}
                />
              )}
              {popup.mode === 'reject' && (
                <Button
                  label="Confirm Reject"
                  variant="danger"
                  icon="times"
                  onClick={close}
                />
              )}
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
