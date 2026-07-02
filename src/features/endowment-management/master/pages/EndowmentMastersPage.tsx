import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';

export default function EndowmentMastersPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [mockData, setMockData] = useState([
    {
      id: 1,
      name: 'Chair Endowment',
      description: 'Endowment for establishing a faculty chair',
      active: true,
    },
    {
      id: 2,
      name: 'Scholarship',
      description: 'Endowment for student scholarships',
      active: true,
    },
    {
      id: 3,
      name: 'Medal / Prize',
      description: 'Endowment for awarding medals or prizes',
      active: false,
    },
  ]);

  const openCreate = () => {
    setFormData({ name: '', description: '' });
    setEditId(null);
    setShowPopup(true);
  };

  const openEdit = (item: any) => {
    setFormData({ name: item.name, description: item.description });
    setEditId(item.id);
    setShowPopup(true);
  };

  const handleSave = () => {
    if (editId !== null) {
      setMockData(prev =>
        prev.map(item => (item.id === editId ? { ...item, ...formData } : item))
      );
      ToastService.success('Endowment type updated successfully!');
    } else {
      setMockData([
        ...mockData,
        {
          id: mockData.length + 1,
          ...formData,
          active: true,
        },
      ]);
      ToastService.success('Endowment type saved successfully!');
    }
    setFormData({ name: '', description: '' });
    setEditId(null);
    setShowPopup(false);
  };

  const handleToggleActive = (id: number) => {
    setMockData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
    ToastService.success('Status updated successfully!');
  };

  return (
    <FormPage
      title="Endowment Types Master"
      description="Configure and manage the types of endowments."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Master Configuration', to: '/endowment-management/master' },
        { label: 'Endowment Types' },
      ]}
    >
      <FormCard
        title="Endowment Types"
        headerAction={
          <Button
            label="Add New Type"
            icon="plus"
            type="button"
            variant="primary"
            onClick={openCreate}
          />
        }
      >
        <GridPanel
          data={mockData}
          columns={[
            { field: 'name', header: 'Type Name' },
            { field: 'description', header: 'Description' },
            {
              header: 'Status',
              cell: (item: any) => (
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                    item.active
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  {item.active ? 'Active' : 'Inactive'}
                </button>
              ),
            },
            {
              header: 'Actions',
              cell: (item: any) => (
                <Button
                  label="Edit"
                  icon="pencil"
                  type="button"
                  variant="outlined"
                  onClick={() => openEdit(item)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title={
          editId !== null ? 'Edit Endowment Type' : 'Add New Endowment Type'
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              type="button"
              variant="outlined"
              onClick={() => setShowPopup(false)}
            />
            <Button
              label="Save"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <TextBox
            label="Type Name"
            placeholder="e.g. Scholarship"
            required
            value={formData.name}
            onChange={(val: any) => setFormData({ ...formData, name: val })}
          />
          <TextBox
            label="Description"
            placeholder="Brief description of the type"
            value={formData.description}
            onChange={(val: any) =>
              setFormData({ ...formData, description: val })
            }
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
