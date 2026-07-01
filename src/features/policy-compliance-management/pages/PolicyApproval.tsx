import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  PreviewField,
} from 'shared/new-components';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'shared/components/buttons';
import { INITIAL_POLICIES, type Policy } from '../data';

export default function PolicyApproval() {
  const [policies, setPolicies] = useState<Policy[]>(
    INITIAL_POLICIES.filter(
      p => p.status === 'Reviewed' || p.status === 'Approved'
    )
  );
  const [showApproval, setShowApproval] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [approverComments, setApproverComments] = useState('');

  const handleApprovalView = (policy: Policy) => {
    setSelectedPolicy(policy);
    setApproverComments(policy.approverComments || '');
    setShowApproval(true);
  };

  const handleAction = (action: 'publish' | 'reject') => {
    if (!selectedPolicy) return;
    setPolicies(prev =>
      prev.map(p => {
        if (p.id !== selectedPolicy.id) return p;
        return {
          ...p,
          status: (action === 'publish'
            ? 'Published'
            : 'Draft') as Policy['status'],
          approverComments,
        };
      })
    );
    setShowApproval(false);
    setSelectedPolicy(null);
    setApproverComments('');
  };

  return (
    <FormPage
      title="Policy Approval"
      description="Registrar / Vice Chancellor / Management — approve or reject reviewed policies"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Policy Approval' },
      ]}
    >
      <FormCard
        title="Policies Awaiting Approval"
        icon="check-circle"
        subtitle="Reviewed policies pending final approval"
      >
        <GridPanel
          data={policies}
          columns={[
            { field: 'id', header: 'Policy ID', width: '100px' },
            { field: 'name', header: 'Policy Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'versionNumber', header: 'Ver.', width: '60px' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => {
                const variant =
                  item.status === 'Approved' || item.status === 'Published'
                    ? 'approved'
                    : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'reviewerComments',
              header: 'Reviewer Remarks',
              cell: (item: any) => (
                <span className="text-sm text-gray-600 truncate block max-w-48">
                  {item.reviewerComments || '—'}
                </span>
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '120px',
              cell: (item: any) => (
                <Button
                  label="Review"
                  icon="gavel"
                  onClick={() => handleApprovalView(item)}
                  variant="outlined"
                  className="p-button-sm"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search policies..."
        />
      </FormCard>

      {/* ── Approval Dialog ── */}
      <FormPopup
        title={`Approval: ${selectedPolicy?.name || ''}`}
        visible={showApproval}
        onHide={() => {
          setShowApproval(false);
          setSelectedPolicy(null);
        }}
      >
        {selectedPolicy && (
          <div className="space-y-6">
            <FormGrid columns={2}>
              <PreviewField label="Policy Code" value={selectedPolicy.code} />
              <PreviewField label="Category" value={selectedPolicy.category} />
              <PreviewField
                label="Department"
                value={selectedPolicy.department}
              />
              <PreviewField
                label="Version"
                value={selectedPolicy.versionNumber}
              />
            </FormGrid>

            <PreviewField
              label="Description"
              value={selectedPolicy.description}
              fullWidth
            />

            {selectedPolicy.reviewerComments && (
              <PreviewField
                label="Reviewer Comments"
                value={
                  <span className="text-blue-700 italic">
                    "{selectedPolicy.reviewerComments}"
                  </span>
                }
                fullWidth
              />
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Approver Comments
              </label>
              <InputTextarea
                value={approverComments}
                onChange={e => setApproverComments(e.target.value)}
                rows={3}
                placeholder="Enter approval comments..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <Button
                label="Approve & Publish"
                icon="check_circle"
                onClick={() => handleAction('publish')}
                className="bg-green-600 hover:bg-green-700"
              />
              <Button
                label="Reject → Back to Draft"
                icon="cancel"
                onClick={() => handleAction('reject')}
                variant="outlined"
                className="text-red-600 border-red-300 hover:bg-red-50"
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
