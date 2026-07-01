import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { Button } from 'shared/components/buttons';
import { learningUrls } from '../../urls';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const kpis = [
    {
      label: 'Enrolled Courses',
      value: '3',
      icon: 'local_library',
      bg: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Completed Courses',
      value: '1',
      icon: 'check_circle',
      bg: 'bg-green-50 text-green-600',
    },
    {
      label: 'Ongoing Courses',
      value: '2',
      icon: 'play_circle',
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending Courses',
      value: '0',
      icon: 'hourglass_empty',
      bg: 'bg-gray-50 text-gray-600',
    },
    {
      label: 'Quiz Completed',
      value: '2',
      icon: 'quiz',
      bg: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Assignment Completed',
      value: '2',
      icon: 'assignment',
      bg: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Certificates Earned',
      value: '2',
      icon: 'workspace_premium',
      bg: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Overall Progress',
      value: '82%',
      icon: 'trending_up',
      bg: 'bg-teal-50 text-teal-600',
    },
  ];

  return (
    <FormPage
      title="Student Learning Dashboard"
      description="Track your course lectures, upcoming quiz deadlines, and certificate achievements."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* 8 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
        {kpis.map((kpi, idx) => (
          <FormCard key={idx} className="flex items-center gap-4 p-4">
            <div
              className={`${kpi.bg} p-3 rounded-lg flex items-center justify-center`}
            >
              <Icon name={kpi.icon} />
            </div>
            <div>
              <div className="text-gray-500 text-xxs sm:text-xs font-medium">
                {kpi.label}
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800 mt-0.5">
                {kpi.value}
              </div>
            </div>
          </FormCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Continue Learning Widget */}
        <FormCard title="Continue Learning" className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 text-white p-3 rounded-lg flex items-center justify-center">
                <Icon name="play_arrow" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">
                  B.Tech Computer Science
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Current Module: Data Structures & Algorithms
                </p>
                <div className="flex items-center gap-2 mt-2 w-48">
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                  <span className="text-xxs font-bold text-indigo-700">
                    78%
                  </span>
                </div>
              </div>
            </div>
            <Button
              label="Resume Learning"
              variant="primary"
              size="small"
              className="mt-4 sm:mt-0"
              onClick={() => navigate(learningUrls.student.myLearning)}
            />
          </div>
        </FormCard>

        {/* Upcoming Deadlines */}
        <FormCard title="Upcoming Deadlines">
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'Quiz 2: DBMS Joins',
                date: 'July 18, 2026',
                type: 'Quiz',
                color: 'text-orange-600 bg-orange-50',
              },
              {
                id: 2,
                title: 'Assignment 3: OOP Payroll',
                date: 'July 28, 2026',
                type: 'Assignment',
                color: 'text-indigo-600 bg-indigo-50',
              },
            ].map(d => (
              <div
                key={d.id}
                className="flex justify-between items-center p-2 border border-gray-100 rounded-lg"
              >
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{d.title}</h5>
                  <p className="text-xxs text-gray-400 mt-0.5">Due: {d.date}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xxs font-bold ${d.color}`}
                >
                  {d.type}
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Latest Materials */}
        <FormCard title="Latest Learning Materials">
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'C++ Pointers Lecture',
                type: 'Video',
                icon: 'play_circle',
              },
              {
                id: 2,
                title: 'Pointer Arithmetic Reference',
                type: 'PDF',
                icon: 'picture_as_pdf',
              },
              {
                id: 3,
                title: 'Structure vs Class Notes',
                type: 'Notes',
                icon: 'description',
              },
            ].map(m => (
              <div key={m.id} className="flex items-center gap-3 p-1">
                <div className="text-gray-400">
                  <Icon name={m.icon} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-gray-800">
                    {m.title}
                  </h5>
                  <p className="text-xxs text-gray-400">{m.type}</p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Achievement Cards (Badges) */}
        <FormCard title="My Achievements (Badges)">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: 'Fast Learner',
                desc: 'Completed module in 1 day',
                icon: 'bolt',
                bg: 'bg-yellow-50 border-yellow-200 text-yellow-600',
              },
              {
                title: 'Perfect Score',
                desc: 'Got 100% on C++ Quiz',
                icon: 'stars',
                bg: 'bg-blue-50 border-blue-200 text-blue-600',
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl text-center ${b.bg}`}
              >
                <Icon name={b.icon} className="text-2xl mb-1" />
                <h5 className="text-xs font-bold text-gray-800">{b.title}</h5>
                <p className="text-xxs text-gray-500 mt-0.5 leading-tight">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Recent Certificates */}
        <FormCard title="Recent Certificates">
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'Advanced Programming in C++',
                date: 'Issued May 12, 2026',
              },
              {
                id: 2,
                title: 'Database Systems & SQL',
                date: 'Issued June 18, 2026',
              },
            ].map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="bg-yellow-50 text-yellow-600 p-2 rounded-lg flex items-center justify-center border border-yellow-100">
                  <Icon name="workspace_premium" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{c.title}</h5>
                  <p className="text-xxs text-gray-400 mt-0.5">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
