import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function ApplicationStatus() {
  const { studentApplications, roomAllotments } = useHostel();

  // For mock purposes, assume the logged in student is STU-101
  const loggedInStudentId = 'STU-101';
  const myApplications = studentApplications.filter(
    a => a.studentId === loggedInStudentId
  );
  const myAllotment = roomAllotments.find(
    r => r.studentId === loggedInStudentId
  );

  return (
    <FormPage
      title="My Application Status"
      description="Check the current status of your hostel application and allotment"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Student Application',
          to: '/hostel-management/student-application/apply',
        },
        { label: 'Status' },
      ]}
    >
      {myApplications.length === 0 ? (
        <FormCard title="Application Status" icon="info">
          <div className="p-8 text-center text-slate-500">
            You have not submitted a hostel application yet.
          </div>
        </FormCard>
      ) : (
        myApplications.map(app => (
          <div key={app.id} className="mb-6">
            <FormCard title={`Application ID: ${app.id}`} icon="assignment">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Application Date
                  </span>
                  <span className="font-semibold">{app.applicationDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">
                    Hostel Preference
                  </span>
                  <span className="font-semibold">{app.hostelName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">
                    Room Preference
                  </span>
                  <span className="font-semibold">{app.roomTypeName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <span className="font-semibold px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700">
                    {app.status}
                  </span>
                </div>
              </div>

              {app.status === 'REJECTED' && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded text-red-700 dark:text-red-400">
                  <strong>Rejection Remarks:</strong> {app.scrutinyRemarks}
                </div>
              )}

              {(app.status === 'APPROVED' || app.status === 'ALLOTTED') && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded text-green-700 dark:text-green-400">
                  <strong>Status:</strong> Your application is approved!
                  {app.status === 'ALLOTTED' && myAllotment ? (
                    <div className="mt-2">
                      You have been allotted{' '}
                      <strong>Room {myAllotment.roomNumber}</strong> (Bed{' '}
                      {myAllotment.bedNumber}) in{' '}
                      <strong>{myAllotment.hostelName}</strong>.
                      <br />
                      Please proceed with check-in formalities.
                    </div>
                  ) : (
                    <div className="mt-2">
                      Waiting for room allotment by the administration.
                    </div>
                  )}
                </div>
              )}
            </FormCard>
          </div>
        ))
      )}
    </FormPage>
  );
}
