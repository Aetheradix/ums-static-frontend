import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { TextBox, DropDownList } from 'shared/components/forms';
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
                <TextBox
                  label="First Name *"
                  value={formData.firstName}
                  onChange={v =>
                    setFormData({ ...formData, firstName: v as string })
                  }
                  placeholder="John"
                />
                <TextBox
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={v =>
                    setFormData({ ...formData, lastName: v as string })
                  }
                  placeholder="Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextBox
                  label="Email Address *"
                  value={formData.email}
                  onChange={v =>
                    setFormData({ ...formData, email: v as string })
                  }
                  placeholder="john.doe@example.com"
                />
                <TextBox
                  label="Mobile Number *"
                  value={formData.phone}
                  onChange={v =>
                    setFormData({ ...formData, phone: v as string })
                  }
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DropDownList
                  label="Interested Program *"
                  value={formData.program || ''}
                  data={mockPrograms}
                  textField="label"
                  valueField="value"
                  onChange={v =>
                    setFormData({ ...formData, program: v as any })
                  }
                  defaultOptionText="Select a Program"
                />
                <DropDownList
                  label="How did you hear about us?"
                  value={formData.source || ''}
                  data={mockSources}
                  textField="label"
                  valueField="value"
                  onChange={v => setFormData({ ...formData, source: v as any })}
                  defaultOptionText="Select Source"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextBox
                  label="State / Province"
                  value={formData.state}
                  onChange={v =>
                    setFormData({ ...formData, state: v as string })
                  }
                  placeholder="e.g. California"
                />
                <TextBox
                  label="City"
                  value={formData.city}
                  onChange={v =>
                    setFormData({ ...formData, city: v as string })
                  }
                  placeholder="e.g. San Francisco"
                />
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
