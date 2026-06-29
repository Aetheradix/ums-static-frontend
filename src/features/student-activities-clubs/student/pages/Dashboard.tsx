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
      </div>
    </FormPage>
  );
}
