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
import { activityMasterList } from '../../data';

type ActivityData = (typeof activityMasterList)[0];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ActivityData }
  | { mode: 'delete'; item: ActivityData };

const EMPTY_FORM = {
  name: '',
  type: '',
  description: '',
  startDate: '',
  endDate: '',
  venue: '',
  maxParticipants: 0,
  coordinator: '',
  status: 'Active',
};

const activityTypeOptions = [
  { name: 'Sports', value: 'Sports' },
  { name: 'Cultural', value: 'Cultural' },
  { name: 'Technical', value: 'Technical' },
  { name: 'NSS/NCC', value: 'NSS/NCC' },
  { name: 'Debate', value: 'Debate' },
  { name: 'Seminar', value: 'Seminar' },
  { name: 'Workshop', value: 'Workshop' },
  { name: 'Hackathon', value: 'Hackathon' },
  { name: 'Quiz Competition', value: 'Quiz Competition' },
  { name: 'Social Activities', value: 'Social Activities' },
];

const statusOptions = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

export default function ActivityMaster() {
  const [data, setData] = useState<ActivityData[]>(activityMasterList);
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

  const openEdit = (item: ActivityData) => {
    setForm({
      name: item.name,
      type: item.type,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      venue: item.venue,
      maxParticipants: item.maxParticipants,
      coordinator: item.coordinator,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const openDelete = (item: ActivityData) => {
    setPopup({ mode: 'delete', item });
  };

  const handleSave = () => {
    if (
      !form.name ||
      !form.type ||
      !form.startDate ||
      !form.endDate ||
      !form.venue ||
      !form.coordinator ||
      !form.status
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    if (popup.mode === 'create') {
      const newItem: ActivityData = {
        id: Date.now(),
        ...form,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Activity created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(a => (a.id === popup.item.id ? { ...a, ...form } : a))
      );
      ToastService.success('Activity updated successfully.');
    }
    closePopup();
  };

  const handleDelete = () => {
    if (popup.mode === 'delete') {
      setData(prev => prev.filter(a => a.id !== popup.item.id));
      ToastService.success('Activity deleted successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Activity Master"
      description="Create and manage different types of student activities."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Activity Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search activities..."
          toolbar={
            <Button
              label="Add Activity"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'name', header: 'Activity Name' },
            { field: 'type', header: 'Activity Type' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'venue', header: 'Venue' },
            { field: 'coordinator', header: 'Coordinator' },
            {
              header: 'Status',
              cell: (item: ActivityData) => (
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
              cell: (item: ActivityData) => (
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
          title={popup.mode === 'create' ? 'Add Activity' : 'Edit Activity'}
          subtitle="Fill in the activity details."
          size="xl"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Activity Name"
              placeholder="e.g. Annual Sports Meet"
              value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v }))}
              required
            />
            <DropDownList
              label="Activity Type"
              data={activityTypeOptions}
              textField="name"
              optionValue="value"
              value={form.type}
              onChange={v => setForm(f => ({ ...f, type: String(v ?? '') }))}
              required
            />
            <div className="col-span-2">
              <TextBox
                label="Description"
                placeholder="Brief description of the activity..."
                value={form.description}
                onChange={v => setForm(f => ({ ...f, description: v }))}
              />
            </div>
            <TextBox
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={v => setForm(f => ({ ...f, startDate: v }))}
              required
            />
            <TextBox
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={v => setForm(f => ({ ...f, endDate: v }))}
              required
            />
            <TextBox
              label="Venue"
              placeholder="e.g. Stadium"
              value={form.venue}
              onChange={v => setForm(f => ({ ...f, venue: v }))}
              required
            />
            <TextBox
              label="Maximum Participants"
              type="number"
              value={String(form.maxParticipants)}
              onChange={v =>
                setForm(f => ({ ...f, maxParticipants: Number(v) || 0 }))
              }
            />
            <TextBox
              label="Activity Coordinator"
              placeholder="e.g. Mr. Sharma"
              value={form.coordinator}
              onChange={v => setForm(f => ({ ...f, coordinator: v }))}
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
          title="Delete Activity"
          subtitle="Are you sure you want to delete this activity?"
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
