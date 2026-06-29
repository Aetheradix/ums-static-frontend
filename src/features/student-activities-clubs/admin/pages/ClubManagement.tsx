import { useState, useCallback } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubsList } from '../../data';

type ClubData = (typeof clubsList)[0];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ClubData }
  | { mode: 'delete'; item: ClubData };

const EMPTY_FORM = {
  name: '',
  category: '',
  president: '',
  establishedYear: new Date().getFullYear(),
  memberCount: 0,
  status: 'Active',
};

const categoryOptions = [
  { name: 'Technical', value: 'Technical' },
  { name: 'Cultural', value: 'Cultural' },
  { name: 'Literary', value: 'Literary' },
  { name: 'Arts', value: 'Arts' },
  { name: 'Sports', value: 'Sports' },
];

const statusOptions = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

export default function ClubManagement() {
  const [data, setData] = useState<ClubData[]>(clubsList);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: ClubData) => {
    setForm({
      name: item.name,
      category: item.category,
      president: item.president,
      establishedYear: item.establishedYear,
      memberCount: item.memberCount,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const openDelete = (item: ClubData) => {
    setPopup({ mode: 'delete', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: ClubData = {
        id: Date.now(),
        ...form,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Club created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(c => (c.id === popup.item.id ? { ...c, ...form } : c))
      );
      ToastService.success('Club updated successfully.');
    }
    closePopup();
  };

  const handleDelete = () => {
    if (popup.mode === 'delete') {
      setData(prev => prev.filter(c => c.id !== popup.item.id));
      ToastService.success('Club deleted successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Club Management"
      description="Manage all student clubs and their details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Club Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search clubs..."
          toolbar={
            <Button
              label="Add Club"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'name', header: 'Club Name' },
            { field: 'category', header: 'Category' },
            { field: 'president', header: 'President' },
            { field: 'establishedYear', header: 'Established' },
            { field: 'memberCount', header: 'Members' },
            {
              header: 'Status',
              cell: (item: ClubData) => (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '120px',
              cell: (item: ClubData) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    className="text-red-500"
                    size="small"
                    onClick={() => openDelete(item)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {(popup.mode === 'create' || popup.mode === 'edit') && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.mode === 'create' ? 'Add Club' : 'Edit Club'}
          subtitle="Fill in the club details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Club Name"
              placeholder="e.g. Robotics Club"
              value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v }))}
              required
            />
            <DropDownList
              label="Category"
              data={categoryOptions}
              textField="name"
              optionValue="value"
              value={form.category}
              onChange={v =>
                setForm(f => ({ ...f, category: String(v ?? '') }))
              }
              required
            />
            <TextBox
              label="President"
              placeholder="e.g. John Doe"
              value={form.president}
              onChange={v => setForm(f => ({ ...f, president: v }))}
              required
            />
            <TextBox
              label="Established Year"
              type="number"
              value={String(form.establishedYear)}
              onChange={v =>
                setForm(f => ({
                  ...f,
                  establishedYear: Number(v) || new Date().getFullYear(),
                }))
              }
              required
            />
            <TextBox
              label="Members Count"
              type="number"
              value={String(form.memberCount)}
              onChange={v =>
                setForm(f => ({ ...f, memberCount: Number(v) || 0 }))
              }
              required
            />
            <DropDownList
              label="Status"
              data={statusOptions}
              textField="name"
              optionValue="value"
              value={form.status}
              onChange={v => setForm(f => ({ ...f, status: String(v ?? '') }))}
              required
            />
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </FormPopup>
      )}

      {popup.mode === 'delete' && (
        <FormPopup
          visible
          onHide={closePopup}
          title="Delete Club"
          subtitle="Are you sure you want to delete this club?"
        >
          <p className="text-gray-600 mb-6 text-sm">
            This action will permanently delete{' '}
            <strong>{popup.item.name}</strong> from the system.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Delete" variant="danger" onClick={handleDelete} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
