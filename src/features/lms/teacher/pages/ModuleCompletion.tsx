import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { learningUrls } from '../../urls';

const MOCK_MODULE_COMPLETION = [
  {
    id: 1,
    course: 'B.Tech Computer Science',
    moduleName: 'Programming Basics',
    section: 'Section A',
    completionRate: '95%',
    status: 'Completed',
  },
  {
    id: 2,
    course: 'B.Tech Computer Science',
    moduleName: 'Database Management Systems',
    section: 'Section A',
    completionRate: '60%',
    status: 'In Progress',
  },
  {
    id: 3,
    course: 'B.Tech Computer Science',
    moduleName: 'Data Structures & Algorithms',
    section: 'Section A',
    completionRate: '0%',
    status: 'Not Started',
  },
];

export default function ModuleCompletion() {
  const [data] = useState(MOCK_MODULE_COMPLETION);

  return (
    <FormPage
      title="Module Completion Status"
      description="Track module completion rates across course sections."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Progress Tracking', to: learningUrls.teacher.progress },
        { label: 'Module Completion' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'course', header: 'Course' },
            { field: 'moduleName', header: 'Module Name' },
            { field: 'section', header: 'Section' },
            { field: 'completionRate', header: 'Completion Rate' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
