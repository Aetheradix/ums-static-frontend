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

const MOCK_MAPPINGS = [
  { id: 1, batch: '2023-2027', course: 'B.Tech Computer Science', semester: '5th Sem', section: 'Section A', status: 'Active' },
  { id: 2, batch: '2024-2027', course: 'Bachelor of Computer Applications', semester: '3rd Sem', section: 'Section B', status: 'Active' },
  { id: 3, batch: '2025-2027', course: 'Master of Business Administration', semester: '1st Sem', section: 'Section A', status: 'Active' },
];

export default function BatchMapping() {
  const [data] = useState(MOCK_MAPPINGS);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' | 'edit'; item?: any }>({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(`Batch mapping ${popup.mode === 'create' ? 'created' : 'updated'} successfully!`);
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Batch/Semester Mapping"
      description="Map courses and batches to specific academic semesters and sections."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Admin Portal', to: learningUrls.admin.portal },
        { label: 'Configuration', to: learningUrls.admin.configuration },
        { label: 'Batch/Semester Mapping' },
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          label="Add Batch Mapping"
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
            { field: 'batch', header: 'Batch / Session' },
            { field: 'course', header: 'Course Name' },
            { field: 'semester', header: 'Semester' },
            { field: 'section', header: 'Section' },
            { field: 'status', header: 'Status' },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'New Batch Mapping' : 'Edit Batch Mapping'}
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox label="Batch / Session (e.g. 2023-2027)" required />
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
          <TextBox label="Semester" required />
          <TextBox label="Section (e.g. Section A)" required />
          <Button
            label="Save Mapping"
            variant="primary"
            className="w-full mt-2"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
