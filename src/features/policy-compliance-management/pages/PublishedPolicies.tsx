import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
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
      <FormCard title="Active Published Policies" icon="public">
        <GridPanel
          data={publishedPolicies}
          columns={[
            { field: 'id', header: 'Policy ID', width: '100px' },
            { field: 'name', header: 'Policy Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'versionNumber', header: 'Version', width: '80px' },
            { field: 'effectiveDate', header: 'Effective Date' },
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
      >
        {selectedPolicy && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Policy Code
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.code}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Category
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.category}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.department}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Version
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.versionNumber}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Effective Date
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.effectiveDate}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Expiry Date
                </span>
                <span className="text-sm font-medium">
                  {selectedPolicy.expiryDate || 'No Expiry'}
                </span>
              </div>
            </FormGrid>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Policy Description
              </span>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
                {selectedPolicy.description}
              </div>
            </div>

            {selectedPolicy.attachment && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <i className="pi pi-file-pdf text-red-500 text-lg"></i>
                <span className="text-sm font-medium text-blue-700">
                  {selectedPolicy.attachment}
                </span>
                <button className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <i className="pi pi-download mr-1"></i>Download
                </button>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Applicable To
              </span>
              <div className="flex gap-2 flex-wrap">
                {selectedPolicy.applicableTo.map(a => (
                  <span
                    key={a}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Acknowledge Button ── */}
            <div className="pt-4 border-t border-gray-200">
              {acknowledged.has(selectedPolicy.id) ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <i className="pi pi-check-circle text-lg"></i>
                  <span className="text-sm font-medium">
                    You have acknowledged this policy
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    By clicking "I Accept", you confirm that you have read and
                    understood this policy.
                  </p>
                  <Button
                    label="I Accept"
                    icon="check"
                    onClick={handleAcknowledge}
                    className="bg-green-600 hover:bg-green-700"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
