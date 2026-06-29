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
  { id: 1, name: 'Video' },
  { id: 2, name: 'PDF' },
  { id: 3, name: 'PPT' },
  { id: 4, name: 'Assignment' },
  { id: 5, name: 'Document' },
];

export default function ContentTypeList() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(
      `Content Type ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Content Type Master"
      description="Manage different types of learning content."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Content Type Master' }
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[{ field: 'name', header: 'Content Type Name' }]}
          toolbar={
            <Button
              label="Create Content Type"
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
          popup.mode === 'create' ? 'Create Content Type' : 'Edit Content Type'
        }
        size="default"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox
            label="Content Type Name"
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
