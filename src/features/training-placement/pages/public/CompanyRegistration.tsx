import { useState, useRef } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'primereact/button';
import { TextBox } from 'shared/components/forms';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

export default function CompanyRegistration() {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    hrName: '',
    hrEmail: '',
    hrPhone: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Registration Submitted',
        detail:
          'Your registration request has been submitted to the T&P department for verification.',
        life: 5000,
      });
      // Optionally redirect after a few seconds
      setTimeout(() => {
        navigate('/training-placement');
      }, 2000);
    }, 1500);
  };

  return (
    <FormPage
      title="Company Registration"
      description="Register your company to participate in the placement drive."
      breadcrumbs={[
        { label: 'Training & Placement', to: '/training-placement' },
        { label: 'Company Registration' },
      ]}
    >
      <Toast ref={toast} />

      <div className="max-w-3xl mx-auto">
        <FormCard title="Company Information">
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextBox
                label="Company Name *"
                value={formData.companyName}
                onChange={v => handleChange('companyName', v as string)}
                placeholder="Enter company name"
              />

              <TextBox
                label="Industry / Sector *"
                value={formData.industry}
                onChange={v => handleChange('industry', v as string)}
                placeholder="e.g. IT Services, Manufacturing"
              />

              <div className="md:col-span-2">
                <TextBox
                  label="Website URL"
                  value={formData.website}
                  onChange={v => handleChange('website', v as string)}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                HR Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextBox
                  label="Contact Person Name *"
                  value={formData.hrName}
                  onChange={v => handleChange('hrName', v as string)}
                  placeholder="Enter full name"
                />

                <TextBox
                  label="Official Email ID *"
                  value={formData.hrEmail}
                  onChange={v => handleChange('hrEmail', v as string)}
                  placeholder="name@company.com"
                />

                <TextBox
                  label="Phone Number *"
                  value={formData.hrPhone}
                  onChange={v => handleChange('hrPhone', v as string)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                label="Submit Registration Request"
                loading={loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 border-none"
              />
            </div>
          </form>
        </FormCard>
      </div>
    </FormPage>
  );
}
