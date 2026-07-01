import { useState, useEffect } from 'react';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { ApplicationSeedService, type SeedApplication } from '../../seed';
import { admissionsUrls } from '../../urls';

const STEPS: { status: string; icon: string }[] = [
  { status: 'Submitted', icon: 'pi-send' },
  { status: 'Under Review', icon: 'pi-search' },
  { status: 'Fee Pending', icon: 'pi-credit-card' },
  { status: 'Approved', icon: 'pi-check-circle' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'approved' as const;
    case 'Rejected':
      return 'rejected' as const;
    case 'Fee Pending':
      return 'pending' as const;
    case 'Under Review':
      return 'pending' as const;
    default:
      return 'neutral' as const;
  }
};

export default function ApplicationStatus() {
  const [application, setApplication] = useState<SeedApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApplicationSeedService.getMyApplication().then(app => {
      setApplication(app ?? null);
      setLoading(false);
    });
  }, []);

  const currentStepIndex = application
    ? STEPS.findIndex(s => s.status === application.status)
    : -1;

  if (loading)
    return (
      <FormPage
        title="Application Status"
        description="Track your admission application."
      >
        <FormCard>
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
            <i className="pi pi-spin pi-spinner text-4xl" />
            <p className="text-sm">Loading your application...</p>
          </div>
        </FormCard>
      </FormPage>
    );

  if (!application) {
    return (
      <FormPage
        title="Application Status"
        description="Track your admission application."
      >
        <FormCard>
          <div className="p-8 text-center text-gray-500">
            <i className="pi pi-inbox text-4xl mb-4 block" />
            <p>No application found. Please apply first.</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Application Status"
      description="Track the current status of your admission application."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Student Portal', to: admissionsUrls.student.root },
        { label: 'Application Status' },
      ]}
    >
      {/* Application Summary */}
      <FormCard title="Application Details">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
          {[
            { label: 'Application No', value: application.applicationNo },
            { label: 'Applicant Name', value: application.applicantName },
            { label: 'Programme', value: application.programmeName },
            { label: 'Category', value: application.category },
            { label: 'Admission Type', value: application.admissionType },
            { label: 'Session', value: application.academicSession },
            { label: 'Submitted On', value: application.submittedAt },
            { label: 'Fee Paid', value: application.feePaid ? 'Yes' : 'No' },
          ].map(item => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {item.label}
              </span>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 px-2">
          <span className="text-sm text-gray-500">Current Status:</span>
          <StatusBadge
            label={application.status}
            variant={statusVariant(application.status)}
          />
        </div>
      </FormCard>

      {/* Progress Tracker */}
      <FormCard title="Application Progress">
        {application.status === 'Rejected' ? (
          <div className="p-6 bg-red-50 rounded-lg text-center text-red-700">
            <i className="pi pi-times-circle text-4xl mb-3 block" />
            <h3 className="font-bold text-lg mb-1">Application Rejected</h3>
            <p className="text-sm">
              Unfortunately, your application did not meet the required
              criteria. Please contact the admission cell for further
              assistance.
            </p>
          </div>
        ) : (
          <div className="relative flex items-start justify-between px-4 py-6">
            {/* Connector line behind the steps */}
            <div className="absolute top-[54px] left-[10%] right-[10%] h-0.5 bg-gray-200 z-0" />
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              return (
                <div
                  key={step.status}
                  className="relative flex flex-col items-center gap-2 flex-1 z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                      ${isActive ? 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100' : ''}
                      ${!isCompleted && !isActive ? 'bg-white border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    <i
                      className={`pi ${isCompleted ? 'pi-check' : step.icon} text-sm`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold text-center ${
                      isActive
                        ? 'text-blue-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Contextual CTAs based on status */}
        {application.status === 'Fee Pending' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-800">Payment Required</p>
              <p className="text-sm text-amber-600">
                Your application is awaiting fee payment.
              </p>
            </div>
            <a
              href="/admissions-management/student/fee-payment"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition"
            >
              Proceed to Fee Payment →
            </a>
          </div>
        )}

        {application.status === 'Approved' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-800">
                Application Approved!
              </p>
              <p className="text-sm text-green-600">
                Your admit card is ready to download.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const content = `ADMIT CARD\nApplication: ${application.applicationNo}\nApplicant: ${application.applicantName}\nProgramme: ${application.programmeName}\nSession: ${application.academicSession}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${application.applicationNo}_admit_card.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-2"
            >
              <i className="pi pi-download" /> Download Admit Card
            </button>
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
