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

export default function PolicyReview() {
  const [policies, setPolicies] = useState<Policy[]>(
    INITIAL_POLICIES.filter(
      p => p.status === 'Draft' || p.status === 'Under Review'
    )
  );
  const [showReview, setShowReview] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [comments, setComments] = useState('');

  const handleReview = (policy: Policy) => {
    setSelectedPolicy(policy);
    setComments(policy.reviewerComments || '');
    setShowReview(true);
  };

  const handleAction = (action: 'approve' | 'reject' | 'send-back') => {
    if (!selectedPolicy) return;
    setPolicies(prev =>
      prev.map(p => {
        if (p.id !== selectedPolicy.id) return p;
        const newStatus =
          action === 'approve'
            ? 'Reviewed'
            : action === 'reject'
              ? 'Rejected'
              : 'Draft';
        return {
          ...p,
          status: newStatus as Policy['status'],
          reviewerComments: comments,
        };
      })
    );
    setShowReview(false);
    setSelectedPolicy(null);
    setComments('');
  };

  return (
    <FormPage
      title="Policy Review"
      description="Review draft policies — approve, reject, or send back for changes"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Policy Review' },
      ]}
    >
      <FormCard
        title="Policies Pending Review"
        icon="eye"
        subtitle="Draft and Under Review policies"
      >
        <GridPanel
          data={policies}
          columns={[
            { field: 'id', header: 'Policy ID', width: '100px' },
            { field: 'name', header: 'Policy Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'createdBy', header: 'Created By' },
            {
              field: 'createdDate',
              header: 'Created Date',
              cell: (item: any) => {
                if (!item.createdDate) return '';
                const parts = item.createdDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.createdDate;
              },
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Draft' ? 'neutral' : 'pending'}
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '120px',
              cell: (item: any) => (
                <Button
                  label="Review"
                  icon="search"
                  onClick={() => handleReview(item)}
                  variant="outlined"
                  className="p-button-sm"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search policies for review..."
        />
      </FormCard>

      {/* ── Review Dialog ── */}
      <FormPopup
        title={`Review: ${selectedPolicy?.name || ''}`}
        visible={showReview}
        onHide={() => {
          setShowReview(false);
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Reviewer Comments
              </label>
              <InputTextarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={4}
                placeholder="Enter your review comments..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <Button
                label="Approve"
                icon="check"
                onClick={() => handleAction('approve')}
                className="bg-green-600 hover:bg-green-700"
              />
              <Button
                label="Reject"
                icon="times"
                onClick={() => handleAction('reject')}
                variant="outlined"
                className="text-red-600 border-red-300 hover:bg-red-50"
              />
              <Button
                label="Send Back for Changes"
                icon="replay"
                onClick={() => handleAction('send-back')}
                variant="outlined"
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
