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
import { learningUrls } from '../../urls';

const MOCK_DATA = [
  {
    id: 1,
    name: 'Course Completion Certificate',
    description: 'Awarded on completion of course',
    validity: 'Lifetime',
    isActive: true,
  },
  {
    id: 2,
    name: 'Merit Certificate',
    description: 'Awarded on excellent performance',
    validity: 'Lifetime',
    isActive: true,
  },
];

export default function CertificationMasterList() {
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
      `Certification ${popup.mode === 'create' ? 'created' : 'updated'} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Certification Master"
      description="Manage certificate templates and definitions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Certification Master' }
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { field: 'name', header: 'Certificate Name' },
            { field: 'description', header: 'Description' },
            { field: 'validity', header: 'Validity' },
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
              label="Create Certification"
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
            ? 'Create Certification'
            : 'Edit Certification'
        }
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox
            label="Certificate Name"
            defaultValue={popup.item?.name}
            required
          />
          <TextBox
            label="Validity (e.g., Lifetime, 1 Year)"
            defaultValue={popup.item?.validity}
            required
          />
          <TextArea
            label="Description"
            rows={3}
            defaultValue={popup.item?.description}
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
