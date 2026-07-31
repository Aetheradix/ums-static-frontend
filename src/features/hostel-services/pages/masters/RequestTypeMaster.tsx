import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function RequestTypeMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();

  const initialForm = {
    name: '',
    category: 'Maintenance',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <FormPage
      title="Hostel Request Type Master"
      description="Configure categories for student requests and complaints."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/request-type' },
        { label: 'Request Type Master' },
      ]}
    >
      <FormCard title="Add Request Type" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Request Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
            placeholder="e.g. Electrical Repair"
          />
          <DropDownList
            label="Category *"
            data={['Maintenance', 'Facility', 'Disciplinary', 'General'].map(
              c => ({ id: c, text: c })
            )}
            textField="text"
            valueField="id"
            value={form.category}
            onChange={v => setForm({ ...form, category: v as string })}
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
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Save"
            variant="primary"
            onClick={() => {
              if (!form.name || !form.category) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('requestTypes', {
                ...form,
                id: `RQ${Date.now()}`,
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

      <FormCard title="Request Types List" icon="list">
        <GridPanel
          data={data.requestTypes}
          columns={[
            { field: 'name', header: 'Request / Issue Type' },
            {
              field: 'category',
              header: 'Category',
              cell: (item: any) => (
                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {item.category}
                </span>
              ),
            },
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
        header="Edit Request Type"
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
                label="Request Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
                placeholder="e.g. Electrical Repair"
              />
              <DropDownList
                label="Category *"
                data={[
                  'Maintenance',
                  'Facility',
                  'Disciplinary',
                  'General',
                ].map(c => ({ id: c, text: c }))}
                textField="text"
                valueField="id"
                value={editForm.category}
                onChange={v =>
                  setEditForm({ ...editForm, category: v as string })
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
                  if (!editForm.name || !editForm.category) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('requestTypes', editForm.id, editForm);
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
