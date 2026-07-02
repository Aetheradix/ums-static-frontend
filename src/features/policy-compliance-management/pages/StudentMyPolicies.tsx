import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  FormGrid,
  GridPanel,
  StatusBadge,
  PreviewField,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_POLICIES,
  INITIAL_ACKNOWLEDGEMENTS,
  type Policy,
  type Acknowledgement,
} from '../data';

export default function StudentMyPolicies() {
  const studentInfo = {
    id: 'STU2024CS0120',
    name: 'Aditya Pratap Singh',
    department: 'Computer Science',
    ipAddress: '192.168.1.105',
  };

  const [policies] = useState<Policy[]>(
    INITIAL_POLICIES.filter(
      p => p.status === 'Published' && p.applicableTo.includes('Students')
    )
  );

  const [acknowledgements, setAcknowledgements] = useState<Acknowledgement[]>(
    INITIAL_ACKNOWLEDGEMENTS.filter(a => a.userId === studentInfo.id)
  );

  const [showPolicyDetail, setShowPolicyDetail] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [acceptChecked, setAcceptChecked] = useState(false);

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setAcceptChecked(false);
    setShowPolicyDetail(true);
  };

  const handleAcceptPolicy = () => {
    if (!selectedPolicy) return;
    const newAck: Acknowledgement = {
      id: `ACK-NEW-${Date.now()}`,
      policyId: selectedPolicy.id,
      policyName: selectedPolicy.name,
      userId: studentInfo.id,
      userName: studentInfo.name,
      userType: 'Student',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      ipAddress: studentInfo.ipAddress,
      versionAccepted: selectedPolicy.versionNumber,
    };
    setAcknowledgements(prev => [newAck, ...prev]);
    setShowPolicyDetail(false);
    setSelectedPolicy(null);
  };

  const isPolicyAccepted = (policyId: string) => {
    return acknowledgements.some(a => a.policyId === policyId);
  };

  return (
    <FormPage
      title="My Policies"
      description="View applicable policies and complete acknowledgements"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/my-policies',
        },
        { label: 'My Policies' },
      ]}
    >
      <FormCard title="Applicable Policies" icon="file">
        <GridPanel
          data={policies}
          columns={[
            { field: 'code', header: 'Policy Code', width: '120px' },
            { field: 'name', header: 'Policy Name', width: '35%' },
            {
              field: 'effectiveDate',
              header: 'Effective Date',
              width: '130px',
            },
            { field: 'versionNumber', header: 'Version', width: '90px' },
            {
              field: 'status',
              header: 'Acknowledgement',
              width: '160px',
              cell: (item: any) => {
                const accepted = isPolicyAccepted(item.id);
                return accepted ? (
                  <StatusBadge label="Accepted" variant="approved" />
                ) : (
                  <StatusBadge label="Pending" variant="pending" />
                );
              },
            },
            {
              field: 'actions',
              header: 'Action',
              width: '130px',
              cell: (item: any) => (
                <Button
                  label="View & Read"
                  variant="outlined"
                  className="p-button-sm"
                  onClick={() => handleViewPolicy(item)}
                />
              ),
            },
          ]}
          searchBox={false}
        />
      </FormCard>

      {/* ── Policy View & Accept Modal ── */}
      <FormPopup
        title={`Policy: ${selectedPolicy?.name || ''}`}
        visible={showPolicyDetail}
        onHide={() => {
          setShowPolicyDetail(false);
          setSelectedPolicy(null);
        }}
        size="lg"
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
                value={selectedPolicy.expiryDate || 'N/A'}
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

            <div className="flex items-center justify-between px-4 py-3 border border-blue-100 rounded-xl bg-blue-50/50 mt-4">
              <div className="flex items-center gap-3">
                <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                <span className="text-sm font-medium text-blue-600">
                  {selectedPolicy.code.toLowerCase()}_policy_v
                  {selectedPolicy.versionNumber}.pdf
                </span>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                <i className="pi pi-download"></i>
                Download
              </button>
            </div>

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

            {!isPolicyAccepted(selectedPolicy.id) ? (
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-4">
                <p className="text-sm text-slate-600">
                  By clicking "I Accept", you confirm that you have read and
                  understood this policy.
                </p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded"
                    checked={acceptChecked}
                    onChange={e => setAcceptChecked(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I acknowledge and agree to comply.
                  </span>
                </label>
                <div className="mt-2">
                  <Button
                    label="I Accept"
                    icon="check"
                    disabled={!acceptChecked}
                    onClick={handleAcceptPolicy}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3 mt-4">
                <i className="pi pi-check-circle text-green-600 text-xl"></i>
                <div>
                  <h4 className="font-semibold text-green-900">
                    Policy Accepted
                  </h4>
                  <p className="text-sm text-green-700">
                    You have already acknowledged this policy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
