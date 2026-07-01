import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  courses,
  faculty,
  sections,
  statusVariant,
  WEEK_DAYS,
  type Substitution,
  type WeekDay,
} from '../../mocks';
import {
  useCreateSubstitutionMutation,
  useSubstitutionsQuery,
} from '../../queries';
import { timetableUrls } from '../../urls';

// Static prototype — assume the logged-in faculty is the first one.
const CURRENT_FACULTY = faculty[0];

const DAY_OPTIONS = WEEK_DAYS.map(d => ({ name: d, value: d }));

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function Substitutions() {
  const { data: substitutions, isLoading } = useSubstitutionsQuery();
  const createMutation = useCreateSubstitutionMutation();

  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [substituteId, setSubstituteId] = useState<number | null>(null);
  const [day, setDay] = useState<WeekDay>('Monday');
  const [timeLabel, setTimeLabel] = useState('');
  const [reason, setReason] = useState('');

  const resetForm = () => {
    setCourseId(null);
    setSectionId(null);
    setSubstituteId(null);
    setDay('Monday');
    setTimeLabel('');
    setReason('');
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!courseId || !sectionId || !substituteId) {
      ToastService.error('Please select course, section and substitute.');
      return;
    }
    if (!reason.trim()) {
      ToastService.error('Please provide a reason.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        requestedBy: CURRENT_FACULTY.name,
        courseId,
        sectionId,
        day,
        timeLabel: timeLabel || '09:00 - 09:55',
        facultyId: substituteId,
        reason,
        requestedOn: formatDate(new Date()),
        status: 'Under Review',
      });
      ToastService.success('Substitution request submitted.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to submit the request.');
    }
  };

  return (
    <FormPage
      title="Substitution Requests"
      description="Request a substitute for a class you are unable to take."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Faculty', to: timetableUrls.faculty.portal },
        { label: 'Substitution Requests' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={substitutions}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by course, section or substitute..."
          toolbar={
            <Button
              label="Request Substitution"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            { field: 'requestedBy', header: 'Requested By', sortable: true },
            { field: 'courseName', header: 'Course' },
            { field: 'sectionName', header: 'Section' },
            { field: 'day', header: 'Day' },
            { field: 'timeLabel', header: 'Slot' },
            { field: 'substituteName', header: 'Substitute' },
            { field: 'requestedOn', header: 'Requested On' },
            {
              header: 'Status',
              cell: (s: Substitution) => (
                <StatusBadge
                  label={s.status}
                  variant={statusVariant(s.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="Request Substitution"
        subtitle="Nominate a substitute for one of your classes."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DropDownList
              label="Course"
              placeholder="Select Course"
              data={courses}
              textField="name"
              valueField="id"
              value={courseId}
              onChange={val => setCourseId(val as number)}
              required
            />
            <DropDownList
              label="Section"
              placeholder="Select Section"
              data={sections}
              textField="name"
              valueField="id"
              value={sectionId}
              onChange={val => setSectionId(val as number)}
              required
            />
            <DropDownList
              label="Day"
              data={DAY_OPTIONS}
              textField="name"
              valueField="value"
              value={day}
              onChange={val => setDay(val as WeekDay)}
            />
            <TextBox
              label="Time Slot"
              placeholder="e.g. 09:00 - 09:55"
              value={timeLabel}
              onChange={setTimeLabel}
            />
            <DropDownList
              label="Substitute Faculty"
              placeholder="Select Substitute"
              data={faculty}
              textField="name"
              valueField="id"
              value={substituteId}
              onChange={val => setSubstituteId(val as number)}
              required
            />
          </div>
          <TextArea
            label="Reason"
            placeholder="Reason for the substitution"
            value={reason}
            onChange={setReason}
            rows={3}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setOpen(false)}
            />
            <Button
              label="Submit"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
