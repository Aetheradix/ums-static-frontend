import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  eventStatusVariant,
  paymentStatusVariant,
  registrationStatusVariant,
  type Registration,
} from '../../mocks';
import { useEventsQuery, useRegistrationsQuery } from '../../queries';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="etm-detail-item">
      <span className="etm-detail-label">{label}</span>
      <span className="etm-detail-value">{value || '—'}</span>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: events, isLoading } = useEventsQuery();
  const { data: allRegistrations } = useRegistrationsQuery();

  const event = events.find(e => String(e.id) === id);

  if (!event) {
    return (
      <FormPage
        title="Event Details"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Event & Ticketing Management', to: eventUrls.portal },
          { label: 'Events', to: eventUrls.admin.events },
          { label: 'Details' },
        ]}
      >
        <FormCard>
          <p className="p-4 text-sm text-gray-500">
            {isLoading ? 'Loading event…' : 'Event not found.'}
          </p>
        </FormCard>
      </FormPage>
    );
  }

  const eventRegistrations = allRegistrations.filter(
    r => r.eventId === event.id
  );

  const overview = (
    <FormCard>
      <div className="etm-detail-grid">
        <Field label="Event Code" value={event.code} />
        <Field label="Title" value={event.title} />
        <Field label="Category" value={event.categoryName} />
        <Field label="Organizer" value={event.organizer} />
        <Field label="Venue" value={event.venueName} />
        <Field
          label="Schedule"
          value={`${event.startDate} → ${event.endDate}`}
        />
        <Field label="Start Time" value={event.startTime} />
        <Field
          label="Capacity"
          value={`${event.registered}/${event.capacity} registered`}
        />
        <Field
          label="Ticket Type"
          value={`${event.ticketTypeName} (₹${event.ticketPrice})`}
        />
        <div className="etm-detail-item">
          <span className="etm-detail-label">Status</span>
          <span>
            <StatusBadge
              label={event.status}
              variant={eventStatusVariant(event.status)}
            />
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-1">
        <span className="etm-detail-label">Description</span>
        <p className="text-sm leading-relaxed text-gray-600">
          {event.description}
        </p>
      </div>
      {event.reviewNotes && (
        <div className="mt-4 flex flex-col gap-1">
          <span className="etm-detail-label">Review Notes</span>
          <p className="text-sm leading-relaxed text-gray-600">
            {event.reviewNotes}
          </p>
        </div>
      )}
    </FormCard>
  );

  const speakersTab = (
    <FormCard>
      {event.speakers.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">
          No speakers listed for this event.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {event.speakers.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2"
            >
              <i className="pi pi-user text-lg text-indigo-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {s.name}
                </span>
                <span className="text-xs text-gray-400">
                  {s.designation || '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormCard>
  );

  const registrationsTab = (
    <FormCard>
      <GridPanel
        data={eventRegistrations}
        emptyMessage="No registrations for this event yet."
        columns={[
          { field: 'ticketCode', header: 'Ticket' },
          { field: 'attendeeName', header: 'Attendee' },
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
            header: 'Status',
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
  );

  return (
    <FormPage
      title={event.code}
      description={event.title}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Events', to: eventUrls.admin.events },
        { label: event.code },
      ]}
      headerAction={
        <Button
          label="Edit Event"
          icon="pencil"
          variant="outlined"
          onClick={() => navigate(eventUrls.admin.eventEdit(event.id))}
        />
      }
    >
      <Tabs
        tabs={[
          { title: 'Overview', content: overview },
          {
            title: `Speakers (${event.speakers.length})`,
            content: speakersTab,
          },
          {
            title: `Registrations (${eventRegistrations.length})`,
            content: registrationsTab,
          },
        ]}
      />
    </FormPage>
  );
}
