import { useState } from 'react';
import { FormPage } from 'shared/new-components';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  size: string;
  uploadDate: string;
}

const mockMaterials: CourseMaterial[] = [
  {
    id: 'M-01',
    title: 'Chapter 1: Introduction to Algorithms',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2026-07-01',
  },
  {
    id: 'M-02',
    title: 'Lecture 2 Recording',
    type: 'video',
    size: '145 MB',
    uploadDate: '2026-07-03',
  },
  {
    id: 'M-03',
    title: 'Chapter 2: Sorting and Searching',
    type: 'pdf',
    size: '3.1 MB',
    uploadDate: '2026-07-05',
  },
];

export default function LMS() {
  const [activeCourse, setActiveCourse] = useState('CS-301');

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'pi-file-pdf text-red-500';
      case 'video':
        return 'pi-video text-blue-500';
      case 'link':
        return 'pi-link text-gray-500';
      default:
        return 'pi-file';
    }
  };

  return (
    <FormPage
      title="Learning Management System"
      description="Access course materials, lecture notes, and video recordings"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - Course List */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <h4 className="font-bold text-gray-700 m-0 mb-2 px-2 uppercase tracking-wider text-xs">
            My Courses (Sem 3)
          </h4>

          <div
            className={`p-4 rounded-lg border cursor-pointer transition-all ${activeCourse === 'CS-301' ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveCourse('CS-301')}
          >
            <div className="font-bold text-gray-800">Advanced Algorithms</div>
            <div className="text-xs text-gray-500 mt-1">
              CS-301 • Prof. Smith
            </div>
            <ProgressBar
              value={45}
              showValue={false}
              style={{ height: '4px' }}
              className="mt-3"
              color="#3b82f6"
            ></ProgressBar>
            <div className="text-[10px] text-right text-gray-400 mt-1">
              45% Completed
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border cursor-pointer transition-all ${activeCourse === 'CS-302' ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveCourse('CS-302')}
          >
            <div className="font-bold text-gray-800">Database Systems</div>
            <div className="text-xs text-gray-500 mt-1">
              CS-302 • Dr. Johnson
            </div>
            <ProgressBar
              value={20}
              showValue={false}
              style={{ height: '4px' }}
              className="mt-3"
              color="#3b82f6"
            ></ProgressBar>
            <div className="text-[10px] text-right text-gray-400 mt-1">
              20% Completed
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
              <h2 className="text-3xl font-black m-0 mb-2">
                Advanced Algorithms
              </h2>
              <p className="text-blue-100 m-0">
                Mastering complex data structures and algorithmic paradigms.
              </p>
              <div className="flex gap-4 mt-6">
                <div className="bg-blue-800/50 px-3 py-1 rounded text-sm">
                  <i className="pi pi-users mr-2"></i>120 Students Enrolled
                </div>
                <div className="bg-blue-800/50 px-3 py-1 rounded text-sm">
                  <i className="pi pi-star-fill text-yellow-400 mr-2"></i>4.8
                  Instructor Rating
                </div>
              </div>
            </div>

            <TabView className="px-2">
              <TabPanel
                header="Course Materials"
                leftIcon="pi pi-folder-open mr-2"
              >
                <div className="flex flex-col gap-4 py-4 px-2">
                  {mockMaterials.map(mat => (
                    <div
                      key={mat.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                          <i
                            className={`pi ${getIconForType(mat.type)} text-xl`}
                          ></i>
                        </div>
                        <div>
                          <h5 className="m-0 font-bold text-gray-800 group-hover:text-blue-700">
                            {mat.title}
                          </h5>
                          <div className="text-xs text-gray-500 mt-1">
                            Uploaded {mat.uploadDate} • {mat.size}
                          </div>
                        </div>
                      </div>
                      <Button
                        icon="pi pi-cloud-download"
                        rounded
                        text
                        severity="secondary"
                        aria-label="Download"
                      />
                    </div>
                  ))}
                </div>
              </TabPanel>
              <TabPanel header="Announcements" leftIcon="pi pi-megaphone mr-2">
                <div className="py-4 px-2">
                  <div className="border-l-4 border-orange-500 pl-4 py-2 mb-6">
                    <h5 className="m-0 font-bold text-gray-800">
                      Mid-term Syllabus Update
                    </h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Please note that Chapter 4 (Dynamic Programming) will be
                      included in the upcoming mid-term examination next week.
                    </p>
                    <span className="text-xs text-gray-400">
                      Posted by Prof. Smith on 2026-07-06
                    </span>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Discussions" leftIcon="pi pi-comments mr-2">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <i className="pi pi-comments text-5xl text-gray-300 mb-4"></i>
                  <h5 className="font-bold text-gray-600">
                    No Discussions Yet
                  </h5>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Start a thread to ask questions or discuss course topics
                    with your peers.
                  </p>
                  <Button
                    label="Start a Thread"
                    icon="pi pi-plus"
                    className="mt-4"
                    outlined
                  />
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
