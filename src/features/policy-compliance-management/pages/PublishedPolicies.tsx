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
import { Button } from 'shared/components/buttons';
import { INITIAL_POLICIES, type Policy } from '../data';

export default function PublishedPolicies() {
  const publishedPolicies = INITIAL_POLICIES.filter(
    p => p.status === 'Published'
  );
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const handleView = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowDetail(true);
  };

  const handleAcknowledge = () => {
    if (!selectedPolicy) return;
    setAcknowledged(prev => new Set([...prev, selectedPolicy.id]));
    setShowDetail(false);
  };

  return (
    <FormPage
      title="Published Policies"
      description="Read and acknowledge published university policies"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Published Policies' },
      ]}
    >
      <FormCard title="Active Published Policies" icon="book">
        <GridPanel
          data={publishedPolicies}
          columns={[
            { field: 'id', header: 'Policy ID', width: '100px' },
            { field: 'name', header: 'Policy Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'versionNumber', header: 'Version', width: '80px' },
            {
              field: 'effectiveDate',
              header: 'Effective Date',
              cell: (item: any) => {
                if (!item.effectiveDate) return '';
                const parts = item.effectiveDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.effectiveDate;
              },
            },
            {
              field: 'applicableTo',
              header: 'Applicable To',
              cell: (item: any) => (
                <div className="flex gap-1 flex-wrap">
                  {item.applicableTo.map((a: string) => (
                    <span
                      key={a}
                      className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              field: 'ack',
              header: 'Acknowledged',
              width: '120px',
              cell: (item: any) =>
                acknowledged.has(item.id) ? (
                  <StatusBadge label="Accepted" variant="approved" />
                ) : (
                  <StatusBadge label="Pending" variant="pending" />
                ),
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '140px',
              cell: (item: any) => (
                <Button
                  label="Read Policy"
                  icon="visibility"
                  onClick={() => handleView(item)}
                  variant="outlined"
                  className="p-button-sm"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search published policies..."
        />
      </FormCard>

      {/* ── Policy Detail + Acknowledge ── */}
      <FormPopup
        title={selectedPolicy?.name || 'Policy Details'}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedPolicy(null);
        }}
        footer={
          acknowledged.has(selectedPolicy?.id || '') ? (
            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-xl border border-green-200 w-full justify-between">
              <div className="flex items-center gap-3">
                <i className="pi pi-check-circle text-xl"></i>
                <div>
                  <h4 className="font-semibold text-green-900 m-0">
                    Policy Accepted
                  </h4>
                  <p className="text-sm text-green-700 m-0">
                    You have acknowledged this policy.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-4">
              <p className="text-sm text-slate-600 m-0">
                By clicking "I Accept", you confirm that you have read and
                understood this policy.
              </p>
              <Button
                label="I Accept"
                icon="check"
                onClick={handleAcknowledge}
                variant="outlined"
              />
            </div>
          )
        }
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
              <PreviewField
                label="Effective Date"
                value={selectedPolicy.effectiveDate}
              />
              <PreviewField
                label="Expiry Date"
                value={selectedPolicy.expiryDate || 'No Expiry'}
              />
            </FormGrid>

            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Policy Description
              </span>
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm leading-relaxed shadow-sm">
                {selectedPolicy.description}
              </div>
            </div>

            {selectedPolicy.attachment && (
              <div className="flex items-center justify-between px-4 py-3 border border-blue-100 rounded-xl bg-blue-50/50 mt-4">
                <div className="flex items-center gap-3">
                  <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                  <span className="text-sm font-medium text-blue-600">
                    {selectedPolicy.attachment}
                  </span>
                </div>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  <i className="pi pi-download"></i>
                  Download
                </button>
              </div>
            )}

            <PreviewField
              label="Applicable To"
              value={
                <div className="flex gap-2 flex-wrap mt-1">
                  {selectedPolicy.applicableTo.map(a => (
                    <span
                      key={a}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              }
              fullWidth
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
