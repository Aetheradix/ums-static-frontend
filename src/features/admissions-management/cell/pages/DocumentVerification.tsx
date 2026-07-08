import { useState } from 'react';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { Modal } from 'shared/components/popups';
import { TextArea } from 'shared/components/forms';

import { ToastService } from 'services';

interface ApplicantDocument {
  docId: string;
  name: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string;
}

interface ApplicantData {
  id: string;
  name: string;
  program: string;
  applicationNo: string;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
  documents: ApplicantDocument[];
}

const mockApplicants: ApplicantData[] = [
  {
    id: '1',
    name: 'John Doe',
    program: 'B.Tech CSE',
    applicationNo: 'APP-2024-001',
    status: 'Pending Verification',
    documents: [
      { docId: 'd1', name: '10th Marksheet', status: 'Pending', url: '#' },
      { docId: 'd2', name: '12th Marksheet', status: 'Pending', url: '#' },
      {
        docId: 'd3',
        name: 'Transfer Certificate',
        status: 'Pending',
        url: '#',
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    program: 'MBA Finance',
    applicationNo: 'APP-2024-002',
    status: 'Pending Verification',
    documents: [
      { docId: 'd4', name: 'Graduation Degree', status: 'Verified', url: '#' },
      { docId: 'd5', name: 'ID Proof (Aadhar)', status: 'Pending', url: '#' },
    ],
  },
];

export default function DocumentVerification() {
  const [applicants, setApplicants] = useState<ApplicantData[]>(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantData | null>(null);
  const [remarks, setRemarks] = useState('');

  const getSeverity = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Pending':
      case 'Pending Verification':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleDocAction = (docId: string, action: 'Verified' | 'Rejected') => {
    if (selectedApplicant) {
      const updatedDocs = selectedApplicant.documents.map(d =>
        d.docId === docId ? { ...d, status: action } : d
      );
      setSelectedApplicant({ ...selectedApplicant, documents: updatedDocs });
      ToastService.success(`Document marked as ${action}.`);
    }
  };

  const handleFinalSubmit = (finalStatus: 'Verified' | 'Rejected') => {
    if (selectedApplicant) {
      const updatedApplicants = applicants.map(app =>
        app.id === selectedApplicant.id
          ? ({ ...selectedApplicant, status: finalStatus } as ApplicantData)
          : app
      );
      setApplicants(updatedApplicants);
      setSelectedApplicant(null);
      setRemarks('');
      ToastService.success(
        `Application has been ${finalStatus.toLowerCase()}.`
      );
    }
  };

  const actionBodyTemplate = (rowData: ApplicantData) => {
    return (
      <Button
        label="Review"
        icon="pi pi-check-square"
        size="small"
        variant="outlined"
        onClick={() => setSelectedApplicant({ ...rowData })}
      />
    );
  };

  const statusTemplate = (rowData: ApplicantData) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={getSeverity(rowData.status)}
      />
    );
  };

  return (
    <FormPage
      title="Document Verification Dashboard"
      description="Review and verify applicant documents before merit list generation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: '/admissions' },
        { label: 'Admission Cell', to: '/admissions/cell' },
        { label: 'Document Verification' },
      ]}
    >
      <FormCard>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-gray-800 m-0">
            Pending Applications for Review
          </h2>
        </div>

        <GridPanel
          data={applicants}
          searchBox={true}
          searchFields={['applicationNo', 'name', 'program', 'status']}
          emptyMessage="No pending verifications."
          columns={[
            { field: 'applicationNo', header: 'App No.', sortable: true },
            { field: 'name', header: 'Applicant Name', sortable: true },
            { field: 'program', header: 'Applied Program', sortable: true },
            {
              field: 'status',
              header: 'Overall Status',
              cell: statusTemplate,
              sortable: true,
            },
            { header: 'Action', cell: actionBodyTemplate },
          ]}
        />
      </FormCard>

      <Modal
        visible={!!selectedApplicant}
        size="large"
        header={`Verify Documents: ${selectedApplicant?.name} (${selectedApplicant?.applicationNo})`}
        onHide={() => {
          setSelectedApplicant(null);
          setRemarks('');
        }}
      >
        {selectedApplicant && (
          <div className="flex flex-col gap-6 p-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
              <div className="mb-2 md:mb-0">
                <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                  Applied Program
                </p>
                <p className="font-bold text-blue-900 text-lg">
                  {selectedApplicant.program}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                  Status
                </p>
                <StatusBadge
                  label={selectedApplicant.status}
                  variant={getSeverity(selectedApplicant.status)}
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                Uploaded Documents
              </h3>
              <div className="flex flex-col gap-3">
                {selectedApplicant.documents.map(doc => (
                  <div
                    key={doc.docId}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-red-50 p-2 rounded">
                        <i className="pi pi-file-pdf text-red-500 text-2xl"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {doc.name}
                        </p>
                        <StatusBadge
                          label={doc.status}
                          variant={getSeverity(doc.status)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <Button
                        icon="pi pi-eye"
                        variant="outlined"
                        tooltip="View Document"
                      />
                      <Button
                        icon="pi pi-check"
                        variant="outlined"
                        tooltip="Accept Document"
                        onClick={() => handleDocAction(doc.docId, 'Verified')}
                        disabled={doc.status === 'Verified'}
                      />
                      <Button
                        icon="pi pi-times"
                        variant="outlined"
                        tooltip="Reject Document"
                        onClick={() => handleDocAction(doc.docId, 'Rejected')}
                        disabled={doc.status === 'Rejected'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TextArea
              label="Verification Remarks (Optional)"
              value={remarks}
              onChange={v => setRemarks(v as string)}
              rows={3}
              placeholder="Enter remarks if rejecting..."
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
              <Button
                label="Reject Application"
                icon="pi pi-times"
                variant="outlined"
                onClick={() => handleFinalSubmit('Rejected')}
              />
              <Button
                label="Approve Application"
                icon="pi pi-check"
                variant="primary"
                onClick={() => handleFinalSubmit('Verified')}
                disabled={selectedApplicant?.documents.some(
                  d => d.status !== 'Verified'
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </FormPage>
  );
}
