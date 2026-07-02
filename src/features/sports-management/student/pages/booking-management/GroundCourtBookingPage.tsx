import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';

export default function GroundCourtBookingPage() {
  const [formData, setFormData] = useState({
    facility: '',
    date: undefined,
    timeSlot: '',
    purpose: '',
  });

  const [bookingError, setBookingError] = useState<string | null>(null);

  const facilityOptions = [
    { id: '1', name: 'Main Cricket Ground' },
    { id: '2', name: 'Indoor Badminton Court 1' },
    { id: '3', name: 'University Pool' },
  ];

  const handleBooking = () => {
    // Mock double-booking validation rule from spec
    if (formData.facility === '1' && formData.timeSlot === '6-8 AM') {
      setBookingError(
        '⚠️ Double-booking detected! This time slot is already reserved for this facility.'
      );
    } else {
      setBookingError(null);
      ToastService.success('Booking request submitted successfully!');
      setFormData({
        facility: '',
        date: undefined,
        timeSlot: '',
        purpose: '',
      });
    }
  };

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
      <FormCard title="Request Facility Booking">
        <FormGrid>
          <DropDownList
            label="Select Facility"
            data={facilityOptions}
            textField="name"
            valueField="id"
            placeholder="Select a facility"
            required
            value={formData.facility}
            onChange={(val: any) => setFormData({ ...formData, facility: val })}
          />
          <DatePicker
            label="Booking Date"
            required
            value={formData.date}
            onChange={(val: any) => setFormData({ ...formData, date: val })}
          />
          <TextBox
            label="Time Slot"
            placeholder="e.g. 6-8 AM, 4-6 PM"
            required
            value={formData.timeSlot}
            onChange={(val: any) => setFormData({ ...formData, timeSlot: val })}
          />
          <TextBox
            label="Purpose of Booking"
            placeholder="e.g. Net Practice, Friendly Match"
            required
            value={formData.purpose}
            onChange={(val: any) => setFormData({ ...formData, purpose: val })}
          />
        </FormGrid>

        {bookingError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {bookingError}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            label="Submit Request"
            variant="primary"
            icon="send"
            onClick={handleBooking}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
