import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';

const mockPrograms = [
  { label: 'B.Tech Computer Science', value: 'B.Tech CSE' },
  { label: 'B.Tech Electronics', value: 'B.Tech ECE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
  { label: 'B.Sc Physics', value: 'B.Sc Physics' },
];

const mockSources = [
  { label: 'Search Engine (Google/Bing)', value: 'Search Engine' },
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Friend/Family', value: 'Referral' },
  { label: 'Advertisement', value: 'Ad' },
];

export default function AdmissionEnquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: null,
    source: null,
    state: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    ToastService.success('Enquiry submitted successfully!');
  };

  const handleRegister = () => {
    navigate(admissionsUrls.student.apply);
  };

  return (
    <FormPage
      title="Admission Enquiry"
      description="Have questions? Drop an enquiry and our counselors will get in touch."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Enquiry' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {!submitted ? (
          <FormCard>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Enquiry Form
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-fluid"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="font-bold text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="firstName"
                    value={formData.firstName}
                    onChange={e =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className="w-full"
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="font-bold text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="lastName"
                    value={formData.lastName}
                    onChange={e =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className="w-full"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-bold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-bold text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="phone"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="program" className="font-bold text-gray-700">
                    Interested Program <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    id="program"
                    value={formData.program}
                    options={mockPrograms}
                    onChange={e =>
                      setFormData({ ...formData, program: e.value })
                    }
                    required
                    placeholder="Select a Program"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="source" className="font-bold text-gray-700">
                    How did you hear about us?
                  </label>
                  <Dropdown
                    id="source"
                    value={formData.source}
                    options={mockSources}
                    onChange={e =>
                      setFormData({ ...formData, source: e.value })
                    }
                    placeholder="Select Source"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="state" className="font-bold text-gray-700">
                    State / Province
                  </label>
                  <InputText
                    id="state"
                    value={formData.state}
                    onChange={e =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full"
                    placeholder="e.g. California"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="font-bold text-gray-700">
                    City
                  </label>
                  <InputText
                    id="city"
                    value={formData.city}
                    onChange={e =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full"
                    placeholder="e.g. San Francisco"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-6">
                <Button
                  label="Clear Form"
                  type="button"
                  icon="pi pi-refresh"
                  text
                  severity="secondary"
                  onClick={() =>
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      program: null,
                      source: null,
                      state: '',
                      city: '',
                    })
                  }
                  className="w-full md:w-auto"
                />
                <Button
                  label="Submit Enquiry"
                  type="submit"
                  icon="pi pi-send"
                  className="w-full md:w-auto"
                />
              </div>
            </form>
          </FormCard>
        ) : (
          <FormCard>
            <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100 shadow-sm">
                <i className="pi pi-check text-5xl text-green-500"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Enquiry Submitted!
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                Thank you for your interest,{' '}
                <strong>{formData.firstName}</strong>. Our admission counselor
                will contact you shortly at <strong>{formData.phone}</strong>.
              </p>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 w-full max-w-md shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <h3 className="font-bold text-blue-900 mb-2 text-xl">
                  Ready to apply now?
                </h3>
                <p className="text-blue-700 mb-5 leading-relaxed">
                  Skip the wait and start your application process immediately
                  by creating an account.
                </p>
                <Button
                  label="Proceed to Registration"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={handleRegister}
                  className="w-full font-bold shadow-md"
                  size="large"
                />
              </div>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
