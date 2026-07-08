import { useState } from 'react';
import { Checkbox, DropDownList, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';
import '../hostel.css';
import { ROOM_FACILITY_OPTIONS } from '../data';

type RoomForm = {
  hostelCode: string;
  roomNumber: string;
  roomName: string;
  floorNumber: string;
  blockWing: string;
  roomType: string;
  totalBeds: string;
  facilities: string[];
  category: string;
  additionalCharges: string;
  status: string;
  active: string;
};

const BLANK_FORM: RoomForm = {
  hostelCode: '',
  roomNumber: '',
  roomName: '',
  floorNumber: '',
  blockWing: '',
  roomType: 'Double Seater',
  totalBeds: '2',
  facilities: [],
  category: 'Standard',
  additionalCharges: '0',
  status: 'Available',
  active: 'Active',
};

const ROOM_TYPE_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Single Seater', text: 'Single Seater' },
  { id: 'Double Seater', text: 'Double Seater' },
  { id: 'Triple Seater', text: 'Triple Seater' },
  { id: 'Dormitory', text: 'Dormitory' },
];

const BED_COUNT_OPTIONS: Data.DataItem<string>[] = [1, 2, 3, 4, 6, 8].map(
  n => ({ id: String(n), text: String(n) })
);

const CATEGORY_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Standard', text: 'Standard' },
  { id: 'AC', text: 'AC' },
  { id: 'Premium', text: 'Premium' },
  { id: 'Deluxe', text: 'Deluxe' },
];

const STATUS_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Available', text: 'Available' },
  { id: 'Full', text: 'Full' },
  { id: 'Maintenance', text: 'Maintenance' },
];

