import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';
import { useConvocationEvents, useEligibleStudents } from '../../../queries';

export default function StudentConvocationDashboard() {
  const navigate = useNavigate();
  const { data: events, isLoading: isEventsLoading } = useConvocationEvents();
  const { data: students, isLoading: isStudentsLoading } =
    useEligibleStudents();

  const activeEvent = events?.[0];
  const myStatus = students?.[0]; // Mocking current student as the first one in the list

  return (
    <FormPage
      title="Student Convocation Dashboard"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Student Portal', to: CONVOCATION_URLS.STUDENT.ROOT },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Active Convocation Announcement */}
        {!isEventsLoading && activeEvent && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-lg shrink-0">
              <span className="material-symbols-outlined text-3xl">
                campaign
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-teal-900 mb-1">
                {activeEvent.title}
              </h3>
              <p className="text-teal-800 mb-4">
                Registration is currently open for the academic year{' '}
                {activeEvent.academicYear}. Please ensure you complete your
                registration before the deadline to attend the ceremony or
                receive your degree in-absentia.
              </p>
              <div className="flex space-x-6 text-sm text-teal-700">
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-base">
                    calendar_month
                  </span>
                  <span>
                    Closes on:{' '}
                    {new Date(
                      activeEvent.registrationEndDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  <span>Venue: {activeEvent.venue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Status */}
        <FormCard title="My Eligibility & Status">
          {!isStudentsLoading && myStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 block">Name</span>
                  <span className="font-medium text-gray-900">
                    {myStatus.name}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Roll Number
                  </span>
                  <span className="font-medium text-gray-900">
                    {myStatus.rollNumber}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Programme</span>
                  <span className="font-medium text-gray-900">
                    {myStatus.programme}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 block">
                    No Dues Clearance
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      myStatus.noDuesStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {myStatus.noDuesStatus ? 'Cleared' : 'Pending Dues'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Eligibility
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      myStatus.eligible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {myStatus.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Registration Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      myStatus.registrationStatus === 'Verified'
                        ? 'bg-teal-100 text-teal-800'
                        : myStatus.registrationStatus === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {myStatus.registrationStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Loading student details...
            </div>
          )}
        </FormCard>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => {
              if (
                myStatus?.eligible &&
                myStatus?.registrationStatus !== 'Verified'
              ) {
                navigate(CONVOCATION_URLS.STUDENT.REGISTRATION);
              }
            }}
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center space-x-4 ${
              myStatus?.eligible && myStatus?.registrationStatus !== 'Verified'
                ? 'hover:shadow-md cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="p-4 bg-teal-50 text-teal-600 rounded-lg">
              <span className="material-symbols-outlined text-2xl">
                app_registration
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Register Now
              </h4>
              <p className="text-sm text-gray-500">
                Fill your application and pay the convocation fee
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              if (myStatus?.registrationStatus === 'Verified') {
                navigate(CONVOCATION_URLS.STUDENT.PASS);
              }
            }}
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center space-x-4 ${
              myStatus?.registrationStatus === 'Verified'
                ? 'hover:shadow-md cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="p-4 bg-purple-50 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Download Pass
              </h4>
              <p className="text-sm text-gray-500">
                Available after admin verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
