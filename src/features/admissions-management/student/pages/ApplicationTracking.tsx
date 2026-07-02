import { Timeline } from 'primereact/timeline';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { admissionsUrls } from '../../urls';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';

export default function ApplicationTracking() {
  const navigate = useNavigate();

  const events = [
    {
      status: 'Application Submitted',
      date: '15 May 2026 10:30',
      icon: 'description',
      color: '#4f46e5',
      completed: true,
      description: 'Your application has been received successfully.',
    },
    {
      status: 'Document Verification',
      date: '16 May 2026 14:45',
      icon: 'plagiarism',
      color: '#4f46e5',
      completed: true,
      description:
        'All your uploaded documents have been verified by the Admission Cell.',
    },
    {
      status: 'Merit List Generated',
      date: '20 May 2026 09:00',
      icon: 'format_list_numbered',
      color: '#4f46e5',
      completed: true,
      description:
        'You have been shortlisted in the first merit list for B.Tech Computer Science.',
    },
    {
      status: 'Seat Allocated',
      date: '22 May 2026 11:20',
      icon: 'event_seat',
      color: '#10b981', // green indicating current/success step
      completed: true,
      description: 'A seat has been allocated to you in your preferred course.',
    },
    {
      status: 'Admission Offer Accepted',
      date: 'Pending',
      icon: 'mail',
      color: '#9ca3af', // gray indicating future step
      completed: false,
      description:
        'You need to accept the offer and pay the admission fee to confirm your seat.',
    },
  ];

  const customizedMarker = (item: any) => {
    return (
      <span
        className="flex w-12 h-12 items-center justify-center text-white rounded-full z-10 shadow-md border-4 border-white transition-transform hover:scale-110 duration-200"
        style={{ backgroundColor: item.color }}
      >
        <i
          className={`pi pi-${item.icon === 'check_circle' ? 'check-circle' : item.icon === 'description' ? 'file' : item.icon === 'school' ? 'book' : item.icon === 'payment' ? 'credit-card' : 'info-circle'} text-xl`}
        ></i>
      </span>
    );
  };

  const customizedContent = (item: any) => {
    return (
      <div className="mb-8 ml-4">
        <FormCard
          className={`shadow-sm transition-all duration-300 ${item.completed ? '' : 'opacity-70 grayscale'}`}
        >
          <div
            className={`h-full border-l-4 pl-4 py-1 -ml-4 ${item.completed ? '' : 'border-transparent'}`}
            style={{
              borderLeftColor: item.completed ? item.color : 'transparent',
            }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
              <div>
                <h3
                  className={`text-xl font-bold ${item.completed ? 'text-gray-800' : 'text-gray-500'}`}
                >
                  {item.status}
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium tracking-wide">
                  <i className="pi pi-clock mr-1 text-xs"></i> {item.date}
                </p>
              </div>
              <Tag
                value={item.completed ? 'Completed' : 'Pending'}
                severity={item.completed ? 'success' : 'warning'}
                className="self-start md:self-auto"
              />
            </div>

            <p className="text-gray-700 leading-relaxed">{item.description}</p>

            {item.status === 'Seat Allocated' && item.completed && (
              <div className="mt-5 p-5 bg-green-50 rounded-lg border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3">
                  <i className="pi pi-check-circle text-2xl text-green-600"></i>
                  <p className="text-green-900 font-medium m-0">
                    Congratulations! You have received an admission offer.
                  </p>
                </div>
                <Button
                  label="View Offer Letter"
                  icon="pi pi-file"
                  severity="success"
                  onClick={() => navigate(admissionsUrls.student.offer)}
                  className="w-full sm:w-auto shadow-sm"
                />
              </div>
            )}
          </div>
        </FormCard>
      </div>
    );
  };

  return (
    <FormPage
      title="Track Your Application"
      description="Monitor the progress of your admission application in real-time."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Application Tracking' },
      ]}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <Timeline
            value={events}
            align="left"
            className="customized-timeline w-full"
            marker={customizedMarker}
            content={customizedContent}
          />
        </div>
      </div>
    </FormPage>
  );
}
