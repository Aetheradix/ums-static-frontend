import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubsList } from '../../data';
import { ToastService } from 'services';

export default function BrowseClubs() {
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

  const handleJoin = (clubName: string) => {
    setJoinedClubs(prev => [...prev, clubName]);
    ToastService.success(`You have successfully joined ${clubName}!`);
  };

  return (
    <FormPage
      title="Browse Clubs"
      description="Explore and join student clubs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Student Portal', to: activitiesUrls.student.dashboard },
        { label: 'Browse Clubs' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {clubsList.map((club, idx) => {
          const hasJoined = joinedClubs.includes(club.name);
          return (
            <FormCard key={idx} title={club.name}>
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mr-2">
                  {club.category}
                </span>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${club.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {club.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-2 mb-6">
                <p>
                  <span className="font-medium">President:</span>{' '}
                  {club.president}
                </p>
                <p>
                  <span className="font-medium">Established:</span>{' '}
                  {club.establishedYear}
                </p>
                <p>
                  <span className="font-medium">Members:</span>{' '}
                  {club.memberCount + (hasJoined ? 1 : 0)}
                </p>
              </div>
              <button
                className={`w-full py-2 rounded-lg transition-colors font-medium ${
                  hasJoined
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => !hasJoined && handleJoin(club.name)}
                disabled={hasJoined}
              >
                {hasJoined ? 'Joined' : 'Join Club'}
              </button>
            </FormCard>
          );
        })}
      </div>
    </FormPage>
  );
}
