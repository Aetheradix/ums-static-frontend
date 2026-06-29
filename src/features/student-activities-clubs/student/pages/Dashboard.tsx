import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubMembers, clubEvents } from '../../data';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';

export default function StudentDashboard() {
  // Mock logged-in student enrollment no: 'EN2024001'
  const [memberships, setMemberships] = useState(
    clubMembers.filter(m => m.enrollmentNo === 'EN2024001')
  );

  const myClubs = memberships.map(m => m.club);
  const myEvents = clubEvents.filter(
    e => myClubs.includes(e.club) && e.status !== 'Completed'
  );

  const myApplications = [
    {
      activity: 'Inter-College Basketball Tournament',
      appliedDate: '2024-11-05',
      status: 'Approved',
    },
    {
      activity: 'Tech Horizon Hackathon',
      appliedDate: '2024-11-20',
      status: 'Pending',
    },
  ];

  const handleLeaveClub = (clubName: string) => {
    setMemberships(prev => prev.filter(m => m.club !== clubName));
    ToastService.success(`You have successfully left the ${clubName}.`);
  };

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
          {memberships.length > 0 ? (
            <div className="space-y-4">
              {memberships.map((membership, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {membership.club}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Joined: {membership.joinDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {membership.role}
                    </span>
                    <Button
                      icon="logout"
                      variant="text"
                      className="text-red-500 hover:bg-red-50"
                      size="small"
                      tooltip="Leave Club"
                      onClick={() => handleLeaveClub(membership.club)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm py-4">
              You are not a member of any club yet. Go to "Browse Clubs" to
              join!
            </div>
          )}
        </FormCard>

        <FormCard title="Upcoming Club Events">
          {myEvents.length > 0 ? (
            <div className="space-y-4">
              {myEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-white"
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

        <div className="lg:col-span-2">
          <FormCard title="My Activity Applications">
            {myApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myApplications.map((app, idx) => {
                  let colorClass = '';
                  if (app.status === 'Approved')
                    colorClass = 'bg-green-100 text-green-700';
                  else if (app.status === 'Rejected')
                    colorClass = 'bg-red-100 text-red-700';
                  else if (app.status === 'Pending')
                    colorClass = 'bg-yellow-100 text-yellow-700';
                  else colorClass = 'bg-gray-100 text-gray-700';

                  return (
                    <div
                      key={idx}
                      className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">
                          {app.activity}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied on: {app.appliedDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-sm py-4">
                You have not applied for any activities yet.
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
