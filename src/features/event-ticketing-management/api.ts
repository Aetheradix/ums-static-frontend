// ─── Event & Ticketing Management — mock API layer ──────────────────────────
import {
  categories,
  events as EVENTS,
  registrations as REGISTRATIONS,
  ticketTypes,
  venues,
  type Event,
  type EventStatus,
  type Registration,
  type Speaker,
} from './mocks';

export interface EventFormValues {
  code: string;
  title: string;
  description: string;
  categoryId: number;
  venueId: number;
  organizer: string;
  startDate: string;
  endDate: string;
  startTime: string;
  capacity: number;
  ticketTypeId: number;
  status: EventStatus;
  speakers: Speaker[];
  reviewNotes?: string;
}

export interface RegistrationFormValues {
  eventId: number;
  attendeeName: string;
  attendeeEmail: string;
  enrollmentNo: string;
  ticketTypeId: number;
}

const nameOf = <T extends { id: number; name: string }>(
  list: T[],
  id: number
) => list.find(x => x.id === id)?.name ?? '';

const priceOf = (id: number) => ticketTypes.find(t => t.id === id)?.price ?? 0;

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  return Promise.resolve([...EVENTS]);
}

export async function createEvent(form: EventFormValues): Promise<Event> {
  const newId = Date.now();
  return Promise.resolve({
    ...form,
    id: newId,
    categoryName: nameOf(categories, form.categoryId),
    venueName: nameOf(venues, form.venueId),
    ticketTypeName: nameOf(ticketTypes, form.ticketTypeId),
    ticketPrice: priceOf(form.ticketTypeId),
    registered: 0,
  });
}

export async function updateEvent(
  id: number,
  form: EventFormValues
): Promise<Event> {
  const existing = EVENTS.find(e => e.id === id);
  return Promise.resolve({
    ...form,
    id,
    categoryName: nameOf(categories, form.categoryId),
    venueName: nameOf(venues, form.venueId),
    ticketTypeName: nameOf(ticketTypes, form.ticketTypeId),
    ticketPrice: priceOf(form.ticketTypeId),
    registered: existing?.registered ?? 0,
  });
}

// ─── Registrations ────────────────────────────────────────────────────────────

export async function getRegistrations(): Promise<Registration[]> {
  return Promise.resolve([...REGISTRATIONS]);
}

export async function createRegistration(
  form: RegistrationFormValues
): Promise<Registration> {
  const id = Date.now();
  const parentEvent = EVENTS.find(e => e.id === form.eventId);
  return Promise.resolve({
    id,
    ticketCode: `TKT-${String(id).slice(-4)}`,
    eventId: form.eventId,
    eventTitle: parentEvent?.title ?? '',
    attendeeName: form.attendeeName,
    attendeeEmail: form.attendeeEmail,
    enrollmentNo: form.enrollmentNo,
    ticketTypeId: form.ticketTypeId,
    ticketTypeName: nameOf(ticketTypes, form.ticketTypeId),
    amount: priceOf(form.ticketTypeId),
    paymentStatus: priceOf(form.ticketTypeId) === 0 ? 'Paid' : 'Pending',
    status: 'Registered',
    registeredOn: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  });
}
