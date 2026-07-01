import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function AchievementAwardTypeMasterPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    quotaPoints: '',
  });

  const typeOptions = [
    { id: 'Gold Medal', name: 'Gold Medal' },
    { id: 'Silver Medal', name: 'Silver Medal' },
    { id: 'Bronze Medal', name: 'Bronze Medal' },
    {
      id: 'Certificate of Participation',
      name: 'Certificate of Participation',
    },
    { id: 'Best Player', name: 'Best Player' },
  ];

  const mockData = [
    {
      id: 1,
      type: 'Gold Medal',
      description: 'Winner of Inter-University Event',
      quotaPoints: 50,
    },
    {
      id: 2,
      type: 'Silver Medal',
      description: 'Runner-up of Inter-University Event',
      quotaPoints: 30,
    },
    {
      id: 3,
      type: 'Certificate of Participation',
      description: 'Participant in any recognized event',
      quotaPoints: 10,
    },
  ];

  const handleSave = () => {
    ToastService.success('Award type saved successfully!');
    setFormData({
      type: '',
      description: '',
      quotaPoints: '',
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Achievement / Award Type Master"
      description="Configure types of recognitions and sports quota points."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Master Configuration' },
        { label: 'Achievements' },
      ]}
    >
      <FormCard
        title="Achievement Types List"
        headerAction={
          <Button
            label="Add New Award Type"
            icon="plus"
            type="button"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        }
      >
        <GridPanel
          data={mockData}
          columns={[
            { field: 'type', header: 'Achievement Type' },
            { field: 'description', header: 'Description' },
            {
              header: 'Sports Quota Points',
              cell: (item: any) => (
                <StatusBadge
                  variant="neutral"
                  label={`+${item.quotaPoints} Pts`}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Add New Award Type"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              type="button"
              variant="outlined"
              onClick={() => setShowPopup(false)}
            />
            <Button
              label="Save Award Type"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <DropDownList
            label="Achievement Type"
            data={typeOptions}
            textField="name"
            valueField="id"
            placeholder="Select an Achievement Type"
            required
            value={formData.type}
            onChange={(val: any) => setFormData({ ...formData, type: val })}
          />
          <TextBox
            label="Description"
            placeholder="Brief description of the award"
            required
            value={formData.description}
            onChange={(val: any) =>
              setFormData({ ...formData, description: val })
            }
          />
          <TextBox
            label="Sports Quota Points"
            type="number"
            placeholder="e.g. 50"
            required
            value={formData.quotaPoints}
            onChange={(val: any) =>
              setFormData({ ...formData, quotaPoints: val })
            }
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
