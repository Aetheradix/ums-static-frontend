import { useState } from 'react';
import { useHostelContext, useHostelRole } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function MessMenuMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, activePortal } = useHostelRole();

  const initialForm = {
    day: 'Monday',
    meal: 'Breakfast',
    foodItems: '',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const portalLabel =
    activePortal === 'student' ? 'Student Portal' : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'Mess Menu' : 'Mess & Menu Master'}
      description={
        isStudent
          ? 'View the weekly mess menu schedule for all meals.'
          : 'Manage weekly food menus for the hostel mess.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: isStudent ? 'Mess Menu' : 'Mess Menu Master' },
      ]}
    >
      {/* Only Admin can add menu items */}
      {!isStudent && (
        <FormCard title="Add Menu Item" icon="add_circle">
          <FormGrid columns={3}>
            <DropDownList
              label="Day *"
              data={[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map(d => ({ id: d, text: d }))}
              textField="text"
              valueField="id"
              value={form.day}
              onChange={v => setForm({ ...form, day: v as string })}
            />
            <DropDownList
              label="Meal *"
              data={['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(m => ({
                id: m,
                text: m,
              }))}
              textField="text"
              valueField="id"
              value={form.meal}
              onChange={v => setForm({ ...form, meal: v as string })}
            />
            <TextBox
              label="Food Items *"
              value={form.foodItems}
              onChange={v => setForm({ ...form, foodItems: v })}
              placeholder="e.g. Roti, Dal, Rice"
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
                if (!form.foodItems) {
                  alert('Please fill all required fields');
                  return;
                }
                addRecord('messMenus', {
                  ...form,
                  id: `MM${Date.now()}`,
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
      )}

      <FormCard title="Weekly Menu" icon="list">
        <GridPanel
          data={data.messMenus}
          columns={[
            { field: 'day', header: 'Day' },
            { field: 'meal', header: 'Meal Time' },
            { field: 'foodItems', header: 'Menu / Food Items' },
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
            ...(!isStudent
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditForm(item);
                            setIsEditModalOpen(true);
                          }}
                          className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </FormCard>

      {/* Edit modal — only available for Admin */}
      {!isStudent && (
        <Modal
          header="Edit Menu Item"
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
                <DropDownList
                  label="Day *"
                  data={[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map(d => ({ id: d, text: d }))}
                  textField="text"
                  valueField="id"
                  value={editForm.day}
                  onChange={v => setEditForm({ ...editForm, day: v as string })}
                />
                <DropDownList
                  label="Meal *"
                  data={['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(m => ({
                    id: m,
                    text: m,
                  }))}
                  textField="text"
                  valueField="id"
                  value={editForm.meal}
                  onChange={v =>
                    setEditForm({ ...editForm, meal: v as string })
                  }
                />
                <TextBox
                  label="Food Items *"
                  value={editForm.foodItems}
                  onChange={v => setEditForm({ ...editForm, foodItems: v })}
                  placeholder="e.g. Roti, Dal, Rice"
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
                    if (!editForm.foodItems) {
                      alert('Please fill all required fields');
                      return;
                    }
                    updateRecord('messMenus', editForm.id, editForm);
                    setIsEditModalOpen(false);
                    setEditForm(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      )}
    </FormPage>
  );
}
