import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  paymentStatusVariant,
  registrationStatusVariant,
  type Registration,
} from '../../mocks';
import { useRegistrationsQuery } from '../../queries';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

export default function MyTickets() {
  const { data, isLoading } = useRegistrationsQuery();

  return (
    <FormPage
      title="My Tickets"
      description="Your booked tickets with QR passes and payment status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Attendee', to: eventUrls.attendee.portal },
        { label: 'My Tickets' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by event or ticket code..."
          emptyMessage="You have no tickets yet."
          columns={[
            {
              header: 'QR',
              width: '60px',
              cell: () => (
                <span className="etm-qr-box !h-10 !w-10">
                  <i className="pi pi-qrcode" />
                </span>
              ),
            },
            { field: 'ticketCode', header: 'Ticket', sortable: true },
            { field: 'eventTitle', header: 'Event' },
            { field: 'ticketTypeName', header: 'Ticket Type' },
            {
              header: 'Amount',
              cell: (r: Registration) => (
                <span>₹{r.amount.toLocaleString('en-IN')}</span>
              ),
            },
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
    </FormPage>
  );
}
