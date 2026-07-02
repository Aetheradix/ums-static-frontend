import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
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
        text
        severity="info"
        onClick={() => setSelectedApplicant({ ...rowData })}
      />
    );
  };

  const statusTemplate = (rowData: ApplicantData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
      <Button
        label="Reject Application"
        icon="pi pi-times"
        severity="danger"
        text
        onClick={() => handleFinalSubmit('Rejected')}
      />
      <Button
        label="Approve Application"
        icon="pi pi-check"
        severity="success"
        onClick={() => handleFinalSubmit('Verified')}
        disabled={selectedApplicant?.documents.some(
          d => d.status !== 'Verified'
        )}
        autoFocus
      />
    </div>
  );

  return (
    <FormPage
      title="Document Verification Dashboard"
      description="Review and verify applicant documents before merit list generation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Cell', to: admissionsUrls.cell.dashboard },
        { label: 'Document Verification' },
      ]}
    >
      <FormCard>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-gray-800 m-0">
            Pending Applications for Review
          </h2>
        </div>

        <DataTable
          value={applicants}
          paginator
          rows={10}
          dataKey="id"
          className="p-datatable-sm"
          emptyMessage="No pending verifications."
          stripedRows
          rowHover
        >
          <Column
            field="applicationNo"
            header="App No."
            sortable
            style={{ minWidth: '120px' }}
            className="font-semibold text-gray-700"
          ></Column>
          <Column
            field="name"
            header="Applicant Name"
            sortable
            style={{ minWidth: '200px' }}
          ></Column>
          <Column field="program" header="Applied Program" sortable></Column>
          <Column
            field="status"
            header="Overall Status"
            body={statusTemplate}
            sortable
          ></Column>
          <Column
            body={actionBodyTemplate}
            header="Action"
            style={{ minWidth: '100px' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={!!selectedApplicant}
        style={{ width: '90vw', maxWidth: '800px' }}
        header={`Verify Documents: ${selectedApplicant?.name} (${selectedApplicant?.applicationNo})`}
        modal
        className="p-fluid"
        onHide={() => {
          setSelectedApplicant(null);
          setRemarks('');
        }}
        footer={dialogFooter}
      >
        {selectedApplicant && (
          <div className="flex flex-col gap-6 mt-4">
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
                <Tag
                  value={selectedApplicant.status}
                  severity={getSeverity(selectedApplicant.status)}
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
                        <Tag
                          value={doc.status}
                          severity={getSeverity(doc.status)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <Button
                        icon="pi pi-eye"
                        rounded
                        text
                        severity="info"
                        aria-label="View"
                        tooltip="View Document"
                      />
                      <Button
                        icon="pi pi-check"
                        rounded
                        text
                        severity="success"
                        aria-label="Accept"
                        tooltip="Accept Document"
                        onClick={() => handleDocAction(doc.docId, 'Verified')}
                        disabled={doc.status === 'Verified'}
                      />
                      <Button
                        icon="pi pi-times"
                        rounded
                        text
                        severity="danger"
                        aria-label="Reject"
                        tooltip="Reject Document"
                        onClick={() => handleDocAction(doc.docId, 'Rejected')}
                        disabled={doc.status === 'Rejected'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <label htmlFor="remarks" className="font-bold text-gray-700">
                Verification Remarks (Optional)
              </label>
              <InputTextarea
                id="remarks"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                className="w-full"
                placeholder="Enter remarks if rejecting..."
              />
            </div>
          </div>
        )}
      </Dialog>
    </FormPage>
  );
}