export default function RoomConfiguration() {
  const { hostels, rooms, setRooms, setHostels, triggerNotification } =
    useHostel();
  const [form, setForm] = useState<RoomForm>({ ...BLANK_FORM });
  const [filterHostelCode, setFilterHostelCode] = useState<string | null>(null);

  const set = <K extends keyof RoomForm>(key: K, value: RoomForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Build hostel dropdown data from live context
  const hostelDropdown: Data.DataItem<string>[] = hostels.map(h => ({
    id: h.code,
    text: h.name,
  }));

  const hostelFilterDropdown: Data.DataItem<string | null>[] = [
    { id: null, text: 'All Hostels' },
    ...hostelDropdown,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hostelCode || !form.roomNumber) {
      triggerNotification(
        'Hostel selection and Room Number are required.',
        'error'
      );
      return;
    }
    const duplicate = rooms.some(
      r => r.hostelCode === form.hostelCode && r.roomNumber === form.roomNumber
    );
    if (duplicate) {
      triggerNotification(
        `Room ${form.roomNumber} already exists in this hostel.`,
        'error'
      );
      return;
    }
    const matchedHostel = hostels.find(h => h.code === form.hostelCode);
    const beds = parseInt(form.totalBeds) || 1;
    setRooms(prev => [
      ...prev,
      {
        ...form,
        hostelName: matchedHostel ? matchedHostel.name : 'Unknown',
        totalBeds: beds,
        occupiedBeds: 0,
        availableBeds: beds,
        additionalCharges: parseFloat(form.additionalCharges) || 0,
      },
    ]);
    setHostels(prev =>
      prev.map(h =>
        h.code === form.hostelCode
          ? {
              ...h,
              rooms: h.rooms + 1,
              beds: h.beds + beds,
              available: h.available + beds,
            }
          : h
      )
    );
    triggerNotification(`Room ${form.roomNumber} registered successfully!`);
    setForm({ ...BLANK_FORM });
  };

  const handleDelete = (hostelCode: string, roomNumber: string) => {
    const target = rooms.find(
      r => r.hostelCode === hostelCode && r.roomNumber === roomNumber
    );
    if (target && target.occupiedBeds > 0) {
      triggerNotification(
        'Cannot delete a room with active students assigned.',
        'error'
      );
      return;
    }
    setRooms(prev =>
      prev.filter(
        r => !(r.hostelCode === hostelCode && r.roomNumber === roomNumber)
      )
    );
    setHostels(prev =>
      prev.map(h =>
        h.code === hostelCode
          ? {
              ...h,
              rooms: Math.max(0, h.rooms - 1),
              beds: Math.max(0, h.beds - (target?.totalBeds ?? 0)),
              available: Math.max(0, h.available - (target?.totalBeds ?? 0)),
            }
          : h
      )
    );
    triggerNotification('Room deleted successfully.');
  };

  const filteredRooms = filterHostelCode
    ? rooms.filter(r => r.hostelCode === filterHostelCode)
    : rooms;

  return (
    <FormPage
      title="Room Configuration"
      description="Define wings, floors, and bed counts for each registered hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Room Configuration' },
      ]}
    >
      {/* â”€â”€ Room Form â”€â”€ */}
      <FormCard title="Configure New Room" icon="key">
        <form onSubmit={handleSubmit}>
          <FormGrid columns={3}>
            <DropDownList
              label="Select Hostel *"
              data={hostelDropdown}
              textField="text"
              valueField="id"
              value={form.hostelCode}
              onChange={v => set('hostelCode', v as string)}
              defaultOptionText="â€” Select Hostel â€”"
            />
            <TextBox
              label="Room Number *"
              placeholder="e.g. 101"
              value={form.roomNumber}
              onChange={v => set('roomNumber', v)}
            />
            <TextBox
              label="Room Name / Label"
              placeholder="Ground Floor Block A - 101"
              value={form.roomName}
              onChange={v => set('roomName', v)}
            />
            <TextBox
              label="Floor Number"
              placeholder="1"
              value={form.floorNumber}
              onChange={v => set('floorNumber', v)}
            />
            <TextBox
              label="Block / Wing"
              placeholder="A-Wing"
              value={form.blockWing}
              onChange={v => set('blockWing', v)}
            />
            <DropDownList
              label="Room Type"
              data={ROOM_TYPE_OPTIONS}
              textField="text"
              valueField="id"
              value={form.roomType}
              onChange={v => set('roomType', v as string)}
            />
            <DropDownList
              label="Total Beds"
              data={BED_COUNT_OPTIONS}
              textField="text"
              valueField="id"
              value={form.totalBeds}
              onChange={v => set('totalBeds', v as string)}
            />
            <DropDownList
              label="Category"
              data={CATEGORY_OPTIONS}
              textField="text"
              valueField="id"
              value={form.category}
              onChange={v => set('category', v as string)}
            />
            <TextBox
              label="Additional Charges (â‚¹)"
              placeholder="0"
              value={form.additionalCharges}
              onChange={v => set('additionalCharges', v)}
            />
            <DropDownList
              label="Status"
              data={STATUS_OPTIONS}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v => set('status', v as string)}
            />
          </FormGrid>

          <div className="mt-4">
            <p className="hm-section-heading">Room Facilities</p>
            <FormGrid columns={4}>
              {ROOM_FACILITY_OPTIONS.map(f => (
                <Checkbox
                  key={f}
                  label={f}
                  checked={form.facilities.includes(f)}
                  onChange={checked => {
                    if (checked) {
                      set('facilities', [...form.facilities, f]);
                    } else {
                      set(
                        'facilities',
                        form.facilities.filter(x => x !== f)
                      );
                    }
                  }}
                />
              ))}
            </FormGrid>
          </div>

          <div className="form-actions-row mt-4">
            <Button
              label="Add Room"
              icon="plus"
              variant="primary"
              type="submit"
            />
            <Button
              label="Reset"
              variant="outlined"
              onClick={() => setForm({ ...BLANK_FORM })}
            />
          </div>
        </form>
      </FormCard>

      {/* â”€â”€ Room List â”€â”€ */}
      <FormCard title="Configured Rooms" icon="list">
        <div className="mb-4">
          <DropDownList
            label=""
            data={hostelFilterDropdown as Data.DataItem<string>[]}
            textField="text"
            valueField="id"
            value={filterHostelCode}
            onChange={v => setFilterHostelCode(v as string | null)}
          />
        </div>
        <GridPanel
          data={filteredRooms}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'hostelCode', header: 'Hostel' },
            { field: 'roomNumber', header: 'Room No.' },
            { field: 'roomName', header: 'Label' },
            { field: 'roomType', header: 'Type' },
            { field: 'totalBeds', header: 'Beds' },
            { field: 'availableBeds', header: 'Available' },
            { field: 'category', header: 'Category' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: HostelManagement.Room) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status === 'Full'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: HostelManagement.Room) => (
                <Button
                  label="Delete"
                  icon="trash"
                  variant="danger"
                  onClick={() => handleDelete(item.hostelCode, item.roomNumber)}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}


