import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { DropDownList, DatePicker } from 'shared/components/forms';
import StatusButton from 'shared/components/buttons/StatusButton';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

const MOCK_DATA = [
  {
    id: 1,
    course: 'BCA',
    faculty: 'Amit Sir',
    effectiveDate: '2026-08-01',
    isActive: true,
  },
  {
    id: 2,
    course: 'MBA',
    faculty: 'Rahul Sir',
    effectiveDate: '2026-08-01',
    isActive: true,
  },
];

export default function FacultyMapping() {
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
      `Faculty Mapping ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Faculty Mapping"
      description="Assign faculty members to specific courses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Faculty Mapping' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'course', header: 'Course' },
            { field: 'faculty', header: 'Faculty' },
            { field: 'effectiveDate', header: 'Effective Date' },
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
              label="Assign Faculty"
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
        title={popup.mode === 'create' ? 'Assign Faculty' : 'Edit Assignment'}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <DropDownList
            label="Course"
            defaultValue={popup.item?.course}
            textField="label"
            data={[
              { label: 'BCA', value: 'BCA' },
              { label: 'MBA', value: 'MBA' },
            ]}
            required
          />
          <DropDownList
            label="Faculty Member"
            defaultValue={popup.item?.faculty}
            textField="label"
            data={[
              { label: 'Amit Sir', value: 'Amit Sir' },
              { label: 'Rahul Sir', value: 'Rahul Sir' },
            ]}
            required
          />
          <DatePicker
            label="Effective Date"
            defaultValue={popup.item?.effectiveDate}
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
