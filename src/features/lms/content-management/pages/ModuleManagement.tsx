import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormPopup } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_MODULES = [
  {
    id: 1,
    name: 'Programming Basics',
    topics: ['Introduction', 'Variables', 'Data Types', 'Loops'],
  },
  {
    id: 2,
    name: 'DBMS',
    topics: ['SQL Basics', 'Joins', 'Normalization'],
  },
];

export default function ModuleManagement() {
  const [data] = useState(MOCK_MODULES);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'module' | 'topic';
    moduleId?: number;
  }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(
      `${popup.mode === 'module' ? 'Module' : 'Topic'} saved successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Module Management"
      description="Manage modules and their topics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Module Management' }
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          label="Create Module"
          icon="plus"
          variant="primary"
          onClick={() => setPopup({ mode: 'module' })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(mod => (
          <FormCard key={mod.id} title={mod.name} className="flex flex-col">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-700 mb-2">Topics</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                {mod.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-end">
              <Button
                label="Add Topic"
                size="small"
                variant="outlined"
                icon="plus"
                onClick={() => setPopup({ mode: 'topic', moduleId: mod.id })}
              />
            </div>
          </FormCard>
        ))}
      </div>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'module' ? 'Create Module' : 'Add Topic'}
        size="default"
      >
        <div className="grid grid-cols-1 gap-4">
          {popup.mode === 'module' ? (
            <>
              <DropDownList
                label="Course"
                textField="label"
                data={[
                  { label: 'Bachelor of Computer Applications', value: 'BCA' },
                  { label: 'Bachelor of Commerce', value: 'BCOM' },
                  { label: 'Master of Business Administration', value: 'MBA' },
                  { label: 'Bachelor of Technology', value: 'BTECH' },
                ]}
                required
              />
              <TextBox label="Module Name" required />
            </>
          ) : (
            <TextBox label="Topic Name" required />
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
