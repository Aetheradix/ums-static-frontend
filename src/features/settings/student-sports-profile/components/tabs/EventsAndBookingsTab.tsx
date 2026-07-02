import {
  FormCard,
  FormGrid,
  PreviewField,
  StatusBadge,
} from 'shared/new-components';

export default function EventsAndBookingsTab({
  upcomingEvents,
  myBookings,
}: any) {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard
        title="Upcoming Events & Tournaments"
        icon="calendar"
        className="shadow-none border border-gray-100"
      >
        {upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="flex flex-col gap-6">
            {upcomingEvents.map((eventObj: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Event Name" value={eventObj.event} />
                <PreviewField label="Type" value={eventObj.type} />
                <PreviewField label="Venue" value={eventObj.venue} />
                <PreviewField label="Start Date" value={eventObj.startDate} />
                <PreviewField
                  label="Status"
                  value={
                    <div className="mt-1">
                      <StatusBadge variant="neutral" label={eventObj.status} />
                    </div>
                  }
                />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No upcoming events.</p>
        )}
      </FormCard>

      <FormCard
        title="My Facility Bookings"
        icon="map-marker"
        className="shadow-none border border-gray-100"
      >
        {myBookings && myBookings.length > 0 ? (
          <div className="flex flex-col gap-6">
            {myBookings.map((booking: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Facility" value={booking.facility} />
                <PreviewField label="Date" value={booking.date} />
                <PreviewField label="Time Slot" value={booking.timeSlot} />
                <PreviewField label="Purpose" value={booking.purpose} />
                <PreviewField
                  label="Status"
                  value={
                    <div className="mt-1">
                      <StatusBadge
                        variant={
                          booking.status === 'Approved'
                            ? 'approved'
                            : booking.status === 'Pending'
                              ? 'pending'
                              : 'rejected'
                        }
                        label={booking.status}
                      />
                    </div>
                  }
                />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No facility bookings.</p>
        )}
      </FormCard>
    </div>
  );
}
