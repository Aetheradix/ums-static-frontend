import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { useFeeStore, type Course as CourseType } from '../store/useFeeStore';
import { ToastService } from 'services';

export default function CourseMaster() {
  const { courses, addCourse, updateCourse } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: CourseType;
  }>({ mode: 'closed' });
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreateOpen = () => {
    setName('');
    setCode('');
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (course: CourseType) => {
    setName(course.name);
    setCode(course.code);
    setPopup({ mode: 'edit', data: course });
  };

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      ToastService.error('Course Name and Code are required');
      return;
    }
    if (popup.mode === 'create') {
      addCourse({ name, code });
      ToastService.success('Course created successfully.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateCourse(popup.data.id, name, code);
      ToastService.success('Course updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Course Master"
      description="Define new courses and map them with appropriate details."
    >
      <FormCard>
        <GridPanel
          data={courses}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'code', header: 'Course Code' },
            { field: 'name', header: 'Course Name' },
          ]}
          toolbar={
            <Button
              label="Create Course"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'Create Course' : 'Edit Course'}
        subtitle="Specify course details."
      >
        <div className="flex flex-col gap-4 py-2">
          <TextBox
            label="Course Code"
            placeholder="e.g. BT-CSE"
            value={code}
            onChange={val => setCode(val.toUpperCase())}
            required
          />
          <TextBox
            label="Course Name"
            placeholder="e.g. B.Tech Computer Science"
            value={name}
            onChange={setName}
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
