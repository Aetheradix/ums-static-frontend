import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import {
  MOCK_STUDENT_ID,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Activity } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const VARIANT = {
  Planned: 'info',
  Ongoing: 'warning',
  Completed: 'success',
  Cancelled: 'muted',
} as const;

const STATUSES: Activity['status'][] = [
  'Planned',
  'Ongoing',
  'Completed',
  'Cancelled',
];

const blank = () => ({
  title: '',
  activityTypeId: '',
  description: '',
  venue: '',
  activityDate: today(),
  startTime: '',
  endTime: '',
  coordinator: MOCK_WARDEN_NAME,
  status: 'Planned' as Activity['status'],
});

export default function Activities() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();
  const [form, setForm] = useState(blank);

  const rows = useMemo(
    () => data.activities.filter(a => a.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.activities]
  );

  const typeName = (id: string) =>
    data.activityTypes.find(t => t.id === id)?.name ?? '—';

  const stats = useMemo(
    () => ({
      upcoming: rows.filter(a => a.status === 'Planned').length,
      completed: rows.filter(a => a.status === 'Completed').length,
      mine: rows.filter(a => a.participants.includes(MOCK_STUDENT_ID)).length,
    }),
    [rows]
  );

  const publish = () => {
    add('activities', {
      id: uid('AC'),
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      title: form.title,
      activityTypeId: form.activityTypeId,
      description: form.description,
      venue: form.venue,
      activityDate: form.activityDate,
      startTime: form.startTime,
      endTime: form.endTime,
      coordinator: form.coordinator,
      status: form.status,
      participants: [],
    });
    setForm(blank());
    ToastService.success('Activity published to the student portal.');
  };

  const toggle = (a: Activity) => {
    const joined = a.participants.includes(MOCK_STUDENT_ID);
    update('activities', a.id, {
      ...a,
      participants: joined
        ? a.participants.filter(p => p !== MOCK_STUDENT_ID)
        : [...a.participants, MOCK_STUDENT_ID],
    });
    ToastService.success(
      joined
        ? `Withdrawn from ${a.title}.`
        : `You are registered for ${a.title}.`
    );
  };

  return (
    <FormPage
      title="Curricular Activities"
      description={
        isStudent
          ? 'Sports, cultural and wellness activities run by your hostel. Register for the ones you want to join.'
          : 'Schedule curricular and co-curricular activities and track who has registered.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Curricular Activities')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          icon="calendar_today"
          colorScheme="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title={isStudent ? 'My Registrations' : 'With Participants'}
          value={
            isStudent
              ? stats.mine
              : rows.filter(a => a.participants.length > 0).length
          }
          icon="groups"
          colorScheme="purple"
        />
      </FormGrid>

      {!isStudent && (
        <FormCard title="Schedule an Activity" icon="calendar-plus">
          <FormGrid columns={4}>
            <TextBox
              label="Activity Title"
              placeholder="e.g. Inter-Hostel Cricket Tournament"
              value={form.title}
              onChange={v => setForm({ ...form, title: v })}
            />
            <DropDownList
              label="Activity Type"
              data={data.activityTypes.map(t => ({
                id: t.id,
                text: `${t.name} (${t.category})`,
              }))}
              textField="text"
              valueField="id"
              value={form.activityTypeId}
              onChange={v =>
                setForm({ ...form, activityTypeId: (v as string) ?? '' })
              }
            />
            <TextBox
              label="Venue"
              value={form.venue}
              onChange={v => setForm({ ...form, venue: v })}
            />
            <TextBox
              label="Coordinator"
              value={form.coordinator}
              onChange={v => setForm({ ...form, coordinator: v })}
            />
            <TextBox
              label="Activity Date"
              type="date"
              value={form.activityDate}
              onChange={v => setForm({ ...form, activityDate: v })}
            />
            <TextBox
              label="Start Time"
              type="time"
              value={form.startTime}
              onChange={v => setForm({ ...form, startTime: v })}
            />
            <TextBox
              label="End Time"
              type="time"
              value={form.endTime}
              onChange={v => setForm({ ...form, endTime: v })}
            />
            <DropDownList
              label="Status"
              data={STATUSES.map(s => ({ id: s, text: s }))}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v =>
                setForm({
                  ...form,
                  status: (v as Activity['status']) ?? 'Planned',
                })
              }
            />
            <div className="md:col-span-4">
              <TextArea
                label="Description"
                rows={2}
                placeholder="What the activity involves and who can take part"
                value={form.description}
                onChange={v => setForm({ ...form, description: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Publish Activity"
              variant="primary"
              icon="send"
              onClick={publish}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      <FormCard title="Activity Calendar" icon="list">
        <GridPanel<Activity>
          data={rows}
          searchBox
          searchPlaceholder="Search by title, venue or coordinator..."
          searchFields={['title', 'venue', 'coordinator']}
          pagination
          emptyMessage="No activities scheduled yet."
          columns={[
            {
              field: 'title',
              header: 'Activity',
              cell: a => (
                <div className="flex flex-col">
                  <span className="font-semibold">{a.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {typeName(a.activityTypeId)}
                  </span>
                </div>
              ),
            },
            { field: 'venue', header: 'Venue' },
            {
              field: 'activityDate',
              header: 'When',
              cell: a => (
                <>
                  {a.activityDate}
                  {a.startTime && (
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {a.startTime} – {a.endTime}
                    </span>
                  )}
                </>
              ),
            },
            { field: 'coordinator', header: 'Coordinator' },
            {
              field: 'participants',
              header: 'Registered',
              width: 110,
              cell: a => <>{a.participants.length}</>,
            },
            {
              field: 'status',
              header: 'Status',
              width: 120,
              cell: a => (
                <StatusBadge label={a.status} variant={VARIANT[a.status]} />
              ),
            },
            ...(isStudent
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (a: Activity) => {
                      const joined = a.participants.includes(MOCK_STUDENT_ID);
                      if (
                        a.status === 'Completed' ||
                        a.status === 'Cancelled'
                      ) {
                        return (
                          <span className="text-xs text-slate-400">
                            {joined ? 'Participated' : '—'}
                          </span>
                        );
                      }
                      return (
                        <Button
                          label={joined ? 'Withdraw' : 'Register'}
                          icon={joined ? 'times' : 'check'}
                          variant={joined ? 'outlined' : 'success'}
                          size="small"
                          onClick={() => toggle(a)}
                        />
                      );
                    },
                  },
                ]
              : []),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
