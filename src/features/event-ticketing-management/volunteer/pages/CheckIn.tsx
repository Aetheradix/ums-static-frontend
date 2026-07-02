import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import { registrationStatusVariant, type Registration } from '../../mocks';
import {
  useRegistrationsQuery,
  useUpdateRegistrationStatus,
} from '../../queries';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

export default function CheckIn() {
  const { data: registrations, isLoading } = useRegistrationsQuery();
  const updateStatus = useUpdateRegistrationStatus();
  const [scanCode, setScanCode] = useState('');

  const handleCheckIn = (reg: Registration) => {
    if (reg.status === 'Checked-In') {
      ToastService.error(`${reg.attendeeName} is already checked in.`);
      return;
    }
    if (reg.status === 'Cancelled') {
      ToastService.error('This registration was cancelled.');
      return;
    }
    updateStatus(reg.id, 'Checked-In');
    ToastService.success(`${reg.attendeeName} checked in successfully.`);
  };

  const handleScan = () => {
    const code = scanCode.trim().toUpperCase();
    if (!code) {
      ToastService.error('Enter a ticket code to scan.');
      return;
    }
    const reg = registrations.find(r => r.ticketCode.toUpperCase() === code);
    if (!reg) {
      ToastService.error(`No registration found for ${code}.`);
      return;
    }
    handleCheckIn(reg);
    setScanCode('');
  };

  return (
    <FormPage
      title="Attendee Check-In"
      description="Scan tickets or check attendees in from the list as they arrive."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Volunteer', to: eventUrls.volunteer.portal },
        { label: 'Check-In' },
      ]}
    >
      <FormCard title="Scan Ticket" icon="qrcode">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="etm-qr-box">
            <i className="pi pi-qrcode text-3xl" />
          </div>
          <div className="flex-1">
            <TextBox
              label="Ticket Code"
              placeholder="e.g. TKT-0003"
              value={scanCode}
              onChange={setScanCode}
            />
          </div>
          <Button label="Check In" icon="check-circle" onClick={handleScan} />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          QR scanning is simulated in this prototype — enter a ticket code to
          check an attendee in.
        </p>
      </FormCard>

      <FormCard title="Registrations">
        <GridPanel
          data={registrations}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by attendee, event or ticket..."
          columns={[
            { field: 'ticketCode', header: 'Ticket', sortable: true },
            { field: 'attendeeName', header: 'Attendee' },
            { field: 'eventTitle', header: 'Event' },
            {
              header: 'Status',
              cell: (r: Registration) => (
                <StatusBadge
                  label={r.status}
                  variant={registrationStatusVariant(r.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '130px',
              cell: (r: Registration) => (
                <Button
                  label="Check In"
                  icon="check"
                  variant="text"
                  size="small"
                  onClick={() => handleCheckIn(r)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
