import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, GridPanel, FormPopup } from 'shared/new-components';
import { DropDownList, DatePicker, TextBox } from 'shared/components/forms';
import { ToastService } from 'services';

const MOCK_DATA = [
  { id: 1, student: 'Chetan', enrollmentNo: 'EN2026001', course: 'BCA', session: 'Fall 2026', enrollmentDate: '2026-07-15' },
  { id: 2, student: 'Ravi', enrollmentNo: 'EN2026002', course: 'MBA', session: 'Fall 2026', enrollmentDate: '2026-07-16' },
];

export default function StudentEnrollment() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' | 'edit' | 'view'; item?: any }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(`Student Enrollment ${popup.mode === 'create' ? 'created' : 'updated'} successfully`);
    closePopup();
  };

  return (
    <FormPage title="Student Enrollment" description="Enroll students into courses for a session.">
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={(item) => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'enrollmentNo', header: 'Enrollment No' },
            { field: 'student', header: 'Student Name' },
            { field: 'course', header: 'Course' },
            { field: 'session', header: 'Session' },
            { field: 'enrollmentDate', header: 'Enrollment Date' },
          ]}
          toolbar={
            <Button label="Enroll Student" icon="plus" variant="primary" onClick={() => setPopup({ mode: 'create' })} />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'view' ? 'View Enrollment' : popup.mode === 'create' ? 'Enroll Student' : 'Edit Enrollment'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextBox label="Student Name/ID" defaultValue={popup.item?.student} required disabled={popup.mode === 'view'} />
          <TextBox label="Enrollment Number" defaultValue={popup.item?.enrollmentNo} required disabled={popup.mode === 'view'} />
          <DropDownList label="Course" defaultValue={popup.item?.course} textField="label" data={[{ label: 'BCA', value: 'BCA' }, { label: 'MBA', value: 'MBA' }]} required disabled={popup.mode === 'view'} />
          <DropDownList label="Session" defaultValue={popup.item?.session} textField="label" data={[{ label: 'Fall 2026', value: 'Fall 2026' }]} required disabled={popup.mode === 'view'} />
          <DatePicker label="Enrollment Date" defaultValue={popup.item?.enrollmentDate} required disabled={popup.mode === 'view'} />
        </div>
        {popup.mode !== 'view' && (
          <div className="flex justify-end gap-2 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
