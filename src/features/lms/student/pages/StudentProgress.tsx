import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { studentProgress } from '../../mocks';
import { learningUrls } from '../../urls';

export default function StudentProgress() {
  const [data] = useState(studentProgress);

  return (
    <FormPage
      title="My Learning Progress"
      description="Detailed analysis of your course completion rate, module stats and grade point history."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'Progress' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left Column: Progress details per course */}
        <div className="lg:col-span-2 space-y-4">
          <FormCard title="Enrolled Course Completion Rates">
            <div className="space-y-6">
              {data.map(cp => (
                <div
                  key={cp.courseId}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        {cp.courseName}
                      </h4>
                      <p className="text-xxs text-gray-400 mt-0.5">
                        Modules: {cp.completedModules} completed /{' '}
                        {cp.totalModules} total
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xxs font-bold ${
                        cp.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {cp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          cp.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${cp.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-10 text-right">
                      {cp.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>

          <FormCard title="Module Milestone Logs">
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: 'Web Technologies (BCA)',
                  date: 'June 10, 2026',
                  status: 'Completed',
                  icon: 'check_circle',
                  color: 'text-green-500 bg-green-50',
                },
                {
                  id: 2,
                  name: 'Programming Basics (B.Tech CS)',
                  date: 'June 28, 2026',
                  status: 'Completed',
                  icon: 'check_circle',
                  color: 'text-green-500 bg-green-50',
                },
                {
                  id: 3,
                  name: 'Database Management Systems (B.Tech CS)',
                  date: 'Active',
                  status: 'In Progress (60%)',
                  icon: 'sync',
                  color: 'text-blue-500 bg-blue-50',
                },
                {
                  id: 4,
                  name: 'Data Structures & Algorithms (B.Tech CS)',
                  date: 'Queue',
                  status: 'Not Started',
                  icon: 'schedule',
                  color: 'text-gray-400 bg-gray-50',
                },
              ].map(m => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-3 border border-gray-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full flex items-center justify-center ${m.color}`}
                    >
                      <Icon name={m.icon} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800">
                        {m.name}
                      </h5>
                      <p className="text-xxs text-gray-400 mt-0.5">
                        Milestone Status: {m.status}
                      </p>
                    </div>
                  </div>
                  <span className="text-xxs text-gray-400 font-semibold">
                    {m.date}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>
        </div>

        {/* Right Column: Grade Point Average and Stats */}
        <div className="space-y-4">
          <FormCard title="Assessment Analytics" className="text-center p-6">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 inline-block mb-4">
              <span className="text-xxs text-indigo-600 uppercase tracking-wider font-bold">
                CURRENT CGPA
              </span>
              <div className="text-4xl font-extrabold text-indigo-700 mt-1">
                9.24 / 10
              </div>
              <span className="text-xxs text-indigo-600 font-bold block mt-1">
                Academic Standing: Outstanding
              </span>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex justify-between text-xs py-1 border-b">
                <span className="text-gray-500 font-medium">
                  Quiz Passing Ratio
                </span>
                <span className="text-gray-800 font-bold">
                  100% (2 Passed / 2 Attempted)
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b">
                <span className="text-gray-500 font-medium">
                  Assignment Submissions
                </span>
                <span className="text-gray-800 font-bold">
                  100% (2 Submitted)
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b">
                <span className="text-gray-500 font-medium">
                  Attendance Rate
                </span>
                <span className="text-green-600 font-bold">87%</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-gray-500 font-medium">
                  Total Learning Hours
                </span>
                <span className="text-gray-800 font-bold">42.5 hrs</span>
              </div>
            </div>
          </FormCard>

          <FormCard title="Study Hours Distribution">
            <div className="space-y-2">
              {[
                {
                  type: 'Video Lectures',
                  hours: '22 hrs',
                  pct: '52%',
                  bg: 'bg-blue-600',
                },
                {
                  type: 'Assessments & Practice',
                  hours: '12 hrs',
                  pct: '28%',
                  bg: 'bg-indigo-600',
                },
                {
                  type: 'Reading PDF Notes',
                  hours: '8.5 hrs',
                  pct: '20%',
                  bg: 'bg-purple-600',
                },
              ].map((h, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between text-xxs font-semibold text-gray-500 mb-1">
                    <span>{h.type}</span>
                    <span>
                      {h.hours} ({h.pct})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div
                      className={`h-1.5 rounded-full ${h.bg}`}
                      style={{ width: h.pct }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
