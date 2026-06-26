import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';

const authorities = [
  { name: 'Registrar, RGPV', value: 'registrar' },
  { name: 'Controller of Examinations', value: 'coe' },
  { name: 'Vice Chancellor', value: 'vc' },
];

export default function GenerateCertificate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    issueDate: '2026-06-26',
    authority: 'registrar',
  });

  const handleIssue = () => {
    alert('Certificate Generated and Issued Successfully!');
    navigate('/certificate-management-system/university/approve'); // Redirect back to list
  };

  return (
    <FormPage
      title="Generate Certificate"
      description="Finalize details, attach digital signature, and issue the certificate."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'University Portal', to: '/home/sub-menu/university-portal' },
        { label: 'Generate Certificate' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormCard title="Certificate Details">
            <FormGrid columns={1}>
              <TextBox
                label="Certificate Number (Auto)"
                value="RGPV/BON/2026/0099"
                disabled
              />
              <TextBox
                label="Issue Date"
                type="date"
                value={form.issueDate}
                onChange={v => setForm({ ...form, issueDate: v })}
              />
              <DropDownList
                label="Issuing Authority"
                data={authorities}
                textField="name"
                optionValue="value"
                value={form.authority}
                onChange={v => setForm({ ...form, authority: String(v) })}
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Security & Authentication">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 m-0">
                  QR Code Generation
                </h4>
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <i className="pi pi-qrcode text-4xl text-gray-600"></i>
                  <div>
                    <p className="m-0 font-semibold">Verification QR Ready</p>
                    <p className="m-0 text-sm text-gray-500">
                      Contains encrypted student and application ID.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 m-0">
                  Digital Signature
                </h4>
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <i className="pi pi-key text-4xl text-green-600"></i>
                  <div>
                    <p className="m-0 font-semibold">Authority Key Attached</p>
                    <p className="m-0 text-sm text-gray-500">
                      Signature will be embedded in the PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FormCard>
        </div>

        <div className="space-y-6">
          <FormCard title="Certificate Preview">
            <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center bg-gray-50 h-[400px] rounded-lg">
              <i className="pi pi-file-pdf text-6xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold m-0 mb-2">
                Bonafide Certificate Preview
              </h3>
              <p className="text-gray-500 m-0 mb-6">
                Click below to preview the final PDF document before issuing.
              </p>
              <Button
                label="Generate PDF Preview"
                variant="outlined"
                icon="file_present"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => navigate(-1)}
              />
              <Button
                label="Issue Certificate"
                variant="primary"
                icon="workspace_premium"
                onClick={handleIssue}
              />
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
