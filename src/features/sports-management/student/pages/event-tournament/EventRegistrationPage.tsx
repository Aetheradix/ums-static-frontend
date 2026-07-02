import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  PreviewField,
  StatusBadge,
} from 'shared/new-components';

export default function EventRegistrationPage() {
  const [formData, setFormData] = useState({
    event: '',
    registrationType: '',
    teamOrStudent: '',
  });

  const handleSubmit = () => {
    if (
      !formData.event ||
      !formData.registrationType ||
      !formData.teamOrStudent
    ) {
      ToastService.error('Please fill in all required fields.');
      return;
    }
    ToastService.success('Event registration submitted successfully!');
    setFormData({
      event: '',
      registrationType: '',
      teamOrStudent: '',
    });
  };

  const eventOptions = [
    { id: '1', name: 'Inter-University Cricket Cup 2026' },
    { id: '2', name: 'Annual Sports Meet 2026' },
  ];

  const typeOptions = [
    { id: 'Individual', name: 'Individual' },
    { id: 'Team', name: 'Team' },
  ];

  const mockData = [
    {
      id: 1,
      event: 'Inter-University Cricket Cup 2026',
      type: 'Team',
      participant: "University Cricket Team - Men's 2026",
      date: '2026-06-20',
      status: 'Approved',
    },
    {
      id: 2,
      event: 'Annual Sports Meet 2026',
      type: 'Individual',
      participant: 'John Doe',
      date: '2026-06-25',
      status: 'Pending',
    },
  ];

  return (
    <FormPage
      title="Event Registration"
      description="Register yourself or your team for upcoming sports events and tournaments."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Event Management' },
        { label: 'Registration' },
      ]}
    >
      <FormCard title="Register for Event">
        <FormGrid>
          <DropDownList
            label="Select Event"
            data={eventOptions}
            textField="name"
            valueField="id"
            placeholder="Select an event"
            required
            value={formData.event}
            onChange={(val: any) => setFormData({ ...formData, event: val })}
          />
          <DropDownList
            label="Registration Type"
            data={typeOptions}
            textField="name"
            valueField="id"
            placeholder="Select registration type"
            required
            value={formData.registrationType}
            onChange={(val: any) =>
              setFormData({ ...formData, registrationType: val })
            }
          />
          <TextBox
            label={
              formData.registrationType === 'Team'
                ? 'Select Team'
                : 'Student Roll No'
            }
            placeholder={
              formData.registrationType === 'Team'
                ? 'Select from your managed teams'
                : 'Your Roll Number'
            }
            required
            value={formData.teamOrStudent}
            onChange={(val: any) =>
              setFormData({ ...formData, teamOrStudent: val })
            }
          />
        </FormGrid>
        <div className="flex justify-end mt-6">
          <Button
            label="Submit Registration"
            variant="primary"
            icon="how_to_reg"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-6">
        <FormCard
          title="My Registrations"
          icon="assignment_turned_in"
          className="shadow-none border border-gray-100"
        >
          {mockData && mockData.length > 0 ? (
            <div className="flex flex-col gap-6">
              {mockData.map((item: any, index: number) => (
                <FormGrid key={index} columns={3}>
                  <PreviewField label="Event Name" value={item.event} />
                  <PreviewField label="Registration Type" value={item.type} />
                  <PreviewField
                    label="Participant/Team Name"
                    value={item.participant}
                  />
                  <PreviewField label="Registration Date" value={item.date} />
                  <PreviewField
                    label="Status"
                    value={
                      <div className="mt-1">
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
                      </div>
                    }
                  />
                </FormGrid>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No registrations found.
            </p>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
