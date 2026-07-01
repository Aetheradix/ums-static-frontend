import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function EventCreationPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    type: '',
    sport: '',
    startDate: undefined,
    endDate: undefined,
    venue: '',
    deadline: undefined,
  });

  const typeOptions = [
    { id: 'Intra-College', name: 'Intra-College' },
    { id: 'Inter-College', name: 'Inter-College' },
    { id: 'Inter-University', name: 'Inter-University' },
  ];

  const sportsOptions = [
    { id: 'Cricket', name: 'Cricket' },
    { id: 'Football', name: 'Football' },
    { id: 'Athletics', name: 'Athletics' },
  ];

  const venueOptions = [
    { id: 'Main Cricket Ground', name: 'Main Cricket Ground' },
    { id: 'Indoor Hall', name: 'Indoor Hall' },
  ];

  const mockData = [
    {
      id: 1,
      eventName: 'Inter-University Cricket Cup 2026',
      type: 'Inter-University',
      sport: 'Cricket',
      startDate: '2026-10-15',
      deadline: '2026-09-30',
      status: 'Upcoming',
    },
    {
      id: 2,
      eventName: 'Annual Sports Meet 2025',
      type: 'Intra-College',
      sport: 'Athletics',
      startDate: '2025-11-20',
      deadline: '2025-11-10',
      status: 'Completed',
    },
  ];

  const handleSave = () => {
    ToastService.success('Event created successfully!');
    setFormData({
      eventName: '',
      type: '',
      sport: '',
      startDate: undefined,
      endDate: undefined,
      venue: '',
      deadline: undefined,
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Event / Tournament Creation"
      description="Create and schedule new sports events and tournaments."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Event Management' },
        { label: 'Event Creation' },
      ]}
    >
      <FormCard
        title="Events List"
        headerAction={
          <Button
            label="Create New Event"
            icon="event_available"
            type="button"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        }
      >
        <GridPanel
          data={mockData}
          columns={[
            { field: 'eventName', header: 'Event Name' },
            { field: 'type', header: 'Type' },
            { field: 'sport', header: 'Sport' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'deadline', header: 'Reg. Deadline' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'Upcoming'
                        ? 'pending'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Create New Event"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              type="button"
              variant="outlined"
              onClick={() => setShowPopup(false)}
            />
            <Button
              label="Create Event"
              type="button"
              icon="event_available"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <TextBox
            label="Event Name"
            placeholder="e.g. Inter-University Cricket Cup"
            required
            value={formData.eventName}
            onChange={(val: any) =>
              setFormData({ ...formData, eventName: val })
            }
          />
          <DropDownList
            label="Event Type"
            data={typeOptions}
            textField="name"
            valueField="id"
            placeholder="Select Event Type"
            required
            value={formData.type}
            onChange={(val: any) => setFormData({ ...formData, type: val })}
          />
          <DropDownList
            label="Sport"
            data={sportsOptions}
            textField="name"
            valueField="id"
            placeholder="Select Sport"
            required
            value={formData.sport}
            onChange={(val: any) => setFormData({ ...formData, sport: val })}
          />
          <DropDownList
            label="Venue / Facility"
            data={venueOptions}
            textField="name"
            valueField="id"
            placeholder="Select Venue"
            required
            value={formData.venue}
            onChange={(val: any) => setFormData({ ...formData, venue: val })}
          />
          <DatePicker
            label="Start Date"
            required
            value={formData.startDate}
            onChange={(val: any) =>
              setFormData({ ...formData, startDate: val })
            }
          />
          <DatePicker
            label="End Date"
            required
            value={formData.endDate}
            onChange={(val: any) => setFormData({ ...formData, endDate: val })}
          />
          <DatePicker
            label="Registration Deadline"
            required
            value={formData.deadline}
            onChange={(val: any) => setFormData({ ...formData, deadline: val })}
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
