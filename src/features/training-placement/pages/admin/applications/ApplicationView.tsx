import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { tpUrls } from '../../../urls';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

export default function ApplicationView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showStatusModal, setShowStatusModal] = useState(false);

  const defaultHistory = [
    {
      status: 'Shortlisted',
      round: 'Technical Interview',
      date: '2024-07-28',
      remarks: 'Good scores in technical test',
    },
    {
      status: 'In Progress',
      round: 'Aptitude Test',
      date: '2024-07-26',
      remarks: 'Cleared with 85%',
    },
    {
      status: 'Applied',
      round: 'Initial screening',
      date: '2024-07-25',
      remarks: 'Profile submitted',
    },
  ];

  const [history, setHistory] = useLocalStorage(
    `tp_app_history_${id || 'APP-101'}`,
    defaultHistory
  );
  const [currentStatus, setCurrentStatus] = useLocalStorage(
    `tp_app_status_${id || 'APP-101'}`,
    history[0]?.status || 'Shortlisted'
  );

  const [currentRound, setCurrentRound] = useState(
    history[0]?.round || 'Technical Interview'
  );
  const [remarks, setRemarks] = useState('');

  const mockApp = {
    studentName: 'John Doe',
    rollNo: '2021CS001',
    programme: 'B.Tech Computer Science & Engineering',
    batch: '2021-2025',
    email: 'john.doe@university.edu',
    phone: '+91-9988776655',
    resumeUrl: 'https://drive.google.com/mock-resume-url',
    jobTitle: 'Software Development Engineer',
    company: 'Infosys Technologies Ltd',
    type: 'Placement',
    season: 'PL2025-JUN',
    ctc: '12 LPA',
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Selected':
      case 'Offered':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Shortlisted':
      case 'In Progress':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const handleUpdateStatus = () => {
    const newHistoryItem = {
      status: currentStatus,
      round: currentRound,
      date: new Date().toISOString().split('T')[0],
      remarks: remarks || 'No remarks provided',
    };
    setHistory([newHistoryItem, ...history]);
    setShowStatusModal(false);
    setRemarks('');
  };

  return (
    <FormPage
      title="Application Details"
      description={`Reviewing application of ${mockApp.studentName} for ${mockApp.jobTitle}`}
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Student Applications', to: tpUrls.admin.applications },
        { label: 'View Details' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(tpUrls.admin.applications)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Back to Applications
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
          >
            Update Hiring Status
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FormCard title="Student Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Student Name
                </h4>
                <p className="mt-1 text-base text-gray-900">
                  {mockApp.studentName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Roll Number / Enrollment
                </h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.rollNo}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Programme</h4>
                <p className="mt-1 text-base text-gray-900">
                  {mockApp.programme}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Batch</h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.batch}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Email Address
                </h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Phone Contact
                </h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.phone}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Resume Link
                </h4>
                <a
                  href={mockApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <i className="pi pi-file-pdf text-red-500" />
                  View/Download Resume
                </a>
              </div>
            </div>
          </FormCard>

          <FormCard title="Opportunity Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Job Title</h4>
                <p className="mt-1 text-base text-gray-900">
                  {mockApp.jobTitle}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Company</h4>
                <p className="mt-1 text-base text-gray-900">
                  {mockApp.company}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Opportunity Type
                </h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Season</h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.season}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Compensation (CTC)
                </h4>
                <p className="mt-1 text-base text-gray-900">{mockApp.ctc}</p>
              </div>
            </div>
          </FormCard>
        </div>

        {/* Right Side: Status Pipeline */}
        <div>
          <FormCard title="Hiring Status Progression">
            <div className="flex flex-col gap-6 p-2">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Current Status
                  </h4>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {currentStatus}
                  </p>
                </div>
                <StatusBadge
                  label={currentStatus}
                  variant={getStatusVariant(currentStatus)}
                />
              </div>

              {/* Status Stepper Timeline */}
              <div className="relative border-l-2 border-blue-200 ml-4 flex flex-col gap-6">
                {history.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white">
                      <i className="pi pi-circle text-[6px] text-white" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {step.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Round: {step.round} ({step.date})
                      </span>
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 italic">
                        "{step.remarks}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormCard>
        </div>
      </div>

      {/* Update Hiring Status Modal */}
      <Dialog
        header="Update Hiring Status"
        visible={showStatusModal}
        className="w-[450px] max-w-full"
        onHide={() => setShowStatusModal(false)}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              severity="secondary"
              text
              onClick={() => setShowStatusModal(false)}
            />
            <Button label="Save Changes" onClick={handleUpdateStatus} />
          </div>
        }
      >
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hiring Status
            </label>
            <select
              value={currentStatus}
              onChange={e => setCurrentStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Written Test Scheduled">
                Written Test Scheduled
              </option>
              <option value="GD Scheduled">GD Scheduled</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Current Round / Process
            </label>
            <input
              type="text"
              value={currentRound}
              onChange={e => setCurrentRound(e.target.value)}
              placeholder="e.g. Aptitude Test, Tech Round 1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Remarks for this decision..."
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
