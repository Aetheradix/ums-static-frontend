import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';

export default function VerifyCertificate() {
  const [certNumber, setCertNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleVerify = () => {
    if (!certNumber) return;
    setSearched(true);
    // Mock logic: Valid if it starts with RGPV
    setIsValid(certNumber.toUpperCase().startsWith('RGPV'));
  };

  return (
    <FormPage
      title="Public Certificate Verification"
      description="Verify the authenticity of any university-issued certificate."
    >
      <div className="max-w-3xl mx-auto mt-8">
        <FormCard>
          <div className="flex flex-col items-center p-8 bg-blue-50 border border-blue-200 rounded-lg mb-8">
            <i className="material-symbols-outlined text-6xl text-blue-500 mb-4">
              policy
            </i>
            <h2 className="text-2xl font-bold m-0 mb-2">Verify a Document</h2>
            <p className="text-gray-600 mb-6 text-center">
              Enter the unique certificate number printed on the bottom left of
              the document or scan the QR code to verify its authenticity.
            </p>

            <div className="flex w-full max-w-lg gap-4">
              <div className="flex-1">
                <TextBox
                  label=""
                  placeholder="Enter Certificate Number (e.g. RGPV/...)"
                  value={certNumber}
                  onChange={v => setCertNumber(v)}
                />
              </div>
              <Button
                label="Verify"
                variant="primary"
                icon="search"
                onClick={handleVerify}
              />
            </div>
          </div>

          {searched && isValid && (
            <div className="border p-6 rounded-lg shadow-sm bg-green-50 border-green-300">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-green-200">
                <i className="material-symbols-outlined text-5xl text-green-600">
                  verified
                </i>
                <div>
                  <h3 className="text-xl font-bold m-0 text-green-800">
                    Authentic Document
                  </h3>
                  <p className="m-0 text-green-700">
                    This certificate was successfully verified with university
                    records.
                  </p>
                </div>
              </div>

              <FormGrid columns={2}>
                <TextBox label="Student Name" value="Ahmed Khan" disabled />
                <TextBox label="Enrollment No" value="0802CS221001" disabled />
                <TextBox
                  label="Certificate Type"
                  value="Bonafide Certificate"
                  disabled
                />
                <TextBox label="Issue Date" value="26-06-2026" disabled />
              </FormGrid>
            </div>
          )}

          {searched && !isValid && (
            <div className="border p-6 rounded-lg shadow-sm bg-red-50 border-red-300 text-center">
              <i className="material-symbols-outlined text-5xl text-red-500 mb-4">
                cancel
              </i>
              <h3 className="text-xl font-bold m-0 text-red-800 mb-2">
                Record Not Found
              </h3>
              <p className="m-0 text-red-700">
                We could not find any matching certificate in our records.
                Please check the number and try again.
              </p>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
