import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';

function ApplicationStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
        datasets: [
          {
            data: [5, 2, 1, 1], // mock data
            backgroundColor: [
              '#3b82f6', // blue
              '#f59e0b', // amber
              '#10b981', // green
              '#ef4444', // red
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12 },
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={ref} className="h-48 w-full" />;
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const activityEvents = [
    {
      status: 'Applied',
      date: '15/10/2024 10:00',
      icon: 'send',
      color: '#9C27B0',
      job: 'Infosys (SDE)',
    },
    {
      status: 'Shortlisted',
      date: '17/10/2024 14:30',
      icon: 'star',
      color: '#673AB7',
      job: 'Infosys (SDE)',
    },
    {
      status: 'Technical Interview',
      date: '20/10/2024 09:00',
      icon: 'event',
      color: '#FF9800',
      job: 'Infosys (SDE)',
    },
    {
      status: 'Offered',
      date: '25/10/2024 16:00',
      icon: 'check',
      color: '#4CAF50',
      job: 'TCS (System Analyst)',
    },
  ];

  const customizedMarker = (item: any) => {
    return (
      <span
        className="flex w-6 h-6 items-center justify-center text-white rounded-full z-10 shadow-sm"
        style={{ backgroundColor: item.color }}
      >
        <Icon name={item.icon} className="text-xs" />
      </span>
    );
  };

  const customizedContent = (item: any) => {
    return (
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{item.status}</h3>
        <div className="text-sm text-gray-600 font-medium">{item.job}</div>
        <div className="text-xs text-gray-500 mt-1">{item.date}</div>
      </div>
    );
  };

  return (
    <FormPage
      title="Training & Placement Dashboard"
      description="Welcome to your placement portal. Track applications and explore new opportunities."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Student Portal', to: tpUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Applications"
            value="3"
            icon="file-edit"
            colorScheme="blue"
            trend={{ value: 1, label: 'this week', direction: 'up' }}
          />
          <StatCard
            title="Interviews Scheduled"
            value="1"
            icon="calendar"
            colorScheme="purple"
            trend={{ value: 1, label: 'upcoming', direction: 'neutral' }}
          />
          <StatCard
            title="Offers Received"
            value="1"
            icon="briefcase"
            colorScheme="green"
            trend={{ value: 1, label: 'new', direction: 'up' }}
          />
          <StatCard
            title="Enrolled Seasons"
            value="2"
            icon="check-circle"
            colorScheme="orange"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Recent Jobs & Stats */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* CTC Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormCard className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                <div className="p-5 flex flex-col items-center justify-center text-center h-full">
                  <p className="text-indigo-100 font-medium mb-1">
                    Highest Package
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight">12 LPA</h3>
                  <p className="text-xs text-indigo-200 mt-2">
                    Infosys Technologies
                  </p>
                </div>
              </FormCard>
              <FormCard className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md">
                <div className="p-5 flex flex-col items-center justify-center text-center h-full">
                  <p className="text-teal-100 font-medium mb-1">Average CTC</p>
                  <h3 className="text-3xl font-bold tracking-tight">7.5 LPA</h3>
                  <p className="text-xs text-teal-200 mt-2">Across 3 offers</p>
                </div>
              </FormCard>
              <FormCard className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md">
                <div className="p-5 flex flex-col items-center justify-center text-center h-full">
                  <p className="text-blue-100 font-medium mb-1">Total Offers</p>
                  <h3 className="text-3xl font-bold tracking-tight">3</h3>
                  <p className="text-xs text-blue-200 mt-2">
                    2 Placements, 1 Intern
                  </p>
                </div>
              </FormCard>
            </div>

            <FormCard title="Recent Activity">
              <div className="p-4 pt-6">
                <Timeline
                  value={activityEvents}
                  align="left"
                  className="w-full text-sm"
                  marker={customizedMarker}
                  content={customizedContent}
                />
              </div>
            </FormCard>

            <FormCard title="Recent Opportunities">
              <div className="flex flex-col gap-4 p-4">
                {[
                  {
                    title: 'Software Development Engineer',
                    company: 'Infosys Technologies Ltd',
                    type: 'Placement',
                    deadline: '15 Aug 2024',
                    status: 'New',
                  },
                  {
                    title: 'Summer Intern - Analytics',
                    company: 'Tech Mahindra',
                    type: 'Internship',
                    deadline: '30 Jul 2024',
                    status: 'Closing Soon',
                  },
                ].map((job, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="work" /> {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" /> Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          job.status === 'New'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {job.status}
                      </span>
                      <Button
                        label="View Details"
                        size="small"
                        text
                        onClick={() => navigate(tpUrls.student.jobs)}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-2 text-center">
                  <Button
                    label="Browse All Jobs"
                    link
                    onClick={() => navigate(tpUrls.student.jobs)}
                  />
                </div>
              </div>
            </FormCard>
          </div>

          {/* Right Column: Alerts & Quick Links */}
          <div className="flex flex-col gap-6">
            <FormCard title="Important Updates">
              <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-3 items-start border-l-4 border-blue-500 pl-3 py-1">
                  <Icon name="info" className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Infosys Pre-Placement Talk
                    </p>
                    <p className="text-xs text-gray-500">
                      Scheduled for 10 Aug, 10:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start border-l-4 border-orange-500 pl-3 py-1">
                  <Icon name="warning" className="text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Resume Update Required
                    </p>
                    <p className="text-xs text-gray-500">
                      Please update your latest semester CGPA.
                    </p>
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard title="Application Status">
              <div className="p-4">
                <ApplicationStatusChart />
              </div>
            </FormCard>

            <FormCard title="Quick Links">
              <div className="flex flex-col gap-2 p-4">
                <Button
                  label="Update My Profile"
                  icon={<Icon name="edit" className="mr-2" />}
                  className="w-full justify-start"
                  outlined
                  onClick={() => navigate(tpUrls.student.registration)}
                />
                <Button
                  label="Available Seasons"
                  icon={<Icon name="list" className="mr-2" />}
                  className="w-full justify-start"
                  outlined
                  onClick={() => navigate(tpUrls.student.availableSeasons)}
                />
                <Button
                  label="My Applications"
                  icon={<Icon name="send" className="mr-2" />}
                  className="w-full justify-start"
                  outlined
                  onClick={() => navigate(tpUrls.student.myApplications)}
                />
              </div>
            </FormCard>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
