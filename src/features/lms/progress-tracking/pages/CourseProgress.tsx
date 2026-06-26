import { useState } from 'react';
import { FormPage, FormCard, GridPanel, FormPopup } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

const MOCK_DATA = [
  { id: 1, student: 'Chetan', course: 'BCA', progress: 75, status: 'In Progress', items: [
      { name: 'Video 1', status: 'Completed' },
      { name: 'Video 2', status: 'Completed' },
      { name: 'Quiz', status: 'Pending' },
      { name: 'Assignment', status: 'Submitted' }
  ]},
  { id: 2, student: 'Ravi', course: 'MBA', progress: 100, status: 'Completed', items: [
      { name: 'Video 1', status: 'Completed' },
      { name: 'Quiz', status: 'Completed' }
  ]},
];

export default function CourseProgress() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'view'; item?: any }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  return (
    <FormPage title="Course Progress Report" description="Monitor student progression across courses.">
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'student', header: 'Student Name' },
            { field: 'course', header: 'Course' },
            { 
              field: 'progress', 
              header: 'Progress',
              cell: (item: any) => (
                <div className="flex items-center gap-2 w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                </div>
              )
            },
            { 
              field: 'status', 
              header: 'Status',
              cell: (item: any) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              )
            },
            {
               field: 'actions',
               header: 'Details',
               sortable: false,
               cell: (item: any) => (
                 <Button label="Track Items" size="small" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
               )
            }
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Progress Details - ${popup.item?.student}`}
        size="lg"
      >
        <div className="mb-4">
           <div className="text-sm font-semibold mb-2">Overall Progress: {popup.item?.progress}%</div>
           <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${popup.item?.progress}%` }}></div>
           </div>
        </div>

        <h4 className="text-sm font-semibold border-b pb-2 mb-2">Tracked Items</h4>
        <div className="flex flex-col gap-2">
           {popup.item?.items.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 border rounded">
                 <span className="text-sm">{it.name}</span>
                 <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    it.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    it.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                 }`}>{it.status}</span>
              </div>
           ))}
        </div>
        
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button label="Close" variant="outlined" onClick={closePopup} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
