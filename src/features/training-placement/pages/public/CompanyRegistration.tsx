import { useState, useRef } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <InputText
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Industry / Sector *
                </label>
                <InputText
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  placeholder="e.g. IT Services, Manufacturing"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <InputText
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                HR Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Contact Person Name *
                  </label>
                  <InputText
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Official Email ID *
                  </label>
                  <InputText
                    name="hrEmail"
                    type="email"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    required
                    placeholder="name@company.com"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <InputText
                    name="hrPhone"
                    value={formData.hrPhone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
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
