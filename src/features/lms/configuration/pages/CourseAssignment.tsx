import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    course: 'B.Tech Computer Science',
    faculty: 'Dr. Amit Kumar',
    semester: '5th Sem',
    status: 'Active',
  },
  {
    id: 2,
    course: 'Bachelor of Computer Applications',
    faculty: 'Prof. Priya Rawat',
    semester: '3rd Sem',
    status: 'Active',
  },
  {
    id: 3,
    course: 'Master of Business Administration',
    faculty: 'Ravi Verma',
    semester: '1st Sem',
    status: 'Active',
  },
];

export default function CourseAssignment() {
  const [data] = useState(MOCK_ASSIGNMENTS);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(
      `Course assignment ${popup.mode === 'create' ? 'created' : 'updated'} successfully!`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Course Assignment"
      description="Assign courses to faculty members and define teaching semesters."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Admin Portal', to: learningUrls.admin.portal },
        { label: 'Configuration', to: learningUrls.admin.configuration },
        { label: 'Course Assignment' },
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          label="Add Course Assignment"
          icon="plus"
          variant="primary"
          onClick={() => setPopup({ mode: 'create' })}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'course', header: 'Course Name' },
            { field: 'faculty', header: 'Faculty Name' },
            { field: 'semester', header: 'Semester' },
            { field: 'status', header: 'Status' },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'New Course Assignment'
            : 'Edit Course Assignment'
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <DropDownList
            label="Course"
            data={[
              { label: 'B.Tech Computer Science', value: 'BTECH' },
              { label: 'Bachelor of Computer Applications', value: 'BCA' },
              { label: 'Master of Business Administration', value: 'MBA' },
            ]}
            textField="label"
            required
          />
          <DropDownList
            label="Faculty"
            data={[
              { label: 'Dr. Amit Kumar', value: 'amit' },
              { label: 'Prof. Priya Rawat', value: 'priya' },
              { label: 'Ravi Verma', value: 'ravi' },
            ]}
            textField="label"
            required
          />
          <TextBox label="Semester (e.g. 5th Sem)" required />
          <Button
            label="Save Assignment"
            variant="primary"
            className="w-full mt-2"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
