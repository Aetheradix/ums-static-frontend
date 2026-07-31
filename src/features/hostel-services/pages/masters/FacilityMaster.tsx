import { useState } from 'react';
import { DropDownList, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useHostelContext } from '../../context/HostelContext';
import Modal from 'shared/components/popups/Modal';

export default function FacilityMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = data.facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Facility Master"
      description="Manage amenities and facilities like Gym, Laundry, Wi-Fi."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/facility' },
        { label: 'Facility Master' },
      ]}
    >
      <FormCard title="Add Facility" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Facility Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
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
              if (!form.name) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('facilities', { ...form, id: `F${Date.now()}` });
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

      <FormCard title="Facilities List" icon="list">
        <div className="mb-4 w-1/3">
          <TextBox
            label=""
            placeholder="Search..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            { field: 'name', header: 'Facility Name' },
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
        header="Edit Facility"
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
                label="Facility Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
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
                  if (!editForm.name) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('facilities', editForm.id, editForm);
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
