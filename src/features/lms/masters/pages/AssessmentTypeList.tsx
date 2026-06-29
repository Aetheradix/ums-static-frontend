import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_DATA = [
  { id: 1, name: 'Quiz' },
  { id: 2, name: 'Assignment' },
  { id: 3, name: 'Mid-Term' },
  { id: 4, name: 'Final Exam' },
];

export default function AssessmentTypeList() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(
      `Assessment Type ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Assessment Type Master"
      description="Manage different types of assessments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Assessment Type Master' }
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[{ field: 'name', header: 'Assessment Name' }]}
          toolbar={
            <Button
              label="Create Assessment Type"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Create Assessment Type'
            : 'Edit Assessment Type'
        }
        size="default"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox
            label="Assessment Name"
            defaultValue={popup.item?.name}
            required
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
