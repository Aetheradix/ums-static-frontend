// ============================================================
//  Event & Ticketing Management Module — URL Constants
// ============================================================

export const eventUrls = {
  portal: '/event-ticketing-management',

  admin: {
    portal: '/event-ticketing-management/admin',
    dashboard: '/event-ticketing-management/admin/dashboard',
    events: '/event-ticketing-management/admin/events',
    eventNew: '/event-ticketing-management/admin/events/new',
    eventEdit: (id: number | string) =>
      `/event-ticketing-management/admin/events/${id}/edit`,
    eventDetail: (id: number | string) =>
      `/event-ticketing-management/admin/events/${id}`,
    registrations: '/event-ticketing-management/admin/registrations',
    reports: '/event-ticketing-management/admin/reports',
  },

  organizer: {
    portal: '/event-ticketing-management/organizer',
    dashboard: '/event-ticketing-management/organizer/dashboard',
    events: '/event-ticketing-management/organizer/events',
    eventNew: '/event-ticketing-management/organizer/events/new',
    eventEdit: (id: number | string) =>
      `/event-ticketing-management/organizer/events/${id}/edit`,
  },

  volunteer: {
    portal: '/event-ticketing-management/volunteer',
    dashboard: '/event-ticketing-management/volunteer/dashboard',
    checkIn: '/event-ticketing-management/volunteer/check-in',
  },

  attendee: {
    portal: '/event-ticketing-management/attendee',
    browse: '/event-ticketing-management/attendee/browse',
    tickets: '/event-ticketing-management/attendee/tickets',
  },
};
