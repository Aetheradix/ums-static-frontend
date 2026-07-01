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
        icon="shield"
        subtitle="Review and verify submitted compliance documents"
      >
        <GridPanel
          data={submissions}
          columns={[
            { field: 'id', header: 'Sub ID', width: '90px' },
            { field: 'complianceName', header: 'Compliance' },
            { field: 'submittedBy', header: 'Submitted By' },
            { field: 'department', header: 'Department' },
            {
              field: 'submittedDate',
              header: 'Submitted',
              width: '110px',
              cell: (item: any) => {
                if (!item.submittedDate) return '';
                const parts = item.submittedDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.submittedDate;
              },
            },
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
          <div className="flex flex-col gap-4">
            <FormGrid columns={2}>
              <PreviewField
                label="Submitted By"
                value={selectedItem.submittedBy}
              />
              <PreviewField
                label="Department"
                value={selectedItem.department}
              />
            </FormGrid>

            {selectedItem.documents && selectedItem.documents.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                  Documents
                </span>
                <div className="flex flex-col gap-3">
                  {selectedItem.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border border-blue-100 rounded-xl bg-blue-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                        <span className="text-sm font-medium text-blue-600">
                          {doc}
                        </span>
                      </div>
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                        <i className="pi pi-download"></i>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Submission Remarks
              </span>
              <p className="text-sm font-normal leading-5 text-slate-800 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedItem.remarks}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
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
