import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function WardenStaffMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    role: 'Warden',
    hostelId: '',
    contactNumber: '',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = data.wardenStaff.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Warden/Staff Master"
      description="Manage wardens and staff allocated to hostels."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/warden-staff' },
        { label: 'Warden/Staff Master' },
      ]}
    >
      <FormCard title="Add Staff" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
          />
          <DropDownList
            label="Role *"
            data={[
              { id: 'Warden', text: 'Warden' },
              { id: 'Deputy Warden', text: 'Deputy Warden' },
              { id: 'Caretaker', text: 'Caretaker' },
              { id: 'Security', text: 'Security' },
            ]}
            textField="text"
            valueField="id"
            value={form.role}
            onChange={v => setForm({ ...form, role: v as string })}
          />
          <DropDownList
            label="Assigned Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <TextBox
            label="Contact Number"
            value={form.contactNumber}
            onChange={v => setForm({ ...form, contactNumber: v })}
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
              if (!form.name || !form.hostelId) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('wardenStaff', {
                ...form,
                id: `WS${Date.now()}`,
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

      <FormCard title="Staff List" icon="list">
        <div className="mb-4 w-1/3">
          <TextBox
            label=""
            placeholder="Search name..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            { field: 'name', header: 'Name' },
            { field: 'role', header: 'Role' },
            {
              field: 'hostelId',
              header: 'Assigned Hostel',
              cell: (item: any) => (
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
              ),
            },
            { field: 'contactNumber', header: 'Contact' },
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
        header="Edit Staff"
        visible={isEditModalOpen}
        onHide={() => {
          setIsEditModalOpen(false);
          setEditForm(null);
        }}
        size="large"
      >
        {editForm && (
          <div className="p-4">
            <FormGrid columns={3}>
              <TextBox
                label="Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
              />
              <DropDownList
                label="Role *"
                data={[
                  { id: 'Warden', text: 'Warden' },
                  { id: 'Deputy Warden', text: 'Deputy Warden' },
                  { id: 'Caretaker', text: 'Caretaker' },
                  { id: 'Security', text: 'Security' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.role}
                onChange={v => setEditForm({ ...editForm, role: v as string })}
              />
              <DropDownList
                label="Assigned Hostel *"
                data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
                textField="text"
                valueField="id"
                value={editForm.hostelId}
                onChange={v =>
                  setEditForm({ ...editForm, hostelId: v as string })
                }
              />
              <TextBox
                label="Contact Number"
                value={editForm.contactNumber}
                onChange={v => setEditForm({ ...editForm, contactNumber: v })}
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
                  if (!editForm.name || !editForm.hostelId) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('wardenStaff', editForm.id, editForm);
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
