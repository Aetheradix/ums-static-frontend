import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState, KeyValueTile, SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function StudentDashboard() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const allocation = data.allocations.find(
    a => a.studentId === MOCK_STUDENT_ID && a.status === 'Active'
  );
  const room = data.rooms.find(r => r.id === allocation?.roomId);
  const hostel = data.hostels.find(h => h.id === allocation?.hostelId);

  const stats = useMemo(() => {
    const payments = data.payments.filter(p => p.studentId === MOCK_STUDENT_ID);
    const attendance = data.attendance.filter(
      a => a.studentId === MOCK_STUDENT_ID
    );
    const present = attendance.filter(a => a.status === 'Present').length;

    return {
      dues: payments
        .filter(p => p.status === 'Pending')
        .reduce((s, p) => s + p.amount, 0),
      paid: payments
        .filter(p => p.status === 'Paid')
        .reduce((s, p) => s + p.amount, 0),
      attendanceRate: attendance.length
        ? Math.round((present / attendance.length) * 100)
        : 0,
      openLeave: data.leaveRequests.filter(
        l => l.studentId === MOCK_STUDENT_ID && l.status === 'Pending'
      ).length,
      warnings: data.warnings.filter(
        w => w.studentId === MOCK_STUDENT_ID && !w.acknowledged
      ).length,
      openGrievances: data.grievances.filter(
        g =>
          g.studentId === MOCK_STUDENT_ID &&
          (g.status === 'Open' || g.status === 'In Progress')
      ).length,
      currentlyOut: data.inOutEntries.filter(
        e => e.studentId === MOCK_STUDENT_ID && e.status !== 'Returned'
      ).length,
    };
  }, [data]);

  const upcomingActivities = useMemo(
    () =>
      data.activities
        .filter(a => a.status === 'Planned' && a.activityDate >= today())
        .sort((a, b) => a.activityDate.localeCompare(b.activityDate))
        .slice(0, 4),
    [data.activities]
  );

  const todaysMenu = useMemo(() => {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const entries = data.messMenu.filter(m => m.day === dayName);
    return entries.length > 0
      ? { day: dayName, entries }
      : {
          day: dayName,
          entries: data.messMenu.filter(m => m.day === 'Monday'),
        };
  }, [data.messMenu]);

  return (
    <FormPage
      title={`Welcome, ${MOCK_STUDENT_NAME}`}
      description={
        hostel
          ? `${hostel.nameEn} · Room ${room?.roomNumber ?? '—'}`
          : 'Your hostel dashboard'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Dashboard')}
      headerAction={
        <Button
          label="My Room"
          icon="home"
          variant="primary"
          onClick={() => navigate(hmsUrls.student.myRoom)}
        />
      }
    >
      <FormGrid columns={4}>
        <StatCard
          title="My Room"
          value={room?.roomNumber ?? 'Not allotted'}
          icon="meeting_room"
          colorScheme="blue"
          subtitle={room ? `${room.roomType} · ${room.floor}` : undefined}
        />
        <StatCard
          title="Outstanding Dues"
          value={`₹${stats.dues.toLocaleString()}`}
          icon="payments"
          colorScheme={stats.dues > 0 ? 'orange' : 'green'}
          subtitle={`₹${stats.paid.toLocaleString()} paid so far`}
        />
        <StatCard
          title="Attendance"
          value={`${stats.attendanceRate}%`}
          icon="event_available"
          colorScheme={stats.attendanceRate >= 75 ? 'green' : 'red'}
        />
        <StatCard
          title="Pending Leave"
          value={stats.openLeave}
          icon="directions_walk"
          colorScheme="indigo"
        />
      </FormGrid>

      {stats.warnings > 0 && (
        <SectionNote tone="warning" title="Warnings to acknowledge">
          You have {stats.warnings} warning
          {stats.warnings === 1 ? '' : 's'} you have not acknowledged.{' '}
          <button
            type="button"
            className="font-bold underline"
            onClick={() => navigate(hmsUrls.student.warnings)}
          >
            Open My Warnings
          </button>
        </SectionNote>
      )}

      {stats.currentlyOut > 0 && (
        <SectionNote tone="info" title="You are marked out of the hostel">
          Remember to mark yourself in when you return, from In &amp; Out Entry.
        </SectionNote>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormCard
          title={`Today's Mess Menu · ${todaysMenu.day}`}
          icon="restaurant"
          headerAction={
            <Button
              label="Full Menu"
              icon="arrow-right"
              variant="outlined"
              size="small"
              onClick={() => navigate(hmsUrls.student.messMenu)}
            />
          }
        >
          {todaysMenu.entries.length === 0 ? (
            <EmptyState
              icon="restaurant"
              title="No menu published"
              hint="Your warden has not published the mess menu yet."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {todaysMenu.entries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                >
                  <StatusBadge label={entry.meal} variant="info" />
                  <p className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">
                    {entry.items}
                  </p>
                </div>
              ))}
            </div>
          )}
        </FormCard>

        <FormCard
          title="Upcoming Activities"
          icon="calendar"
          headerAction={
            <Button
              label="All Activities"
              icon="arrow-right"
              variant="outlined"
              size="small"
              onClick={() => navigate(hmsUrls.student.activities)}
            />
          }
        >
          {upcomingActivities.length === 0 ? (
            <EmptyState
              icon="sports_soccer"
              title="Nothing scheduled"
              hint="Activities your warden schedules will show up here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingActivities.map(activity => (
                <div
                  key={activity.id}
                  className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {activity.title}
                    </p>
                    <StatusBadge
                      label={
                        activity.participants.includes(MOCK_STUDENT_ID)
                          ? 'Registered'
                          : 'Open'
                      }
                      variant={
                        activity.participants.includes(MOCK_STUDENT_ID)
                          ? 'success'
                          : 'neutral'
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {activity.activityDate} · {activity.startTime}–
                    {activity.endTime} · {activity.venue}
                  </p>
                </div>
              ))}
            </div>
          )}
        </FormCard>
      </div>

      <FormCard
        title="My Hostel at a Glance"
        subtitle="Key details you may need to quote to the warden office."
        icon="id-card"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KeyValueTile label="Student ID" value={MOCK_STUDENT_ID} mono />
          <KeyValueTile label="Hostel" value={hostel?.nameEn ?? '—'} />
          <KeyValueTile label="Room" value={room?.roomNumber ?? '—'} mono />
          <KeyValueTile label="Warden" value={hostel?.wardenName ?? '—'} />
        </div>
      </FormCard>

      <FormCard title="My Recent Payments" icon="list">
        <GridPanel
          data={data.payments
            .filter(p => p.studentId === MOCK_STUDENT_ID)
            .slice(0, 5)}
          emptyMessage="No payments recorded yet."
          columns={[
            { field: 'paymentType', header: 'Payment Type', width: 170 },
            { field: 'period', header: 'Period', width: 170 },
            {
              field: 'amount',
              header: 'Amount',
              width: 130,
              cell: item => <>₹{item.amount.toLocaleString()}</>,
            },
            { field: 'paymentDate', header: 'Paid On', width: 130 },
            {
              field: 'status',
              header: 'Status',
              width: 120,
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Paid'
                      ? 'success'
                      : item.status === 'Pending'
                        ? 'pending'
                        : 'danger'
                  }
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
