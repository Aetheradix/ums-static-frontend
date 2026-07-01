import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function FacilityMasterPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    supportedSports: '',
    capacity: '',
    timeSlots: '',
    active: true,
  });

  const typeOptions = [
    { id: 'Ground', name: 'Ground' },
    { id: 'Court', name: 'Court' },
    { id: 'Gym', name: 'Gym' },
    { id: 'Pool', name: 'Pool' },
    { id: 'Indoor Hall', name: 'Indoor Hall' },
  ];

  const sportsOptions = [
    { id: 'Cricket', name: 'Cricket' },
    { id: 'Badminton', name: 'Badminton' },
    { id: 'Athletics', name: 'Athletics' },
  ];

  const mockData = [
    {
      id: 1,
      name: 'Main Cricket Ground',
      type: 'Ground',
      supportedSports: 'Cricket, Athletics',
      capacity: 5000,
      timeSlots: '6-8 AM, 4-6 PM',
      active: true,
    },
    {
      id: 2,
      name: 'Indoor Badminton Court 1',
      type: 'Court',
      supportedSports: 'Badminton',
      capacity: 100,
      timeSlots: '6AM-8PM',
      active: true,
    },
    {
      id: 3,
      name: 'University Pool',
      type: 'Pool',
      supportedSports: 'Swimming',
      capacity: 50,
      timeSlots: '6-10 AM, 4-8 PM',
      active: false,
    },
  ];

  const handleSave = () => {
    ToastService.success('Facility saved successfully!');
    setFormData({
      name: '',
      type: '',
      supportedSports: '',
      capacity: '',
      timeSlots: '',
      active: true,
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Facility Master"
      description="Manage grounds, courts, gyms, swimming pools, and indoor halls."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Master Configuration' },
        { label: 'Facilities' },
      ]}
    >
      <FormCard
        title="Facility List"
        headerAction={
          <Button
            label="Add New Facility"
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
            { field: 'name', header: 'Facility Name' },
            { field: 'type', header: 'Type' },
            { field: 'supportedSports', header: 'Supported Sports' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'timeSlots', header: 'Time Slots' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={item.active ? 'approved' : 'rejected'}
                  label={item.active ? 'Active' : 'Inactive'}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Add New Facility"
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
              label="Save Facility"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <TextBox
            label="Facility Name"
            placeholder="e.g. Main Cricket Ground"
            required
            value={formData.name}
            onChange={(val: any) => setFormData({ ...formData, name: val })}
          />
          <DropDownList
            label="Facility Type"
            data={typeOptions}
            textField="name"
            valueField="id"
            placeholder="Select a Facility Type"
            required
            value={formData.type}
            onChange={(val: any) => setFormData({ ...formData, type: val })}
          />
          <DropDownList
            label="Supported Sport(s)"
            data={sportsOptions}
            textField="name"
            valueField="id"
            placeholder="Select Sport(s)"
            required
            value={formData.supportedSports}
            onChange={(val: any) =>
              setFormData({ ...formData, supportedSports: val })
            }
          />
          <TextBox
            label="Capacity"
            type="number"
            placeholder="Max players/spectators"
            value={formData.capacity}
            onChange={(val: any) => setFormData({ ...formData, capacity: val })}
          />
          <TextBox
            label="Available Time Slots"
            placeholder="e.g. 6-8 AM, 4-6 PM"
            required
            value={formData.timeSlots}
            onChange={(val: any) =>
              setFormData({ ...formData, timeSlots: val })
            }
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Active Status
            </label>
            <Switch
              checked={formData.active}
              onChange={(val: any) => setFormData({ ...formData, active: val })}
            />
          </div>
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
