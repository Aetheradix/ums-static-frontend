import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FormWizard,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  categories,
  ticketTypes,
  venues,
  type Event,
  type Speaker,
} from '../../mocks';
import type { EventFormValues } from '../../api';
import {
  useCreateEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from '../../queries';
import { eventUrls } from '../../urls';
import { useEventForm, type EventFormData } from './event.hook';

const STATUS_OPTIONS = [
  { name: 'Draft', value: 'Draft' },
  { name: 'Pending Approval', value: 'Pending Approval' },
  { name: 'Approved', value: 'Approved' },
  { name: 'Published', value: 'Published' },
  { name: 'Ongoing', value: 'Ongoing' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Archived', value: 'Archived' },
];

const formatDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

const parseDate = (s?: string) => (s ? new Date(s) : undefined);

function toInitialData(e: Event): Partial<EventFormData> {
  return {
    code: e.code,
    title: e.title,
    description: e.description,
    categoryId: e.categoryId,
    venueId: e.venueId,
    organizer: e.organizer,
    startDate: parseDate(e.startDate),
    endDate: parseDate(e.endDate),
    startTime: e.startTime,
    capacity: e.capacity,
    ticketTypeId: e.ticketTypeId,
    status: e.status,
    speakers: e.speakers,
    reviewNotes: e.reviewNotes,
  };
}

function SpeakersStep({
  speakers,
  onChange,
}: {
  speakers: Speaker[];
  onChange: (next: Speaker[]) => void;
}) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');

  const add = () => {
    if (!name.trim()) {
      ToastService.error('Please enter a speaker name.');
      return;
    }
    onChange([
      ...speakers,
      { name: name.trim(), designation: designation.trim() },
    ]);
    setName('');
    setDesignation('');
  };

  const remove = (idx: number) => {
    onChange(speakers.filter((_, i) => i !== idx));
  };

  return (
    <FormCard title="Speakers & Performers" icon="users">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
        <TextBox
          label="Speaker Name"
          placeholder="e.g. Dr. A. Krishnan"
          value={name}
          onChange={setName}
        />
        <TextBox
          label="Designation"
          placeholder="e.g. Head of AI Lab"
          value={designation}
          onChange={setDesignation}
        />
        <Button
          label="Add Speaker"
          icon="plus"
          variant="outlined"
          onClick={add}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {speakers.length === 0 ? (
          <p className="text-sm text-gray-500">No speakers added yet.</p>
        ) : (
          speakers.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {s.name}
                </span>
                <span className="text-xs text-gray-400">
                  {s.designation || '—'}
                </span>
              </div>
              <Button
                icon="trash"
                variant="text"
                size="small"
                tooltip="Remove"
                ariaLabel="Remove speaker"
                onClick={() => remove(i)}
              />
            </div>
          ))
        )}
      </div>
    </FormCard>
  );
}

