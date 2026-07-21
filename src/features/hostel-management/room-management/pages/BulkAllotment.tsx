import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function BulkAllotment() {
  const { hostels, studentApplications, triggerNotification } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [course, setCourse] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleBulkAllot = () => {
    if (!hostelId) {
      triggerNotification('Please select a hostel', 'error');
      return;
    }
    // In a real system, this would call an API that runs the auto-allocation engine.
    triggerNotification(
      'Bulk allotment process started. It may take a few minutes.'
    );
  };

  const eligibleCount = studentApplications.filter(
    a => a.status === 'APPROVED' && (!hostelId || a.hostelId === hostelId)
  ).length;

  return (
    <FormPage
      title="Bulk Room Allotment"
      description="Trigger the auto-allotment engine to allocate rooms to multiple students based on defined rules"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Bulk Allotment' },
      ]}
    >
      <FormCard title="Auto Allotment Engine" icon="precision_manufacturing">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Filter by Course (Optional)"
            data={[
              { id: 'BTech', text: 'B.Tech' },
              { id: 'MTech', text: 'M.Tech' },
              { id: 'MBA', text: 'MBA' },
            ]}
            value={course}
            onChange={(v: any) => setCourse(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <div className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
            Eligible Applications: {eligibleCount}
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Clicking the button below will automatically allocate available
            rooms to the eligible approved applications for the selected hostel,
            based on the configuration rules (First Come First Serve, Distance,
            or Merit).
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            label="Run Bulk Allotment"
            variant="primary"
            onClick={handleBulkAllot}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
