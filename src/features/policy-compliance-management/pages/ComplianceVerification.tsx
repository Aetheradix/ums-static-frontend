import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_COMPLIANCE_SUBMISSIONS,
  type ComplianceSubmission,
} from '../data';

export default function ComplianceVerification() {
  const [submissions, setSubmissions] = useState<ComplianceSubmission[]>(
    INITIAL_COMPLIANCE_SUBMISSIONS.filter(
      s => s.status === 'Submitted' || s.status === 'Under Verification'
    )
  );
  const [showVerify, setShowVerify] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceSubmission | null>(
    null
  );
  const [remarks, setRemarks] = useState('');

  const handleVerifyView = (item: ComplianceSubmission) => {
    setSelectedItem(item);
    setRemarks(item.verificationRemarks || '');
    setShowVerify(true);
  };

  const handleAction = (action: 'verify' | 'reject') => {
    if (!selectedItem) return;
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id !== selectedItem.id) return s;
        return {
          ...s,
          status: action === 'verify' ? 'Verified' : 'Rejected',
          verifiedBy: 'Dr. Anita Sharma (Compliance Officer)',
          verifiedDate: new Date().toISOString().split('T')[0],
          verificationRemarks: remarks,
        };
      })
    );
    setShowVerify(false);
    setSelectedItem(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Compliance Verification"
      description="Compliance Officer verifies submitted compliance — approve or reject"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Compliance Verification' },
      ]}
    >
      <FormCard
        title="Submissions Pending Verification"
        icon="verified_user"
        subtitle="Review and verify submitted compliance documents"
      >
        <GridPanel
          data={submissions}
          columns={[
            { field: 'id', header: 'Sub ID', width: '90px' },
            { field: 'complianceName', header: 'Compliance' },
            { field: 'submittedBy', header: 'Submitted By' },
            { field: 'department', header: 'Department' },
            { field: 'submittedDate', header: 'Submitted', width: '110px' },
            {
              field: 'documents',
              header: 'Documents',
              cell: (item: any) => (
                <span className="text-sm text-gray-600">
                  {item.documents.length} file(s)
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: '140px',
              cell: (item: any) => {
                const variant =
                  item.status === 'Verified'
                    ? 'approved'
                    : item.status === 'Rejected'
                      ? 'rejected'
                      : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '120px',
              cell: (item: any) => (
                <Button
                  label="Verify"
                  icon="search"
                  onClick={() => handleVerifyView(item)}
                  variant="outlined"
                  className="p-button-sm"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search submissions..."
        />
      </FormCard>

      {/* ── Verification Dialog ── */}
      <FormPopup
        title={`Verify: ${selectedItem?.complianceName || ''}`}
        visible={showVerify}
        onHide={() => {
          setShowVerify(false);
          setSelectedItem(null);
        }}
      >
        {selectedItem && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Submitted By
                </span>
                <span className="text-sm font-medium">
                  {selectedItem.submittedBy}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {selectedItem.department}
                </span>
              </div>
            </FormGrid>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Documents
              </span>
              <div className="flex flex-col gap-2">
                {selectedItem.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-blue-50 rounded"
                  >
                    <i className="pi pi-file text-blue-500"></i>
                    <span className="text-sm text-blue-700 font-medium">
                      {doc}
                    </span>
                    <button className="ml-auto text-xs text-blue-600 hover:text-blue-800">
                      <i className="pi pi-download"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Submission Remarks
              </span>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {selectedItem.remarks}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Verification Remarks
              </label>
              <InputTextarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                placeholder="Enter verification remarks..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <Button
                label="Verify ✓"
                icon="check"
                onClick={() => handleAction('verify')}
                className="bg-green-600 hover:bg-green-700"
              />
              <Button
                label="Reject → Resubmit"
                icon="times"
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