function EventFormInner({
  existing,
  eventsUrl,
}: {
  existing?: Event;
  eventsUrl: string;
}) {
  const navigate = useNavigate();
  const isEdit = !!existing;
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();

  const { register, handleSubmit, reset, trigger, watch, setValue } =
    useEventForm(
      async data => {
        const payload: EventFormValues = {
          code: data.code,
          title: data.title,
          description: data.description,
          categoryId: Number(data.categoryId),
          venueId: Number(data.venueId),
          organizer: data.organizer,
          startDate: formatDate(data.startDate) ?? '',
          endDate: formatDate(data.endDate) ?? '',
          startTime: data.startTime,
          capacity: Number(data.capacity),
          ticketTypeId: Number(data.ticketTypeId),
          status: data.status,
          speakers: data.speakers ?? [],
          reviewNotes: data.reviewNotes,
        };

        try {
          if (isEdit && existing) {
            await updateMutation.mutateAsync({
              id: existing.id,
              form: payload,
            });
            ToastService.success('Event updated successfully.');
          } else {
            await createMutation.mutateAsync(payload);
            ToastService.success('Event created successfully.');
          }
          navigate(eventsUrl);
        } catch {
          ToastService.error('Failed to save the event. Please try again.');
        }
      },
      existing ? toInitialData(existing) : undefined
    );

  const speakers = watch('speakers') ?? [];

  const steps: WizardStep[] = [
    {
      label: 'Basic Info',
      icon: 'file',
      content: (
        <FormCard title="Event Basic Information" icon="file">
          <FormGrid columns={2}>
            <TextBox
              {...register('code')}
              label="Event Code"
              placeholder="e.g. EVT-2026-011"
              required
              maxLength={40}
            />
            <TextBox
              {...register('title')}
              label="Event Title"
              placeholder="Short descriptive title"
              required
              maxLength={200}
            />
            <DropDownList
              {...register('categoryId')}
              label="Category"
              placeholder="Select Category"
              data={categories}
              textField="name"
              valueField="id"
              required
            />
            <TextBox
              {...register('organizer')}
              label="Organizer"
              placeholder="e.g. Cultural Committee"
              required
              maxLength={120}
            />
            <div className="col-span-full">
              <TextArea
                {...register('description')}
                label="Description"
                placeholder="Brief description of the event"
                rows={4}
              />
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Schedule & Venue',
      icon: 'calendar',
      content: (
        <FormCard title="Schedule & Venue" icon="calendar">
          <FormGrid columns={2}>
            <DatePicker
              {...register('startDate')}
              label="Start Date"
              placeholder="Select start date"
              required
            />
            <DatePicker
              {...register('endDate')}
              label="End Date"
              placeholder="Select end date"
              required
            />
            <TextBox
              {...register('startTime')}
              label="Start Time"
              placeholder="e.g. 17:00"
              maxLength={10}
            />
            <DropDownList
              {...register('venueId')}
              label="Venue"
              placeholder="Select Venue"
              data={venues}
              textField="name"
              valueField="id"
              required
            />
            <NumberBox
              {...register('capacity')}
              label="Capacity"
              placeholder="Total seats"
              min={0}
              required
            />
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Speakers',
      icon: 'users',
      content: (
        <SpeakersStep
          speakers={speakers}
          onChange={next => setValue('speakers', next)}
        />
      ),
    },
    {
      label: 'Ticketing',
      icon: 'ticket',
      content: (
        <FormCard title="Ticketing" icon="ticket">
          <FormGrid columns={2}>
            <DropDownList
              {...register('ticketTypeId')}
              label="Ticket Type"
              placeholder="Select Ticket Type"
              data={ticketTypes}
              textField="name"
              valueField="id"
              required
            />
            <div className="flex items-center rounded-lg border border-dashed border-gray-200 px-3 text-sm text-gray-500">
              Ticket price is derived from the selected ticket type.
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Review',
      icon: 'check-circle',
      content: (
        <FormCard title="Judgment & Review" icon="check-circle">
          <FormGrid columns={2}>
            <DropDownList
              {...register('status')}
              label="Status"
              placeholder="Select Status"
              data={STATUS_OPTIONS}
              textField="name"
              valueField="value"
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Current:</span>
              <StatusBadge label={watch('status') ?? 'Draft'} variant="info" />
            </div>
            <div className="col-span-full">
              <TextArea
                {...register('reviewNotes')}
                label="Review Notes"
                placeholder="Approval remarks, review notes or next steps"
                rows={4}
              />
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
  ];

  return (
    <FormPage
      title={isEdit ? 'Edit Event' : 'Create Event'}
      description={
        isEdit
          ? 'Update the details of the selected event.'
          : 'Create a new university event with ticketing and scheduling.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Events', to: eventsUrl },
        { label: isEdit ? 'Edit' : 'Create' },
      ]}
    >
      <FormWizard
        steps={steps}
        onComplete={handleSubmit as () => void}
        isSaving={createMutation.isPending || updateMutation.isPending}
        triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
        onReset={reset}
        isEdit={isEdit}
      />
    </FormPage>
  );
}

export default function EventForm({
  eventsUrl = eventUrls.admin.events,
}: {
  eventsUrl?: string;
}) {
  const { id } = useParams();
  const isEdit = !!id;
  const { data, isLoading } = useEventsQuery();
  const existing = isEdit ? data.find(e => String(e.id) === id) : undefined;

  if (isEdit && !existing) {
    return (
      <FormPage
        title="Edit Event"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Event & Ticketing Management', to: eventUrls.portal },
          { label: 'Events', to: eventsUrl },
          { label: 'Edit' },
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

  return (
    <EventFormInner
      key={existing?.id ?? 'new'}
      existing={existing}
      eventsUrl={eventsUrl}
    />
  );
}
