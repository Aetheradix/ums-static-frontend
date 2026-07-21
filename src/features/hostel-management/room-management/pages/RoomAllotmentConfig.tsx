import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function RoomAllotmentConfig() {
  const { hostels, triggerNotification } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [allocationStrategy, setAllocationStrategy] = useState(
    'FIRST_COME_FIRST_SERVE'
  );
  const [coursePriority, setCoursePriority] = useState('');
  const [distanceThreshold, setDistanceThreshold] = useState('50');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSave = () => {
    if (!hostelId) {
      triggerNotification('Please select a hostel', 'error');
      return;
    }
    triggerNotification('Allotment Configuration saved successfully');
  };

  return (
    <FormPage
      title="Room Allotment Configuration"
      description="Configure auto-allotment strategies and rules for a hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Configuration' },
      ]}
    >
      <FormCard title="Configuration Settings" icon="settings">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />

          <OptionDropDown
            label="Allocation Strategy *"
            data={[
              {
                id: 'FIRST_COME_FIRST_SERVE',
                text: 'First Come First Serve (Application Date)',
              },
              { id: 'DISTANCE_BASED', text: 'Distance Based (Farthest First)' },
              { id: 'MERIT_BASED', text: 'Merit Based (GPA/Marks)' },
            ]}
            value={allocationStrategy}
            onChange={(v: any) => setAllocationStrategy(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Distance Threshold (Km)"
            type="number"
            value={distanceThreshold}
            onChange={setDistanceThreshold}
            placeholder="Minimum distance to be eligible"
          />

          <TextBox
            label="Course/Branch Priority"
            value={coursePriority}
            onChange={setCoursePriority}
            placeholder="e.g. CS > ME > CE"
          />
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button
          label="Save Configuration"
          variant="primary"
          onClick={handleSave}
        />
        <Button
          label="Reset Defaults"
          variant="outlined"
          onClick={() => {
            setAllocationStrategy('FIRST_COME_FIRST_SERVE');
            setDistanceThreshold('50');
            setCoursePriority('');
          }}
        />
      </div>
    </FormPage>
  );
}
