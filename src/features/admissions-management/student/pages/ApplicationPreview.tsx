import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { Button } from 'primereact/button';
import { admissionsUrls } from '../../urls';

export default function ApplicationPreview() {
  const dummyApplicant = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    program: 'B.Tech Computer Science',
    category: 'General',
    status: 'Submitted',
    applicationNo: 'APP-2024-001',
    submittedOn: '2024-06-15',
  };

  return (
    <FormPage
      title="Application Preview"
      description="Review your submitted application details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Preview' },
      ]}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <FormCard>
          <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Application Summary
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Application No:{' '}
                <span className="font-mono text-gray-800">
                  {dummyApplicant.applicationNo}
                </span>
              </p>
            </div>
            <StatusBadge
              label={dummyApplicant.status}
              variant="success"
              className="px-3 py-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 p-fluid">
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Full Name
              </label>
              <div className="font-medium text-gray-900 text-lg">
                {dummyApplicant.name}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Email Address
              </label>
              <div className="font-medium text-gray-900 text-lg">
                {dummyApplicant.email}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Mobile Number
              </label>
              <div className="font-medium text-gray-900 text-lg">
                {dummyApplicant.phone}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Applied Program
              </label>
              <div className="font-medium text-blue-700 text-lg">
                {dummyApplicant.program}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Category
              </label>
              <div className="font-medium text-gray-900 text-lg">
                {dummyApplicant.category}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                Submitted On
              </label>
              <div className="font-medium text-gray-900 text-lg">
                {dummyApplicant.submittedOn}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              label="Download PDF"
              icon="pi pi-file-pdf"
              severity="secondary"
              outlined
            />
            <Button label="Print Application" icon="pi pi-print" />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
