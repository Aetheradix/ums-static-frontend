import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useParams, useNavigate } from 'react-router-dom';

export default function CheckInDetails() {
  const { allotmentId } = useParams<{ allotmentId: string }>();
  const navigate = useNavigate();
  const {
    roomAllotments,
    setRoomAllotments,
    checkInRecords,
    setCheckInRecords,
    roomAssets,
    triggerNotification,
  } = useHostel();

  const allotment = roomAllotments.find(a => a.id === allotmentId);
  const [remarks, setRemarks] = useState('');

  if (!allotment) {
    return (
      <div className="p-8 text-center text-red-500">Allotment not found.</div>
    );
  }

  // Find default assets for the room type (mock logic assumes we know the room type)
  const defaultAssets = roomAssets.map(a => ({
    ...a,
    checked: true,
    condition: 'NEW',
  }));

  const [assets, setAssets] = useState(defaultAssets);

  const handleCheckIn = () => {
    const newCheckIn: HostelManagement.CheckInRecord = {
      id: `CHK-${Date.now()}`,
      allotmentId: allotment.id,
      studentId: allotment.studentId,
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toTimeString().split(' ')[0],
      assetsHandedOver: assets
        .filter(a => a.checked)
        .map(a => ({
          assetId: a.id,
          assetName: a.assetName,
          condition: a.condition,
        })),
      remarks,
      checkedInBy: 'Admin',
    };

    setCheckInRecords([...checkInRecords, newCheckIn]);
    setRoomAllotments(prev =>
      prev.map(a =>
        a.id === allotment.id ? { ...a, status: 'CHECKED_IN' } : a
      )
    );

    triggerNotification('Check-In completed successfully!', 'success');
    navigate('/hostel-management/room-management/check-in-list');
  };

  return (
    <FormPage
      title="Process Student Check-In"
      description="Handover room assets and confirm check-in"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        {
          label: 'Check-In',
          to: '/hostel-management/room-management/check-in-list',
        },
        { label: 'Details' },
      ]}
    >
      <Button
        label="Back to List"
        icon="arrow_back"
        variant="outlined"
        onClick={() =>
          navigate('/hostel-management/room-management/check-in-list')
        }
      />

      <div className="mt-4">
        <FormCard title="Student & Room Details" icon="person">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Student Name</span>
              <span className="font-semibold">{allotment.studentName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Hostel</span>
              <span className="font-semibold">{allotment.hostelName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Room Number</span>
              <span className="font-semibold">{allotment.roomNumber}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Bed</span>
              <span className="font-semibold">{allotment.bedNumber}</span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Asset Handover Checklist" icon="inventory">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2 w-16">Select</th>
                <th className="p-2">Asset Name</th>
                <th className="p-2">Condition on Handover</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={asset.checked}
                      onChange={e => {
                        const newAssets = [...assets];
                        newAssets[index].checked = e.target.checked;
                        setAssets(newAssets);
                      }}
                      className="w-5 h-5 rounded border-slate-300"
                    />
                  </td>
                  <td className="p-2">{asset.assetName}</td>
                  <td className="p-2">
                    <select
                      value={asset.condition}
                      onChange={e => {
                        const newAssets = [...assets];
                        newAssets[index].condition = e.target.value;
                        setAssets(newAssets);
                      }}
                      className="border p-1 rounded bg-white dark:bg-slate-800"
                    >
                      <option value="NEW">New</option>
                      <option value="USED_GOOD">Used (Good)</option>
                      <option value="USED_FAIR">Used (Fair)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>

        <FormCard title="Check-In Finalization" icon="how_to_reg">
          <FormGrid columns={1}>
            <TextBox
              label="Check-In Remarks"
              value={remarks}
              onChange={setRemarks}
              placeholder="Any notes regarding condition or missing items..."
            />
          </FormGrid>
          <div className="mt-6 flex gap-3">
            <Button
              label="Complete Check-In"
              variant="primary"
              onClick={handleCheckIn}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
