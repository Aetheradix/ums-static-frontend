import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function GroundCourtBookingPage() {
  const mockData = [
    {
      id: 1,
      student: 'John Doe',
      facility: 'Main Cricket Ground',
      date: '2026-07-05',
      timeSlot: '6-8 AM',
      purpose: 'Net Practice',
      status: 'Approved',
    },
    {
      id: 2,
      student: 'Jane Smith',
      facility: 'Indoor Badminton Court 1',
      date: '2026-07-06',
      timeSlot: '4-6 PM',
      purpose: 'Friendly Match',
      status: 'Pending',
    },
    {
      id: 3,
      student: 'Mike Ross',
      facility: 'Main Cricket Ground',
      date: '2026-07-05',
      timeSlot: '6-8 AM',
      purpose: 'Event Prep',
      status: 'Rejected',
    },
  ];

  return (
    <FormPage
      title="Ground / Court Booking"
      description="Request and manage reservations for sports facilities."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Booking Management' },
        { label: 'Facility Booking' },
      ]}
    >
      <FormCard title="All Booking Requests (Admin View)">
        <GridPanel
          data={mockData}
          columns={[
            { field: 'student', header: 'Student Name' },
            { field: 'facility', header: 'Facility' },
            { field: 'date', header: 'Date' },
            { field: 'timeSlot', header: 'Time Slot' },
            { field: 'purpose', header: 'Purpose' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Pending'
                        ? 'pending'
                        : 'rejected'
                  }
                  label={item.status}
                />
              ),
            },
            {
              header: 'Action',
              cell: (item: any) =>
                item.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <Button
                      label="Approve"
                      variant="outlined"
                      size="small"
                      onClick={() => ToastService.success('Booking approved')}
                    />
                    <Button
                      label="Reject"
                      variant="outlined"
                      size="small"
                      onClick={() => ToastService.success('Booking rejected')}
                    />
                  </div>
                ) : (
                  <span>-</span>
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
