import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';

export default function LinkAbcAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [abcId, setAbcId] = useState('');
  const [isLinked, setIsLinked] = useState(false);

  const handleLink = async (e: any) => {
    e.preventDefault();
    if (abcId.length < 12) {
      ToastService.error('Enter a valid 12-digit ABC ID');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLinked(true);
      ToastService.success('ABC Account linked successfully!');
    }, 1500);
  };

  return (
    <FormPage
      title="Link ABC Account"
      description="Connect your Academic Bank of Credits (ABC) account to sync your academic records."
      breadcrumbs={[
        { label: 'Portal', to: '/student-management/student' },
        { label: 'Link ABC', to: '' },
      ]}
    >
      <FormCard>
        <div className="max-w-xl mx-auto py-8">
          {isLinked ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-check text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Account Linked!
              </h3>
              <p className="text-green-700 mb-6">
                Your Academic Bank of Credits account ({abcId}) has been
                successfully linked.
              </p>
              <Button
                label="Return to Dashboard"
                variant="outlined"
                onClick={() => navigate('/student-management/student')}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="pi pi-id-card text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Academic Bank of Credits
                </h3>
                <p className="text-gray-600">
                  Please enter your 12-digit ABC ID to link your account. This
                  allows your credits to be automatically synced.
                </p>
              </div>

              <form onSubmit={handleLink} className="flex flex-col gap-4">
                <TextBox
                  label="ABC Account ID"
                  value={abcId}
                  onChange={(v: any) => setAbcId(v)}
                  placeholder="e.g. 123-456-789-012"
                  maxLength={15}
                />

                <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mt-2">
                  <i className="pi pi-info-circle mr-2"></i>
                  Don't have an ABC account? Register at{' '}
                  <a
                    href="https://www.abc.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.abc.gov.in
                  </a>
                </div>

                <Button
                  type="submit"
                  label="Verify and Link Account"
                  variant="primary"
                  isLoading={loading}
                  className="w-full justify-center mt-4"
                />
              </form>
            </div>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
