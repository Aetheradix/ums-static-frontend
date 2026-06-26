import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  useFeeStore,
  type Semester as SemesterType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function SemesterMaster() {
  const { semesters, addSemester, updateSemester } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    data?: SemesterType;
  }>({ mode: 'closed' });
  const [name, setName] = useState('');

  const handleCreateOpen = () => {
    setName('');
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (semester: SemesterType) => {
    setName(semester.name);
    setPopup({ mode: 'edit', data: semester });
  };

  const handleSave = () => {
    if (!name.trim()) {
      ToastService.error('Semester Name is required');
      return;
    }
    if (popup.mode === 'create') {
      addSemester({ name });
      ToastService.success('Semester created successfully.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateSemester(popup.data.id, name);
      ToastService.success('Semester updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Semester Master"
      description="Configure and manage academic semesters (e.g. Semester I, Semester II)."
    >
      <FormCard>
        <GridPanel
          data={semesters}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'name', header: 'Semester Name' },
          ]}
          toolbar={
            <Button
              label="Create Semester"
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
        title={popup.mode === 'create' ? 'Create Semester' : 'Edit Semester'}
        subtitle="Specify semester details."
      >
        <div className="flex flex-col gap-4 py-2">
          <TextBox
            label="Semester Name"
            placeholder="e.g. Semester I"
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
