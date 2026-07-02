import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  paymentStatusVariant,
  registrationStatusVariant,
  ticketTypes,
  type Registration,
} from '../../mocks';
import {
  useCreateRegistrationMutation,
  useEventsQuery,
  useRegistrationsQuery,
} from '../../queries';
import { eventUrls } from '../../urls';

export default function Registrations() {
  const { data: events } = useEventsQuery();
  const { data: registrations, isLoading } = useRegistrationsQuery();
  const createMutation = useCreateRegistrationMutation();

  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);

  const resetForm = () => {
    setEventId(null);
    setAttendeeName('');
    setAttendeeEmail('');
    setEnrollmentNo('');
    setTicketTypeId(null);
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!eventId) {
      ToastService.error('Please select an event.');
      return;
    }
    if (!attendeeName.trim()) {
      ToastService.error('Please enter the attendee name.');
      return;
    }
    if (!ticketTypeId) {
      ToastService.error('Please select a ticket type.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        eventId,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        enrollmentNo: enrollmentNo.trim(),
        ticketTypeId,
      });
      ToastService.success('Registration added successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to add the registration.');
    }
  };

  return (
    <FormPage
      title="Registrations"
      description="Review attendee registrations, payment status and check-in state."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Event Administrator', to: eventUrls.admin.portal },
        { label: 'Registrations' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={registrations}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by attendee, event or ticket..."
          toolbar={
            <Button
              label="Add Registration"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            { field: 'ticketCode', header: 'Ticket', sortable: true },
            { field: 'attendeeName', header: 'Attendee' },
            { field: 'eventTitle', header: 'Event' },
            { field: 'ticketTypeName', header: 'Ticket Type' },
            {
              header: 'Payment',
              cell: (r: Registration) => (
                <StatusBadge
                  label={r.paymentStatus}
                  variant={paymentStatusVariant(r.paymentStatus)}
                />
              ),
            },
            {
              header: 'Check-In',
              cell: (r: Registration) => (
                <StatusBadge
                  label={r.status}
                  variant={registrationStatusVariant(r.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="Add Registration"
        subtitle="Register an attendee for an event and issue a ticket."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Event"
            placeholder="Select Event"
            data={events}
            textField="title"
            valueField="id"
            value={eventId}
            onChange={val => setEventId(val as number)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextBox
              label="Attendee Name"
              placeholder="Full name"
              value={attendeeName}
              onChange={setAttendeeName}
              required
            />
            <TextBox
              label="Email"
              placeholder="attendee@univ.edu"
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
              onClick={() => setOpen(false)}
            />
            <Button
              label="Save"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
