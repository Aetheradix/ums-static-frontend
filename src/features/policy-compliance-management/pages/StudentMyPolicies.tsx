import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
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
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/my-policies',
        },
        { label: 'My Policies' },
      ]}
    >
      <FormCard title="Applicable Policies" icon="article">
        <GridPanel
          data={policies}
          columns={[
            { field: 'code', header: 'Policy Code', width: '120px' },
            { field: 'name', header: 'Policy Name' },
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-bold">
                  Policy Code
                </span>
                <span className="text-lg font-semibold">
                  {selectedPolicy.code}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-bold">
                  Effective Date
                </span>
                <span className="text-lg font-semibold">
                  {selectedPolicy.effectiveDate}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-bold">
                  Version
                </span>
                <span className="text-lg font-semibold">
                  {selectedPolicy.versionNumber}
                </span>
              </div>
              <Button
                label="Download Document"
                icon="download"
                variant="outlined"
              />
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg h-64 overflow-y-auto shadow-inner">
              <h3 className="font-bold mb-2">Policy Description</h3>
              <p className="text-gray-700">{selectedPolicy.description}</p>
              <p className="text-gray-700 mt-4">
                (Simulated full document text would appear here. The student is
                required to scroll and read the entire policy.)
              </p>
            </div>

            {!isPolicyAccepted(selectedPolicy.id) ? (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-col gap-3">
                <h4 className="font-semibold text-indigo-900">
                  Acknowledgement Required
                </h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded"
                    checked={acceptChecked}
                    onChange={e => setAcceptChecked(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I have read and understood the policy document in its
                    entirety and agree to comply with it.
                  </span>
                </label>
                <div className="mt-2 flex justify-end">
                  <Button
                    label="Accept Policy"
                    icon="check"
                    disabled={!acceptChecked}
                    onClick={handleAcceptPolicy}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3">
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
