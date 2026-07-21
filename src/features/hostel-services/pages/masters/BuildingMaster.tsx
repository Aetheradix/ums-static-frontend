import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function BuildingMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    hostelId: '',
    numberOfFloors: '',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = data.buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Building Master"
      description="Manage buildings within hostels."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/building' },
        { label: 'Building Master' },
      ]}
    >
      <FormCard title="Add Building" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Building Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
          />
          <DropDownList
            label="Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <TextBox
            label="Number of Floors *"
            value={form.numberOfFloors}
            onChange={v => setForm({ ...form, numberOfFloors: v })}
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
              if (!form.name || !form.hostelId || !form.numberOfFloors) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('buildings', {
                ...form,
                numberOfFloors: Number(form.numberOfFloors),
                id: `B${Date.now()}`,
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

      <FormCard title="Buildings List" icon="list">
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
            { field: 'name', header: 'Building Name' },
            {
              field: 'hostelId',
              header: 'Hostel',
              cell: (item: any) =>
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</> ||
                item.hostelId,
            },
            { field: 'numberOfFloors', header: 'Floors' },
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
        header="Edit Building"
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
                label="Building Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
              />
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
              <TextBox
                label="Number of Floors *"
                value={editForm.numberOfFloors}
                onChange={v => setEditForm({ ...editForm, numberOfFloors: v })}
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
                    !editForm.name ||
                    !editForm.hostelId ||
                    !editForm.numberOfFloors
                  ) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('buildings', editForm.id, {
                    ...editForm,
                    numberOfFloors: Number(editForm.numberOfFloors),
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
