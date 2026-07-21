import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function RoomTypeMaster() {
  const { roomTypes, setRoomTypes, triggerNotification } = useHostel();
  const [showList, setShowList] = useState(false);

  const [roomTypeName, setRoomTypeName] = useState('');
  const [occupancyCapacity, setOccupancyCapacity] = useState('');
  const [acType, setAcType] = useState('NON_AC');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [cautionDeposit, setCautionDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const reset = () => {
    setRoomTypeName('');
    setOccupancyCapacity('');
    setAcType('NON_AC');
    setMonthlyFee('');
    setCautionDeposit('');
    setDescription('');
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!roomTypeName || !occupancyCapacity || !monthlyFee || !cautionDeposit) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }
    const newRT: HostelManagement.RoomType = {
      id: `RT-${Date.now()}`,
      roomTypeName,
      occupancyCapacity: parseInt(occupancyCapacity),
      acType: acType as any,
      monthlyFee: parseFloat(monthlyFee),
      cautionDeposit: parseFloat(cautionDeposit),
      defaultAmenities: [],
      description,
      status: status as any,
    };
    setRoomTypes([...roomTypes, newRT]);
    triggerNotification('Room Type saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Room Type Master"
        description="Manage different room configurations"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Room Type Master' },
        ]}
      >
        <FormCard title="Room Types" icon="bed">
          <Button
            label="New Room Type"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Capacity</th>
                  <th className="p-2">AC/Non-AC</th>
                  <th className="p-2">Monthly Fee</th>
                  <th className="p-2">Caution Deposit</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map(rt => (
                  <tr
                    key={rt.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{rt.roomTypeName}</td>
                    <td className="p-2">{rt.occupancyCapacity}</td>
                    <td className="p-2">{rt.acType}</td>
                    <td className="p-2">₹{rt.monthlyFee}</td>
                    <td className="p-2">₹{rt.cautionDeposit}</td>
                    <td className="p-2">{rt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Room Type Master"
      description="Create a new room type configuration"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Room Type Master' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Room Type Details" icon="bed">
        <FormGrid columns={3}>
          <TextBox
            label="Room Type Name *"
            value={roomTypeName}
            onChange={setRoomTypeName}
            placeholder="e.g. Single Seater AC"
          />
          <TextBox
            label="Occupancy Capacity *"
            type="number"
            value={occupancyCapacity}
            onChange={setOccupancyCapacity}
          />
          <OptionDropDown
            label="AC / Non-AC"
            data={[
              { id: 'AC', text: 'AC' },
              { id: 'NON_AC', text: 'Non-AC' },
            ]}
            value={acType}
            onChange={(v: any) => setAcType(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Monthly Fee (₹) *"
            type="number"
            value={monthlyFee}
            onChange={setMonthlyFee}
          />
          <TextBox
            label="Caution Deposit (₹) *"
            type="number"
            value={cautionDeposit}
            onChange={setCautionDeposit}
          />
          <OptionDropDown
            label="Status"
            data={[
              { id: 'ACTIVE', text: 'Active' },
              { id: 'INACTIVE', text: 'Inactive' },
            ]}
            value={status}
            onChange={(v: any) => setStatus(v)}
            textField="text"
            valueField="id"
          />

          <div className="col-span-3">
            <TextBox
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Brief details about the room type..."
            />
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button label="Save Room Type" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
