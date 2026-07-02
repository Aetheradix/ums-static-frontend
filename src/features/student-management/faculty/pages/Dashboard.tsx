import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

export default function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Faculty Academic Dashboard"
      description="Overview of your assigned classes, assessments, and student progress."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Faculty Portal', to: studentManagementUrls.faculty.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  My Students
                </p>
                <h2 className="text-3xl font-black text-gray-900">120</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                <i className="pi pi-users text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                <i className="pi pi-arrow-up text-xs"></i> 5%
              </span>
              <span>vs last semester</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Assessments Due
                </p>
                <h2 className="text-3xl font-black text-red-600">3</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                <i className="pi pi-file-edit text-xl"></i>
              </div>
            </div>
            <Button
              label="Enter Marks"
              text
              size="small"
              onClick={() =>
                navigate(studentManagementUrls.faculty.internalAssessment)
              }
              className="p-0 font-bold text-red-600 relative z-10"
            />
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  At-Risk Students
                </p>
                <h2 className="text-3xl font-black text-gray-900">5</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                <i className="pi pi-exclamation-circle text-xl"></i>
              </div>
            </div>
            <Button
              label="Track Progress"
              text
              size="small"
              onClick={() => navigate(studentManagementUrls.faculty.progress)}
              className="p-0 font-bold text-green-600 relative z-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormCard title="My Active Classes" className="h-full">
            <div className="flex flex-col gap-4 mt-2">
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-indigo-50/30 transition-colors group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Data Structures & Algorithms (CS301)
                    </h3>
                    <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1">
                      B.Tech CSE - Sec A
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white bg-indigo-${i * 100 + 300}`}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-100">
                      +57
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Syllabus Covered
                  </span>
                  <ProgressBar
                    value={75}
                    className="flex-1 h-2"
                    color="#6366f1"
                    showValue={false}
                  />
                  <span className="text-xs font-black text-indigo-700 w-8">
                    75%
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-orange-50/30 transition-colors group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Operating Systems (CS302)
                    </h3>
                    <span className="text-sm font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded inline-block mt-1">
                      B.Tech CSE - Sec B
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {[4, 5, 6].map(i => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white bg-orange-${i * 100}`}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-100">
                      +57
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Syllabus Covered
                  </span>
                  <ProgressBar
                    value={40}
                    className="flex-1 h-2"
                    color="#f97316"
                    showValue={false}
                  />
                  <span className="text-xs font-black text-orange-700 w-8">
                    40%
                  </span>
                </div>
              </div>
            </div>
          </FormCard>

          <FormCard title="Quick Tasks" className="h-full">
            <ul className="flex flex-col gap-3 mt-2">
              <li className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <i className="pi pi-file-edit text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                      Enter Mid-Term Marks
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Due in 2 days (CS301)
                    </p>
                  </div>
                </div>
                <Button
                  icon="pi pi-chevron-right"
                  rounded
                  text
                  onClick={() =>
                    navigate(studentManagementUrls.faculty.internalAssessment)
                  }
                  className="text-gray-400 group-hover:text-indigo-600"
                />
              </li>
              <li className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <i className="pi pi-chart-line text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      Review Low Attendance
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      3 students below 75% in CS302
                    </p>
                  </div>
                </div>
                <Button
                  icon="pi pi-chevron-right"
                  rounded
                  text
                  onClick={() =>
                    navigate(studentManagementUrls.faculty.progress)
                  }
                  className="text-gray-400 group-hover:text-blue-600"
                />
              </li>
            </ul>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
