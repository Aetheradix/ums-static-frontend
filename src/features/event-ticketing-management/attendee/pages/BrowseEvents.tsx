import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import { eventStatusVariant, ticketTypes, type Event } from '../../mocks';
import { useCreateRegistrationMutation, useEventsQuery } from '../../queries';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

const BOOKABLE: Event['status'][] = ['Published', 'Ongoing'];

export default function BrowseEvents() {
  const { data: events, isLoading } = useEventsQuery();
  const createMutation = useCreateRegistrationMutation();

  const [selected, setSelected] = useState<Event | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);

  const bookable = useMemo(
    () => events.filter(e => BOOKABLE.includes(e.status)),
    [events]
  );

  const openRegister = (event: Event) => {
    setSelected(event);
    setAttendeeName('');
    setAttendeeEmail('');
    setEnrollmentNo('');
    setTicketTypeId(event.ticketTypeId);
  };

  const handleRegister = async () => {
    if (!selected) return;
    if (!attendeeName.trim()) {
      ToastService.error('Please enter your name.');
      return;
    }
    if (!ticketTypeId) {
      ToastService.error('Please select a ticket type.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        eventId: selected.id,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        enrollmentNo: enrollmentNo.trim(),
        ticketTypeId,
      });
      ToastService.success('Registered successfully. Check My Tickets.');
      setSelected(null);
    } catch {
      ToastService.error('Failed to register. Please try again.');
    }
  };

  return (
    <FormPage
      title="Browse Events"
      description="Discover upcoming university events and book your tickets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Attendee', to: eventUrls.attendee.portal },
        { label: 'Browse Events' },
      ]}
    >
      {isLoading ? (
        <FormCard>
          <p className="p-4 text-sm text-gray-500">Loading events…</p>
        </FormCard>
      ) : bookable.length === 0 ? (
        <FormCard>
          <p className="p-4 text-sm text-gray-500">
            No events are open for registration right now.
          </p>
        </FormCard>
      ) : (
        <div className="etm-cards-grid">
          {bookable.map(event => (
            <FormCard key={event.id} title={event.title} icon="calendar">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <StatusBadge
                    label={event.status}
                    variant={eventStatusVariant(event.status)}
                  />
                  <span className="text-xs text-gray-400">
                    {event.categoryName}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {event.description}
                </p>
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <span>
                    <i className="pi pi-calendar mr-1" />
                    {event.startDate} · {event.startTime}
                  </span>
                  <span>
                    <i className="pi pi-map-marker mr-1" />
                    {event.venueName}
                  </span>
                  <span>
                    <i className="pi pi-ticket mr-1" />
                    {event.ticketTypeName} · ₹{event.ticketPrice}
                  </span>
                </div>
                <Button
                  label="Register"
                  icon="plus"
                  onClick={() => openRegister(event)}
                />
              </div>
            </FormCard>
          ))}
        </div>
      )}

      <FormPopup
        visible={!!selected}
        onHide={() => setSelected(null)}
        title={selected ? `Register — ${selected.title}` : 'Register'}
        subtitle="Enter your details and select a ticket type."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextBox
              label="Your Name"
              placeholder="Full name"
              value={attendeeName}
              onChange={setAttendeeName}
              required
            />
            <TextBox
              label="Email"
              placeholder="you@univ.edu"
              value={attendeeEmail}
              onChange={setAttendeeEmail}
            />
            <TextBox
              label="Enrollment No."
              placeholder="e.g. CS21-042"
              value={enrollmentNo}
              onChange={setEnrollmentNo}
            />
            <DropDownList
              label="Ticket Type"
              placeholder="Select Ticket Type"
              data={ticketTypes}
              textField="name"
              valueField="id"
              value={ticketTypeId}
              onChange={val => setTicketTypeId(val as number)}
              required
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setSelected(null)}
            />
            <Button
              label="Confirm Registration"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleRegister}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
