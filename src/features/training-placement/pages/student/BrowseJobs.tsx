import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

export default function BrowseJobs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const toast = useRef<Toast>(null);

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Read opt-in status from Task 2 (default true so it works before task 2)
  const [registrationData] = useLocalStorage('tp_student_registration', {
    optIn: true,
  });

  const [applications, setApplications] = useLocalStorage<any[]>(
    'tp_student_applications',
    [
      {
        id: 'APP-101',
        jobTitle: 'Software Development Engineer',
        company: 'Infosys Technologies Ltd',
        appliedDate: '2024-07-25',
        round: 'Technical Interview',
        status: 'Shortlisted',
      },
      {
        id: 'APP-102',
        jobTitle: 'Data Analyst',
        company: 'TCS',
        appliedDate: '2024-07-10',
        round: 'Aptitude Test',
        status: 'In Progress',
      },
      {
        id: 'APP-103',
        jobTitle: 'Frontend Developer',
        company: 'Wipro',
        appliedDate: '2024-06-15',
        round: 'Final HR',
        status: 'Offered',
      },
    ]
  );

  const mockJobs = [
    {
      id: 'JOB-101',
      title: 'Software Development Engineer',
      company: 'Infosys Technologies Ltd',
      type: 'Placement',
      ctc: '12 LPA',
      deadline: '15 Aug 2024',
      eligibility: 'Matched',
      description:
        'Looking for enthusiastic engineers to build next-gen enterprise applications.',
    },
    {
      id: 'JOB-102',
      title: 'Summer Intern - Analytics',
      company: 'Tech Mahindra',
      type: 'Internship',
      ctc: '30k / month',
      deadline: '30 Jul 2024',
      eligibility: 'Not Matched',
      description:
        'Need candidates with strong background in Statistics and Python.',
    },
    {
      id: 'JOB-104',
      title: 'System Analyst',
      company: 'TCS',
      type: 'Placement',
      ctc: '7 LPA',
      deadline: '20 Aug 2024',
      eligibility: 'Matched',
      description: 'Analyze system requirements and design robust solutions.',
    },
  ];

  const filteredJobs = mockJobs.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = (job: any) => {
    if (!registrationData.optIn) {
      toast.current?.show({
        severity: 'error',
        summary: 'Opted Out',
        detail:
          'You have opted out of placements. Please update your registration settings.',
        life: 3000,
      });
      return;
    }
    if (job.eligibility === 'Not Matched') {
      toast.current?.show({
        severity: 'error',
        summary: 'Eligibility Error',
        detail: 'You do not meet the eligibility criteria for this role.',
        life: 3000,
      });
      return;
    }

    const alreadyApplied = applications.find(
      app => app.jobTitle === job.title && app.company === job.company
    );
    if (alreadyApplied) {
      toast.current?.show({
        severity: 'info',
        summary: 'Already Applied',
        detail: 'You have already applied to this job.',
        life: 3000,
      });
      return;
    }

    const newApp = {
      id: `APP-${Math.floor(Math.random() * 1000) + 200}`,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toISOString().split('T')[0],
      round: 'Applied',
      status: 'In Progress',
    };

    setApplications([newApp, ...applications]);

    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: `Application submitted for ${job.company}!`,
      life: 3000,
    });

    // Close drawer if it was open
    setShowDrawer(false);
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setShowDrawer(true);
  };

  return (
    <FormPage
      title="Browse Jobs"
      description="Explore active job postings and apply for roles."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Student Portal', to: tpUrls.student.portal },
        { label: 'Browse Jobs' },
      ]}
    >
      <Toast ref={toast} />

      {!registrationData.optIn && (
        <div className="mb-4 rounded-md bg-orange-50 p-4 border border-orange-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="pi pi-exclamation-triangle text-orange-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                You are currently opted-out of placements
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  You must opt-in via Registration settings before you can apply
                  to any jobs.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(tpUrls.student.registration)}
                  className="rounded-md bg-orange-100 px-2.5 py-1.5 text-sm font-medium text-orange-800 hover:bg-orange-200"
                >
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FormCard>
        <div className="p-4">
          <div className="mb-4 flex w-full sm:w-64 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="pi pi-search" />
            </span>
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <GridPanel
            data={filteredJobs}
            dataKey="id"
            emptyMessage={
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <i className="pi pi-search text-4xl mb-4 text-gray-300" />
                <p>No jobs found matching your criteria.</p>
                <p className="text-sm mt-1">
                  Try adjusting your search terms or check back later.
                </p>
              </div>
            }
            pagination
            columns={
              [
                { field: 'title', header: 'Job Title' },
                { field: 'company', header: 'Company' },
                { field: 'type', header: 'Type' },
                { field: 'ctc', header: 'CTC / Stipend' },
                { field: 'deadline', header: 'Apply By' },
                {
                  field: 'eligibility',
                  header: 'Eligibility',
                  cell: (row: any) => (
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        row.eligibility === 'Matched'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {row.eligibility}
                    </span>
                  ),
                },
                {
                  field: 'actions',
                  header: 'Action',
                  cell: (row: any) => {
                    const hasApplied = applications.some(
                      app =>
                        app.jobTitle === row.title &&
                        app.company === row.company
                    );
                    return (
                      <div className="flex gap-2">
                        <Button
                          label="View Details"
                          size="small"
                          outlined
                          onClick={() => handleViewDetails(row)}
                        />
                        <Button
                          label={hasApplied ? 'Applied' : 'Apply'}
                          size="small"
                          severity={
                            row.eligibility === 'Matched' && !hasApplied
                              ? undefined
                              : 'secondary'
                          }
                          disabled={
                            row.eligibility === 'Not Matched' ||
                            hasApplied ||
                            !registrationData.optIn
                          }
                          onClick={() => handleApply(row)}
                        />
                      </div>
                    );
                  },
                },
              ] as never[]
            }
          />
        </div>
      </FormCard>

      <Sidebar
        visible={showDrawer}
        onHide={() => setShowDrawer(false)}
        position="right"
        className="w-full md:w-[30rem]"
      >
        {selectedJob && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {selectedJob.title}
              </h2>
              <p className="text-base text-gray-600 mb-6">
                {selectedJob.company}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    selectedJob.eligibility === 'Matched'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedJob.eligibility === 'Matched'
                    ? 'You are eligible'
                    : 'Not eligible'}
                </span>
                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedJob.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">CTC / Stipend</p>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.ctc}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Apply By</p>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.deadline}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Job Description
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t mt-auto flex justify-end gap-3">
              <Button
                label="Close"
                outlined
                onClick={() => setShowDrawer(false)}
              />
              <Button
                label={
                  applications.some(
                    app =>
                      app.jobTitle === selectedJob.title &&
                      app.company === selectedJob.company
                  )
                    ? 'Already Applied'
                    : 'Apply Now'
                }
                disabled={
                  selectedJob.eligibility === 'Not Matched' ||
                  applications.some(
                    app =>
                      app.jobTitle === selectedJob.title &&
                      app.company === selectedJob.company
                  ) ||
                  !registrationData.optIn
                }
                onClick={() => handleApply(selectedJob)}
              />
            </div>
          </div>
        )}
      </Sidebar>
    </FormPage>
  );
}
