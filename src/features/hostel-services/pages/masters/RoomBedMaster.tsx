import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function RoomBedMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const [search, setSearch] = useState('');

  const initialForm = {
    hostelId: '',
    buildingId: '',
    roomNumber: '',
    roomTypeId: '',
    capacity: '',
    applyFee: 'Y',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = data.rooms.filter(r =>
    r.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Room & Bed Master"
      description="Manage individual rooms and their bed capacities."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/room-bed' },
        { label: 'Room & Bed Master' },
      ]}
    >
      <FormCard title="Add Room" icon="add_circle">
        <FormGrid columns={4}>
          <DropDownList
            label="Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <DropDownList
            label="Building *"
            data={data.buildings
              .filter(b => !form.hostelId || b.hostelId === form.hostelId)
              .map(b => ({ id: b.id, text: b.name }))}
            textField="text"
            valueField="id"
            value={form.buildingId}
            onChange={v => setForm({ ...form, buildingId: v as string })}
          />
          <TextBox
            label="Room Number *"
            value={form.roomNumber}
            onChange={v => setForm({ ...form, roomNumber: v })}
          />
          <DropDownList
            label="Room Type *"
            data={data.roomTypes.map(rt => ({ id: rt.id, text: rt.name }))}
            textField="text"
            valueField="id"
            value={form.roomTypeId}
            onChange={v => setForm({ ...form, roomTypeId: v as string })}
          />
          <TextBox
            label="Capacity (Beds) *"
            value={form.capacity}
            onChange={v => setForm({ ...form, capacity: v })}
          />
          <DropDownList
            label="Apply Fee"
            data={[
              { id: 'Y', text: 'Yes' },
              { id: 'N', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.applyFee}
            onChange={v => setForm({ ...form, applyFee: v as string })}
          />

          <DropDownList
            label="Status"
            data={[
              { id: 'Active', text: 'Active' },
              { id: 'Inactive', text: 'Inactive' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
          <DropDownList
            label="Visible"
            data={[
              { id: 'Yes', text: 'Yes' },
              { id: 'No', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.visible}
            onChange={v => setForm({ ...form, visible: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Save"
            variant="primary"
            onClick={() => {
              if (
                !form.hostelId ||
                !form.buildingId ||
                !form.roomNumber ||
                !form.roomTypeId ||
                !form.capacity
              ) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('rooms', {
                ...form,
                capacity: Number(form.capacity),
                id: `RM${Date.now()}`,
              });
              setForm(initialForm);
            }}
          />
          <Button
            label="Clear"
            variant="outlined"
            onClick={() => setForm(initialForm)}
          />
        </div>
      </FormCard>

      <FormCard title="Rooms List" icon="list">
        <div className="mb-4 w-1/3">
          <TextBox
            label=""
            placeholder="Search by room number..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            { field: 'roomNumber', header: 'Room No.' },
            {
              field: 'hostelId',
              header: 'Hostel',
              cell: (item: any) => (
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
              ),
            },
            {
              field: 'buildingId',
              header: 'Building',
              cell: (item: any) => (
                <>{data.buildings.find(b => b.id === item.buildingId)?.name}</>
              ),
            },
            {
              field: 'roomTypeId',
              header: 'Type',
              cell: (item: any) => (
                <>
                  {data.roomTypes.find(rt => rt.id === item.roomTypeId)?.name}
                </>
              ),
            },
            { field: 'capacity', header: 'Beds' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              field: 'actions',
              header: 'Action',
              cell: (item: any) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditForm(item);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 border border-gray-200 rounded shadow-sm hover:bg-gray-50 text-blue-600 flex items-center justify-center"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <Modal
        header="Edit Room"
        visible={isEditModalOpen}
        onHide={() => {
          setIsEditModalOpen(false);
          setEditForm(null);
        }}
        size="large"
      >
        {editForm && (
          <div className="p-4">
            <FormGrid columns={4}>
              <DropDownList
                label="Hostel *"
                data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
                textField="text"
                valueField="id"
                value={editForm.hostelId}
                onChange={v =>
                  setEditForm({ ...editForm, hostelId: v as string })
                }
              />
              <DropDownList
                label="Building *"
                data={data.buildings
                  .filter(
                    b => !editForm.hostelId || b.hostelId === editForm.hostelId
                  )
                  .map(b => ({ id: b.id, text: b.name }))}
                textField="text"
                valueField="id"
                value={editForm.buildingId}
                onChange={v =>
                  setEditForm({ ...editForm, buildingId: v as string })
                }
              />
              <TextBox
                label="Room Number *"
                value={editForm.roomNumber}
                onChange={v => setEditForm({ ...editForm, roomNumber: v })}
              />
              <DropDownList
                label="Room Type *"
                data={data.roomTypes.map(rt => ({ id: rt.id, text: rt.name }))}
                textField="text"
                valueField="id"
                value={editForm.roomTypeId}
                onChange={v =>
                  setEditForm({ ...editForm, roomTypeId: v as string })
                }
              />
              <TextBox
                label="Capacity (Beds) *"
                value={editForm.capacity}
                onChange={v => setEditForm({ ...editForm, capacity: v })}
              />
              <DropDownList
                label="Apply Fee"
                data={[
                  { id: 'Y', text: 'Yes' },
                  { id: 'N', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.applyFee}
                onChange={v =>
                  setEditForm({ ...editForm, applyFee: v as string })
                }
              />

              <DropDownList
                label="Status"
                data={[
                  { id: 'Active', text: 'Active' },
                  { id: 'Inactive', text: 'Inactive' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.status}
                onChange={v =>
                  setEditForm({ ...editForm, status: v as string })
                }
              />
              <DropDownList
                label="Visible"
                data={[
                  { id: 'Yes', text: 'Yes' },
                  { id: 'No', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.visible}
                onChange={v =>
                  setEditForm({ ...editForm, visible: v as string })
                }
              />
            </FormGrid>
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditForm(null);
                }}
              />
              <Button
                label="Update"
                variant="primary"
                onClick={() => {
                  if (
                    !editForm.hostelId ||
                    !editForm.buildingId ||
                    !editForm.roomNumber ||
                    !editForm.roomTypeId ||
                    !editForm.capacity
                  ) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('rooms', editForm.id, {
                    ...editForm,
                    capacity: Number(editForm.capacity),
                  });
                  setIsEditModalOpen(false);
                  setEditForm(null);
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </FormPage>
  );
}
