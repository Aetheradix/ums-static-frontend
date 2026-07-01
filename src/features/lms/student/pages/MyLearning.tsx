import { useState } from 'react';
import { ToastService } from 'services';
import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import {
  mockCourses,
  mockModules,
  mockTopics,
  mockContent,
  type ContentItem,
} from '../../mocks';
import { learningUrls } from '../../urls';

export default function MyLearning() {
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[2]); // B.Tech CS by default
  const [selectedModule, setSelectedModule] = useState(mockModules[0]); // Programming Basics
  const [selectedTopic, setSelectedTopic] = useState(mockTopics[0]); // Introduction to C++
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(mockContent[0]);

  const courseModules = mockModules.filter(m => m.courseId === selectedCourse.id);
  const moduleTopics = mockTopics.filter(t => t.moduleId === selectedModule.id);
  const topicContents = mockContent.filter(c => c.topicId === selectedTopic.id);

  const handleCourseChange = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      const mods = mockModules.filter(m => m.courseId === course.id);
      if (mods.length > 0) {
        setSelectedModule(mods[0]);
        const tops = mockTopics.filter(t => t.moduleId === mods[0].id);
        if (tops.length > 0) {
          setSelectedTopic(tops[0]);
          const contents = mockContent.filter(c => c.topicId === tops[0].id);
          setSelectedContent(contents.length > 0 ? contents[0] : null);
        } else {
          setSelectedContent(null);
        }
      }
    }
  };

  const handleModuleChange = (mod: any) => {
    setSelectedModule(mod);
    const tops = mockTopics.filter(t => t.moduleId === mod.id);
    if (tops.length > 0) {
      setSelectedTopic(tops[0]);
      const contents = mockContent.filter(c => c.topicId === tops[0].id);
      setSelectedContent(contents.length > 0 ? contents[0] : null);
    } else {
      setSelectedContent(null);
    }
  };

  const handleTopicChange = (topic: any) => {
    setSelectedTopic(topic);
    const contents = mockContent.filter(c => c.topicId === topic.id);
    setSelectedContent(contents.length > 0 ? contents[0] : null);
  };

  return (
    <FormPage
      title="My Learning Workspace"
      description="View course curriculum, play video lectures, and read lecture slides."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'My Learning' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left Column: Selector */}
        <div className="space-y-4">
          <FormCard title="Select Course">
            <select
              value={selectedCourse.id}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              {mockCourses
                .filter(c => c.status === 'Active')
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </FormCard>

          <FormCard title="Course Syllabus" className="p-2">
            <div className="space-y-3">
              {courseModules.map(mod => (
                <div key={mod.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <button
                    onClick={() => handleModuleChange(mod)}
                    className={`w-full text-left font-bold text-sm py-1 flex items-center justify-between cursor-pointer ${
                      selectedModule.id === mod.id ? 'text-indigo-600' : 'text-gray-800'
                    }`}
                  >
                    <span>{mod.name}</span>
                    <Icon name={selectedModule.id === mod.id ? 'keyboard_arrow_down' : 'keyboard_arrow_right'} />
                  </button>

                  {selectedModule.id === mod.id && (
                    <div className="mt-2 ml-3 space-y-1 border-l-2 border-indigo-100 pl-3">
                      {moduleTopics.map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicChange(topic)}
                          className={`w-full text-left py-1 text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                            selectedTopic.id === topic.id ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-50'
                          }`}
                        >
                          <Icon name="subdirectory_arrow_right" className="text-xxs text-gray-400" />
                          <span>{topic.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FormCard>
        </div>

        {/* Right Column: Content Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <FormCard title="Module Topics & Material List">
            <div className="flex gap-2 flex-wrap mb-4">
              {topicContents.length === 0 ? (
                <span className="text-xs text-gray-400 font-medium">No files uploaded for this topic.</span>
              ) : (
                topicContents.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContent(c)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                      selectedContent?.id === c.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      name={
                        c.type === 'Video'
                          ? 'play_circle'
                          : c.type === 'PDF'
                          ? 'picture_as_pdf'
                          : c.type === 'PPT'
                          ? 'slideshow'
                          : 'description'
                      }
                      className="text-sm"
                    />
                    <span>{c.title}</span>
                  </button>
                ))
              )}
            </div>

            {/* Viewer Stage */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[350px] flex flex-col justify-center">
              {selectedContent ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{selectedContent.title}</h4>
                      <p className="text-xxs text-gray-500 mt-0.5">{selectedContent.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xxs font-bold bg-indigo-100 text-indigo-700">
                      {selectedContent.type}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    {selectedContent.type === 'Video' ? (
                      <div className="w-full max-w-xl">
                        {/* Video Player */}
                        <video
                          src={selectedContent.url}
                          controls
                          className="w-full rounded-lg border shadow-sm"
                        />
                      </div>
                    ) : selectedContent.type === 'PDF' ? (
                      <div className="w-full text-center py-6 flex flex-col items-center justify-center">
                        <Icon name="picture_as_pdf" className="text-5xl text-red-500 mb-2" />
                        <h5 className="font-bold text-gray-800 text-sm">{selectedContent.title}</h5>
                        <p className="text-xxs text-gray-400 mt-1">Size: {selectedContent.size || '1.5 MB'}</p>
                        <button
                          onClick={() => window.open(selectedContent.url, '_blank')}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                          Open Document Viewer
                        </button>
                      </div>
                    ) : (
                      // PPT or Notes Viewer
                      <div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600">
                          <Icon name={selectedContent.type === 'PPT' ? 'slideshow' : 'description'} />
                          <span className="text-xs font-bold uppercase tracking-wider">{selectedContent.type} Reader</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {selectedContent.description}
                        </p>
                        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-dashed flex justify-between items-center">
                          <span className="text-xxs text-gray-500 font-semibold">Download file for offline use.</span>
                          <button
                            onClick={() => ToastService.success('File downloaded successfully.')}
                            className="px-3 py-1 bg-gray-800 text-white text-xxs font-bold rounded cursor-pointer"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Icon name="local_library" className="text-4xl mb-2" />
                  <p className="text-xs font-semibold">Please select a topic material to view content.</p>
                </div>
              )}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
