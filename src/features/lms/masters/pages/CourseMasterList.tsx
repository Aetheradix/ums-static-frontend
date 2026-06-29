import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';
import StatusButton from 'shared/components/buttons/StatusButton';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_DATA = [
  {
    id: 1,
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    category: 'Technical',
    duration: '3 Years',
    isActive: true,
  },
  {
    id: 2,
    code: 'BCOM',
    name: 'Bachelor of Commerce',
    category: 'Non-Technical',
    duration: '3 Years',
    isActive: true,
  },
  {
    id: 3,
    code: 'MBA',
    name: 'Master of Business Administration',
    category: 'Academic',
    duration: '2 Years',
    isActive: true,
  },
  {
    id: 4,
    code: 'BTECH',
    name: 'Bachelor of Technology',
    category: 'Technical',
    duration: '4 Years',
    isActive: true,
  },
];

export default function CourseMasterList() {
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
      `Course ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Course Master"
      description="Manage courses across the institution."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Course Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'code', header: 'Course Code' },
            { field: 'name', header: 'Course Name' },
            { field: 'category', header: 'Category' },
            { field: 'duration', header: 'Duration' },
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
              label="Create Course"
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
        title={popup.mode === 'create' ? 'Create Course' : 'Edit Course'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextBox
            label="Course Code"
            defaultValue={popup.item?.code}
            required
          />
          <TextBox
            label="Course Name"
            defaultValue={popup.item?.name}
            required
          />
          <DropDownList
            label="Course Category"
            defaultValue={popup.item?.category}
            textField="label"
            data={[
              { label: 'Technical', value: 'Technical' },
              { label: 'Non-Technical', value: 'Non-Technical' },
              { label: 'Certification', value: 'Certification' },
              { label: 'Academic', value: 'Academic' },
            ]}
            required
          />
          <TextBox
            label="Duration (Months/Years)"
            defaultValue={popup.item?.duration}
            required
          />
          <div className="md:col-span-2">
            <TextArea
              label="Description"
              rows={3}
              defaultValue={popup.item?.name}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
