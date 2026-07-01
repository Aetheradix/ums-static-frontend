import { useState } from 'react';
import { ToastService } from 'services';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { learningUrls } from '../../urls';

const INITIAL_RESULTS = [
  {
    id: 1,
    title: 'Quiz 1: C++ Syntax',
    type: 'Quiz',
    course: 'B.Tech Computer Science',
    gradedCount: '150/150',
    status: 'Draft',
  },
  {
    id: 2,
    title: 'Assignment 1: Logic Building',
    type: 'Assignment',
    course: 'B.Tech Computer Science',
    gradedCount: '148/150',
    status: 'Published',
  },
  {
    id: 3,
    title: 'Quiz 2: DBMS Joins',
    type: 'Quiz',
    course: 'B.Tech Computer Science',
    gradedCount: '140/150',
    status: 'Draft',
  },
];

export default function PublishResults() {
  const [data, setData] = useState(INITIAL_RESULTS);

  const handlePublish = (item: any) => {
    if (item.status === 'Published') {
      ToastService.error('Results are already published.');
      return;
    }
    setData(prev =>
      prev.map(r => (r.id === item.id ? { ...r, status: 'Published' } : r))
    );
    ToastService.success(`Successfully published results for: ${item.title}`);
  };

  return (
    <FormPage
      title="Publish Results"
      description="Release graded quiz and assignment scores to student portals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Assessment Management', to: learningUrls.teacher.assessment },
        { label: 'Publish Results' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'title', header: 'Assessment Title' },
            { field: 'type', header: 'Type' },
            { field: 'course', header: 'Course' },
            { field: 'gradedCount', header: 'Graded Ratio' },
            {
              field: 'status',
              header: 'Publish Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => (
                <button
                  onClick={() => handlePublish(item)}
                  className={`px-3 py-1 rounded text-xs font-semibold border ${
                    item.status === 'Published'
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer'
                  }`}
                  disabled={item.status === 'Published'}
                >
                  Publish
                </button>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
