import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox, TextArea } from 'shared/components/forms';
import StatusButton from 'shared/components/buttons/StatusButton';
import { ToastService } from 'services';

const MOCK_DATA = [
  {
    id: 1,
    name: 'Technical',
    description: 'Technical degree programs',
    isActive: true,
  },
  {
    id: 2,
    name: 'Non-Technical',
    description: 'Non-Technical programs',
    isActive: true,
  },
  {
    id: 3,
    name: 'Certification',
    description: 'Short term certification programs',
    isActive: true,
  },
  {
    id: 4,
    name: 'Academic',
    description: 'Core academic programs',
    isActive: true,
  },
];

export default function CourseCategoryList() {
  const [data, setData] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });

  const handleToggleStatus = (item: any) => {
    const updated = data.map(d =>
      d.id === item.id ? { ...d, isActive: !d.isActive } : d
    );
    setData(updated);
    ToastService.success('Status updated successfully');
  };

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(
      `Course Category ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Course Category Master"
      description="Manage categories for courses."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'name', header: 'Category Name' },
            { field: 'description', header: 'Description' },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: any) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Category"
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
        title={popup.mode === 'create' ? 'Create Category' : 'Edit Category'}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox
            label="Category Name"
            defaultValue={popup.item?.name}
            required
          />
          <TextArea
            label="Description"
            defaultValue={popup.item?.description}
            rows={3}
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
