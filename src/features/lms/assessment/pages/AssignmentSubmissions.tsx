import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox, TextArea } from 'shared/components/forms';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_DATA = [
  {
    id: 1,
    assignmentTitle: 'Programming Basics Assignment',
    student: 'Chetan',
    date: '2026-07-20',
    marks: null,
    remarks: '',
    description: 'Uploaded my zip file containing the code.',
    file: 'chetan_assignment.zip',
  },
  {
    id: 2,
    assignmentTitle: 'DBMS Query Assignment',
    student: 'Ravi',
    date: '2026-07-21',
    marks: 8,
    remarks: 'Good job',
    description: 'SQL queries attached.',
    file: 'ravi_queries.sql',
  },
];

export default function AssignmentSubmissions() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'grade'; item?: any }>({
    mode: 'closed',
  });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(`Assignment graded successfully`);
    closePopup();
  };

  return (
    <FormPage
      title="Assignment Submissions Review"
      description="Review and grade student assignment submissions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Assessment Management', to: learningUrls.teacher.assessment },
        { label: 'Assignment Submissions Review' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'assignmentTitle', header: 'Assignment Title' },
            { field: 'student', header: 'Submitted By' },
            { field: 'date', header: 'Submission Date' },
            { field: 'marks', header: 'Marks Assigned' },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: (item: any) => (
                <Button
                  label="Review / Grade"
                  variant="outlined"
                  size="small"
                  onClick={() => setPopup({ mode: 'grade', item })}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'grade'}
        onHide={closePopup}
        title="Grade Assignment"
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-100 flex flex-col gap-2">
            <div className="text-sm font-semibold text-blue-900">
              Student Submission Details:
            </div>
            <div className="text-sm">
              <strong>Student:</strong> {popup.item?.student}
            </div>
            <div className="text-sm">
              <strong>Description:</strong> {popup.item?.description}
            </div>
            <div className="text-sm">
              <strong>Attachment:</strong>{' '}
              <a href="#" className="text-blue-600 underline font-medium">
                {popup.item?.file}
              </a>
            </div>
          </div>

          <div className="mt-2 border-t pt-2">
            <h4 className="text-sm font-semibold mb-2">Faculty Review:</h4>
            <TextBox
              label="Marks"
              type="number"
              required
              defaultValue={popup.item?.marks?.toString()}
            />
            <div className="mt-4">
              <TextArea
                label="Feedback / Remarks"
                rows={3}
                defaultValue={popup.item?.remarks}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Grade" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
