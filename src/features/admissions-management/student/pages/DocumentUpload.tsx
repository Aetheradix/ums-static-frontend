import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ToastService } from 'services';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: '10th Marksheet',
      status: 'Pending',
      required: true,
      file: null as File | null,
    },
    {
      id: 2,
      name: '12th Marksheet',
      status: 'Pending',
      required: true,
      file: null as File | null,
    },
    {
      id: 3,
      name: 'Transfer Certificate',
      status: 'Uploaded',
      required: true,
      file: new File([''], 'tc.pdf'),
    },
    {
      id: 4,
      name: 'Aadhar Card',
      status: 'Verified',
      required: true,
      file: new File([''], 'aadhar.pdf'),
    },
    {
      id: 5,
      name: 'Migration Certificate',
      status: 'Pending',
      required: false,
      file: null as File | null,
    },
  ]);

  const onUpload = (event: any, docId: number) => {
    const file = event.files[0];
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status: 'Uploaded', file };
        }
        return doc;
      })
    );
    ToastService.success(`Document uploaded successfully.`);
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Uploaded':
        return 'warning';
      case 'Pending':
        return 'danger';
      default:
        return 'info';
    }
  };

  const handleSubmit = () => {
    const pendingRequired = documents.filter(
      d => d.required && d.status === 'Pending'
    );
    if (pendingRequired.length > 0) {
      ToastService.error(
        `Please upload all required documents: ${pendingRequired.map(d => d.name).join(', ')}`
      );
      return;
    }
    ToastService.success(
      'All documents submitted successfully for verification!'
    );
  };

  return (
    <FormPage
      title="Document Upload"
      description="Upload the required documents for admission verification. Ensure files are in PDF or JPEG format and under 2MB."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Document Upload' },
      ]}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <FormCard>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 text-sm mb-6 flex items-start shadow-sm">
            <i className="pi pi-info-circle mr-3 mt-0.5 text-blue-600 text-lg"></i>
            <p className="m-0 leading-relaxed">
              Please ensure all uploaded documents are clear and legible.
              Documents marked with{' '}
              <span className="text-red-500 font-bold">*</span> are mandatory
              for verification.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="p-4 md:p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800 m-0">
                      {doc.name}
                    </h3>
                    {doc.required && (
                      <span className="text-red-500 font-bold" title="Required">
                        *
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Tag
                      value={doc.status}
                      severity={getStatusSeverity(doc.status)}
                      className="uppercase text-xs tracking-wider px-2 py-1 shadow-sm"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center gap-4 justify-end">
                  {doc.status === 'Verified' ? (
                    <div className="text-green-600 flex items-center gap-2 font-bold px-4 py-2 bg-green-50 rounded-lg border border-green-200 shadow-sm w-full md:w-auto justify-center">
                      <i className="pi pi-check-circle text-xl" /> Verified
                    </div>
                  ) : (
                    <FileUpload
                      mode="basic"
                      name={`doc_${doc.id}`}
                      accept="image/*,application/pdf"
                      maxFileSize={2000000}
                      customUpload
                      uploadHandler={e => onUpload(e, doc.id)}
                      auto
                      chooseLabel={
                        doc.status === 'Uploaded'
                          ? 'Update File'
                          : 'Choose File'
                      }
                      className={`w-full md:w-auto ${doc.status === 'Uploaded' ? 'p-button-outlined p-button-warning' : ''}`}
                    />
                  )}
                  {doc.file && doc.status !== 'Pending' && (
                    <Button
                      icon="pi pi-eye"
                      text
                      rounded
                      severity="secondary"
                      aria-label="View Document"
                      tooltip="View Document"
                      tooltipOptions={{ position: 'top' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <Button
              label="Submit Documents for Verification"
              icon="pi pi-send"
              size="large"
              onClick={handleSubmit}
              className="shadow-md"
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
