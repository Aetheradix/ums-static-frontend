import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';

export default function DownloadPage() {
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Downloading PDF...');
  };

  const handleVerify = () => {
    alert('Verifying QR Code Signature...');
  };

  return (
    <FormPage
      title="Download Certificate"
      description="Verify and download your officially issued certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'Download Certificate' },
      ]}
    >
      <FormCard>
        <div className="flex flex-col items-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <i className="pi pi-verified text-6xl text-green-500 mb-4"></i>
          <h2 className="text-2xl font-bold m-0 mb-2">
            Certificate Ready for Download
          </h2>
          <p className="text-gray-600 mb-8">
            Your application has been approved and the digital certificate has
            been generated.
          </p>

          <div className="w-full max-w-lg">
            <FormGrid columns={1}>
              <TextBox
                label="Certificate Number"
                value="RGPV/BON/2026/0099"
                disabled
              />
              <TextBox
                label="Certificate Name"
                value="Bonafide Certificate"
                disabled
              />
              <TextBox label="Issue Date" value="26-06-2026" disabled />
            </FormGrid>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              label="Verify QR"
              variant="outlined"
              icon="qr_code_scanner"
              onClick={handleVerify}
            />
            <Button
              label="Download PDF"
              variant="primary"
              icon="download"
              onClick={handleDownload}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
