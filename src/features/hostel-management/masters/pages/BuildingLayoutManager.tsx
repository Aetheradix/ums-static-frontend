import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function BuildingLayoutManager() {
  const { hostels, buildings, setBuildings, triggerNotification } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [acType, setAcType] = useState('NON_AC');

  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const activeBuildings = buildings.filter(b => b.hostelId === hostelId);
  const buildingOptions = activeBuildings.map(b => ({
    id: b.id,
    text: b.name,
  }));
  const activeFloors =
    buildings.find(b => b.id === selectedBuildingId)?.floors || [];
  const floorOptions = activeFloors.map(f => ({
    id: f.id,
    text: `Floor ${f.floorNumber}`,
  }));

  const handleAddBuilding = () => {
    if (!hostelId || !buildingName)
      return triggerNotification(
        'Select hostel & enter building name',
        'error'
      );
    const newBuilding: HostelManagement.Building = {
      id: `B-${Date.now()}`,
      name: buildingName,
      hostelId,
      floors: [],
    };
    setBuildings([...buildings, newBuilding]);
    triggerNotification('Building added');
    setBuildingName('');
  };

  const handleAddFloor = () => {
    if (!selectedBuildingId || !floorNumber)
      return triggerNotification('Select building & enter floor num', 'error');
    setBuildings(prev =>
      prev.map(b => {
        if (b.id === selectedBuildingId) {
          return {
            ...b,
            floors: [
              ...b.floors,
              {
                id: `F-${Date.now()}`,
                floorNumber: parseInt(floorNumber),
                buildingId: b.id,
                rooms: [],
              },
            ],
          };
        }
        return b;
      })
    );
    triggerNotification('Floor added');
    setFloorNumber('');
  };

  const handleAddRoom = () => {
    if (!selectedFloorId || !roomNumber || !capacity)
      return triggerNotification('Fill room details', 'error');
    setBuildings(prev =>
      prev.map(b => {
        if (b.id === selectedBuildingId) {
          return {
            ...b,
            floors: b.floors.map(f => {
              if (f.id === selectedFloorId) {
                const newRoom: HostelManagement.Room = {
                  id: `R-${Date.now()}`,
                  roomNumber,
                  floorId: f.id,
                  roomTypeId: '', // Should be selected from RoomTypes
                  roomTypeName: '',
                  capacity: parseInt(capacity),
                  occupiedBeds: 0,
                  acType: acType as any,
                  status: 'AVAILABLE',
                  beds: Array.from({ length: parseInt(capacity) }).map(
                    (_, i) => ({
                      id: `BED-${Date.now()}-${i}`,
                      bedNumber: `${roomNumber}-${i + 1}`,
                      roomId: '',
                      status: 'VACANT',
                    })
                  ),
                  assetChecklist: [],
                };
                return { ...f, rooms: [...f.rooms, newRoom] };
              }
              return f;
            }),
          };
        }
        return b;
      })
    );
    triggerNotification('Room added');
    setRoomNumber('');
    setCapacity('');
  };

  return (
    <FormPage
      title="Building Layout Manager"
      description="Manage Buildings, Floors, and Rooms"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Layout Manager' },
      ]}
    >
      <FormCard title="Select Hostel" icon="apartment">
        <FormGrid columns={1}>
          <OptionDropDown
            label="Select Hostel"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>
      </FormCard>

      {hostelId && (
        <>
          <FormCard title="Manage Buildings" icon="business">
            <div className="flex gap-4 items-end">
              <TextBox
                label="New Building Name"
                value={buildingName}
                onChange={setBuildingName}
                placeholder="e.g. Block A"
              />
              <Button
                label="Add Building"
                variant="primary"
                onClick={handleAddBuilding}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeBuildings.map(b => (
                <div
                  key={b.id}
                  className="p-2 border rounded bg-slate-50 dark:bg-slate-800"
                >
                  {b.name} ({b.floors.length} Floors)
                </div>
              ))}
            </div>
          </FormCard>

          <div className="grid grid-cols-2 gap-4">
            <FormCard title="Manage Floors" icon="layers">
              <OptionDropDown
                label="Select Building"
                data={buildingOptions}
                value={selectedBuildingId}
                onChange={(v: any) => setSelectedBuildingId(v)}
                textField="text"
                valueField="id"
              />
              {selectedBuildingId && (
                <div className="mt-4 flex gap-4 items-end">
                  <TextBox
                    label="Floor Number"
                    type="number"
                    value={floorNumber}
                    onChange={setFloorNumber}
                    placeholder="e.g. 1"
                  />
                  <Button
                    label="Add Floor"
                    variant="primary"
                    onClick={handleAddFloor}
                  />
                </div>
              )}
            </FormCard>

            <FormCard title="Manage Rooms" icon="meeting_room">
              <OptionDropDown
                label="Select Floor"
                data={floorOptions}
                value={selectedFloorId}
                onChange={(v: any) => setSelectedFloorId(v)}
                textField="text"
                valueField="id"
              />
              {selectedFloorId && (
                <div className="mt-4 space-y-4">
                  <FormGrid columns={2}>
                    <TextBox
                      label="Room No."
                      value={roomNumber}
                      onChange={setRoomNumber}
                    />
                    <TextBox
                      label="Capacity"
                      type="number"
                      value={capacity}
                      onChange={setCapacity}
                    />
                    <OptionDropDown
                      label="AC Type"
                      data={[
                        { id: 'AC', text: 'AC' },
                        { id: 'NON_AC', text: 'Non-AC' },
                      ]}
                      value={acType}
                      onChange={(v: any) => setAcType(v)}
                      textField="text"
                      valueField="id"
                    />
                  </FormGrid>
                  <Button
                    label="Add Room"
                    variant="primary"
                    onClick={handleAddRoom}
                  />
                </div>
              )}
            </FormCard>
          </div>
        </>
      )}
    </FormPage>
  );
}
