import { useState, useCallback } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, DatePicker } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubEvents, clubsList } from '../../data';

type EventData = (typeof clubEvents)[0];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: EventData }
  | { mode: 'delete'; item: EventData };

const EMPTY_FORM = {
  title: '',
  club: '',
  date: '',
  venue: '',
  attendees: 0,
  status: 'Upcoming',
};

const clubOptions = clubsList.map(c => ({ name: c.name, value: c.name }));

const statusOptions = [
  { name: 'Upcoming', value: 'Upcoming' },
  { name: 'Planned', value: 'Planned' },
  { name: 'Completed', value: 'Completed' },
];

export default function EventManagement() {
  const [data, setData] = useState<EventData[]>(clubEvents);
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

  const openEdit = (item: EventData) => {
    setForm({
      title: item.title,
      club: item.club,
      date: item.date,
      venue: item.venue,
      attendees: item.attendees,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const openDelete = (item: EventData) => {
    setPopup({ mode: 'delete', item });
  };

  const handleSave = () => {
    if (
      !form.title ||
      !form.club ||
      !form.date ||
      !form.venue ||
      !form.status
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }

    if (popup.mode === 'create') {
      const newItem: EventData = {
        id: Date.now(),
        ...form,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Event scheduled successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(e => (e.id === popup.item.id ? { ...e, ...form } : e))
      );
      ToastService.success('Event updated successfully.');
    }
    closePopup();
  };

  const handleDelete = () => {
    if (popup.mode === 'delete') {
      setData(prev => prev.filter(e => e.id !== popup.item.id));
      ToastService.success('Event deleted successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Event Management"
      description="Manage and schedule events for all clubs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Event Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search events..."
          toolbar={
            <Button
              label="Schedule Event"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'title', header: 'Event Title' },
            { field: 'club', header: 'Club' },
            { field: 'date', header: 'Date' },
            { field: 'venue', header: 'Venue' },
            { field: 'attendees', header: 'Expected Attendees' },
            {
              header: 'Status',
              cell: (item: EventData) => (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Completed'
                      ? 'bg-gray-100 text-gray-700'
                      : item.status === 'Upcoming'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '120px',
              cell: (item: EventData) => (
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
          title={popup.mode === 'create' ? 'Schedule Event' : 'Edit Event'}
          subtitle="Fill in the event details."
          size="lg"
        >
          <FormGrid columns={2}>
            <TextBox
              label="Event Title"
              placeholder="e.g. Annual Fest"
              value={form.title}
              onChange={v => setForm(f => ({ ...f, title: v }))}
              required
            />
            <DropDownList
              label="Club"
              data={clubOptions}
              textField="name"
              optionValue="value"
              value={form.club}
              onChange={v => setForm(f => ({ ...f, club: String(v ?? '') }))}
              required
            />
            <DatePicker
              label="Date"
              value={form.date ? new Date(form.date) : undefined}
              onChange={(v: Date | null | undefined) => {
                const str = v ? v.toLocaleDateString('en-CA') : '';
                setForm(f => ({ ...f, date: str }));
              }}
              required
            />
            <TextBox
              label="Venue"
              placeholder="e.g. Main Auditorium"
              value={form.venue}
              onChange={v => setForm(f => ({ ...f, venue: v }))}
              required
            />
            <TextBox
              label="Expected Attendees"
              type="number"
              value={String(form.attendees)}
              onChange={v =>
                setForm(f => ({ ...f, attendees: Number(v) || 0 }))
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
          title="Delete Event"
          subtitle="Are you sure you want to delete this event?"
        >
          <p className="text-gray-600 mb-6 text-sm">
            This action will permanently delete{' '}
            <strong>{popup.item.title}</strong> from the schedule.
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
