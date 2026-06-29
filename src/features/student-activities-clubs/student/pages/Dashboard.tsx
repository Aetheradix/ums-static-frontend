import { FormCard, FormPage } from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubMembers, clubEvents } from '../../data';

export default function StudentDashboard() {
  // Mock logged-in student enrollment no: 'EN2024001'
  const myMemberships = clubMembers.filter(m => m.enrollmentNo === 'EN2024001');
  const myClubs = myMemberships.map(m => m.club);
  const myEvents = clubEvents.filter(
    e => myClubs.includes(e.club) && e.status !== 'Completed'
  );

  return (
    <FormPage
      title="My Activities Dashboard"
      description="View your clubs and upcoming events."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Student Portal' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="My Clubs">
          {myMemberships.length > 0 ? (
            <div className="space-y-4">
              {myMemberships.map((membership, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border border-gray-100 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {membership.club}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Joined: {membership.joinDate}
                    </p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {membership.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm py-4">
              You are not a member of any club yet.
            </div>
          )}
        </FormCard>

        <FormCard title="Upcoming Club Events">
          {myEvents.length > 0 ? (
            <div className="space-y-4">
              {myEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border border-gray-100 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {event.club} - {event.date} at {event.venue}
                    </p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm py-4">
              No upcoming events for your clubs.
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
