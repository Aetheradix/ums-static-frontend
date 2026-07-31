import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function HostelMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    code: '',
    type: 'Boys',
    affiliatedCampus: '',
    totalCapacity: '',
    wardenName: '',
    deputyWarden: '',
    address: '',
    cctvCoverage: 'Y',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = data.hostels.filter(
    h =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Hostel Master"
      description="Manage all hostel buildings across the university."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/hostel' },
        { label: 'Hostel Master' },
      ]}
    >
      <FormCard title="Add Hostel" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Hostel Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
            placeholder="e.g. Boys Hostel A"
          />
          <TextBox
            label="Hostel Code *"
            value={form.code}
            onChange={v => setForm({ ...form, code: v })}
            placeholder="e.g. BHA"
          />
          <DropDownList
            label="Hostel Type *"
            data={[
              { id: 'Boys', text: 'Boys' },
              { id: 'Girls', text: 'Girls' },
              { id: 'Co-ed', text: 'Co-ed' },
            ]}
            textField="text"
            valueField="id"
            value={form.type}
            onChange={v => setForm({ ...form, type: v as string })}
          />

          <TextBox
            label="Affiliated Campus"
            value={form.affiliatedCampus}
            onChange={v => setForm({ ...form, affiliatedCampus: v })}
          />
          <TextBox
            label="Total Capacity"
            value={form.totalCapacity}
            onChange={v => setForm({ ...form, totalCapacity: v })}
          />
          <TextBox
            label="Address"
            value={form.address}
            onChange={v => setForm({ ...form, address: v })}
          />

          <TextBox
            label="Warden Name"
            value={form.wardenName}
            onChange={v => setForm({ ...form, wardenName: v })}
          />
          <TextBox
            label="Deputy Warden"
            value={form.deputyWarden}
            onChange={v => setForm({ ...form, deputyWarden: v })}
          />

          <DropDownList
            label="CCTV Coverage"
            data={[
              { id: 'Y', text: 'Yes' },
              { id: 'N', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.cctvCoverage}
            onChange={v => setForm({ ...form, cctvCoverage: v as string })}
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
              if (!form.name || !form.code || !form.type) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('hostels', {
                ...form,
                totalCapacity: Number(form.totalCapacity) || 0,
                id: `H${Date.now()}`,
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

      <FormCard title="Registered Hostels" icon="list">
        <div className="mb-4 w-1/3">
          <TextBox
            label=""
            placeholder="Search by name or code..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'type', header: 'Type' },
            { field: 'affiliatedCampus', header: 'Campus' },
            { field: 'totalCapacity', header: 'Capacity' },
            { field: 'wardenName', header: 'Warden' },
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
              field: 'visible',
              header: 'Visible',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${item.visible === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                >
                  {item.visible}
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
        header="Edit Hostel"
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
                label="Hostel Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
                placeholder="e.g. Boys Hostel A"
              />
              <TextBox
                label="Hostel Code *"
                value={editForm.code}
                onChange={v => setEditForm({ ...editForm, code: v })}
                placeholder="e.g. BHA"
              />
              <DropDownList
                label="Hostel Type *"
                data={[
                  { id: 'Boys', text: 'Boys' },
                  { id: 'Girls', text: 'Girls' },
                  { id: 'Co-ed', text: 'Co-ed' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.type}
                onChange={v => setEditForm({ ...editForm, type: v as string })}
              />

              <TextBox
                label="Affiliated Campus"
                value={editForm.affiliatedCampus}
                onChange={v =>
                  setEditForm({ ...editForm, affiliatedCampus: v })
                }
              />
              <TextBox
                label="Total Capacity"
                value={editForm.totalCapacity}
                onChange={v => setEditForm({ ...editForm, totalCapacity: v })}
              />
              <TextBox
                label="Address"
                value={editForm.address}
                onChange={v => setEditForm({ ...editForm, address: v })}
              />

              <TextBox
                label="Warden Name"
                value={editForm.wardenName}
                onChange={v => setEditForm({ ...editForm, wardenName: v })}
              />
              <TextBox
                label="Deputy Warden"
                value={editForm.deputyWarden}
                onChange={v => setEditForm({ ...editForm, deputyWarden: v })}
              />

              <DropDownList
                label="CCTV Coverage"
                data={[
                  { id: 'Y', text: 'Yes' },
                  { id: 'N', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.cctvCoverage}
                onChange={v =>
                  setEditForm({ ...editForm, cctvCoverage: v as string })
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
                  if (!editForm.name || !editForm.code || !editForm.type) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('hostels', editForm.id, {
                    ...editForm,
                    totalCapacity: Number(editForm.totalCapacity) || 0,
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
