import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  courses,
  faculty,
  rooms,
  sections,
  timeSlots,
  WEEK_DAYS,
  type WeekDay,
} from '../../mocks';
import { useCreateAssignmentMutation, useEntriesQuery } from '../../queries';
import { timetableUrls } from '../../urls';

const DAY_OPTIONS = WEEK_DAYS.map(d => ({ name: d, value: d }));
const PERIOD_OPTIONS = timeSlots.map(s => ({
  name: `${s.label} (${s.startTime}-${s.endTime})`,
  value: s.period,
}));

export default function Assignments() {
  const { data: entries, isLoading } = useEntriesQuery();
  const createMutation = useCreateAssignmentMutation();

  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [day, setDay] = useState<WeekDay>('Monday');
  const [period, setPeriod] = useState<number>(1);

  const resetForm = () => {
    setCourseId(null);
    setSectionId(null);
    setFacultyId(null);
    setRoomId(null);
    setDay('Monday');
    setPeriod(1);
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!courseId || !sectionId || !facultyId || !roomId) {
      ToastService.error('Please select course, section, faculty and room.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        day,
        period,
        courseId,
        sectionId,
        facultyId,
        roomId,
      });
      ToastService.success('Course assigned successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to save the assignment.');
    }
  };

  return (
    <FormPage
      title="Course Assignment"
      description="Assign a course, section, faculty and room to a day and period."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Scheduler', to: timetableUrls.scheduler.portal },
        { label: 'Course Assignment' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={entries}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by course, faculty or room..."
          toolbar={
            <Button
              label="Assign Course"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            { field: 'day', header: 'Day', sortable: true },
            { field: 'timeLabel', header: 'Slot' },
            { field: 'courseName', header: 'Course' },
            { field: 'sectionName', header: 'Section' },
            { field: 'facultyName', header: 'Faculty' },
            { field: 'roomName', header: 'Room' },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="Assign Course"
        subtitle="Allocate a course to a section, faculty, room and slot."
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
              label="Faculty"
              placeholder="Select Faculty"
              data={faculty}
              textField="name"
              valueField="id"
              value={facultyId}
              onChange={val => setFacultyId(val as number)}
              required
            />
            <DropDownList
              label="Room"
              placeholder="Select Room"
              data={rooms}
              textField="name"
              valueField="id"
              value={roomId}
              onChange={val => setRoomId(val as number)}
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
            <DropDownList
              label="Period"
              data={PERIOD_OPTIONS}
              textField="name"
              valueField="value"
              value={period}
              onChange={val => setPeriod(val as number)}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setOpen(false)}
            />
            <Button
              label="Save"
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
