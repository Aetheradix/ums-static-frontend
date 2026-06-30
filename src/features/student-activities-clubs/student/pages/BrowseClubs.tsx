import { useState } from 'react';
import { FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { activitiesUrls } from '../../urls';
import { clubsList } from '../../data';
import { ToastService } from 'services';

const getGradient = (category: string) => {
  switch (category) {
    case 'Technical':
      return 'bg-gradient-to-r from-blue-400 to-indigo-500';
    case 'Cultural':
      return 'bg-gradient-to-r from-pink-400 to-rose-500';
    case 'Literary':
      return 'bg-gradient-to-r from-purple-400 to-fuchsia-500';
    case 'Arts':
      return 'bg-gradient-to-r from-orange-400 to-amber-500';
    case 'Sports':
      return 'bg-gradient-to-r from-green-400 to-emerald-500';
    default:
      return 'bg-gradient-to-r from-gray-400 to-slate-500';
  }
};

const getIcon = (category: string) => {
  switch (category) {
    case 'Technical':
      return 'memory';
    case 'Cultural':
      return 'palette';
    case 'Literary':
      return 'menu_book';
    case 'Arts':
      return 'brush';
    case 'Sports':
      return 'sports_basketball';
    default:
      return 'groups';
  }
};

export default function BrowseClubs() {
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

  const handleJoin = (clubName: string) => {
    setJoinedClubs(prev => [...prev, clubName]);
    ToastService.success(
      `Your request to join ${clubName} has been sent to the admin for approval.`
    );
  };

  return (
    <FormPage
      title="Browse Clubs"
      description="Explore and join student clubs across various categories."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Student Portal', to: activitiesUrls.student.dashboard },
        { label: 'Browse Clubs' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {clubsList.map((club, idx) => {
          const hasJoined = joinedClubs.includes(club.name);
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative"
            >
              {/* Header Banner */}
              <div
                className={`h-24 ${getGradient(club.category)} relative flex items-center justify-center`}
              >
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating Icon */}
                <div className="absolute -bottom-7 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
                  <Icon
                    name={getIcon(club.category)}
                    className="text-gray-700 text-2xl"
                  />
                </div>
              </div>

              <div className="pt-10 px-5 pb-5 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {club.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2.5">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider font-bold rounded-full border border-gray-200">
                      {club.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                        club.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {club.status}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3.5 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                  <div className="flex items-center text-sm">
                    <Icon
                      name="person"
                      className="text-[18px] mr-2.5 text-blue-500"
                    />
                    <span className="flex-1 text-gray-500">President</span>
                    <span className="font-semibold text-gray-900">
                      {club.president}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Icon
                      name="calendar_month"
                      className="text-[18px] mr-2.5 text-purple-500"
                    />
                    <span className="flex-1 text-gray-500">Est.</span>
                    <span className="font-semibold text-gray-900">
                      {club.establishedYear}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Icon
                      name="groups"
                      className="text-[18px] mr-2.5 text-green-500"
                    />
                    <span className="flex-1 text-gray-500">Members</span>
                    <span className="font-semibold text-gray-900">
                      {club.memberCount}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    hasJoined
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                      : 'bg-gray-900 text-white shadow-md hover:shadow-xl hover:bg-blue-600 active:scale-[0.98]'
                  }`}
                  onClick={() => !hasJoined && handleJoin(club.name)}
                  disabled={hasJoined}
                >
                  {hasJoined ? (
                    <>
                      <Icon name="schedule" className="text-[18px]" />
                      Pending Approval
                    </>
                  ) : (
                    <>
                      <Icon name="group_add" className="text-[18px]" />
                      Join Club
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </FormPage>
  );
}
