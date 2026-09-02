import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  now,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { InOutEntry as Entry } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const STATUS_VARIANT = {
  Out: 'warning',
  Returned: 'success',
  Overdue: 'danger',
} as const;

const blank = () => ({
  durationType: 'Short' as Entry['durationType'],
  purpose: '',
  destination: '',
  outDate: today(),
  outTime: now(),
  expectedReturnDate: today(),
  expectedReturnTime: '',
});

export default function InOutEntry() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();
  const [form, setForm] = useState(blank);

  const rows = useMemo(
    () =>
      isStudent
        ? data.inOutEntries.filter(e => e.studentId === MOCK_STUDENT_ID)
        : data.inOutEntries.filter(e => e.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.inOutEntries, isStudent]
  );

  const stats = useMemo(
    () => ({
      out: rows.filter(e => e.status === 'Out').length,
      overdue: rows.filter(e => e.status === 'Overdue').length,
      returned: rows.filter(e => e.status === 'Returned').length,
    }),
    [rows]
  );

  const handleSubmit = () => {
    add('inOutEntries', {
      id: uid('IO'),
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      durationType: form.durationType,
      purpose: form.purpose,
      destination: form.destination,
      outDate: form.outDate,
      outTime: form.outTime,
      expectedReturnDate:
        form.durationType === 'Short' ? form.outDate : form.expectedReturnDate,
      expectedReturnTime: form.expectedReturnTime,
      inDate: '',
      inTime: '',
      status: 'Out',
      recordedBy: MOCK_STUDENT_NAME,
    });
    setForm(blank());
    ToastService.success('Out entry recorded. The warden can see it now.');
  };

  const markIn = (entry: Entry) => {
    update('inOutEntries', entry.id, {
      ...entry,
      inDate: today(),
      inTime: now(),
      status: 'Returned',
    });
    ToastService.success(`${entry.studentName} marked as returned.`);
  };

  return (
    <FormPage
      title={isStudent ? 'My In & Out Entries' : 'In & Out Register'}
      description={
        isStudent
          ? 'Record every time you leave the hostel — a short outing on the same day, or a long absence over several days.'
          : 'Movements recorded by residents of your hostel. Mark a student in when they return.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'In & Out Entry')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Currently Out"
          value={stats.out}
          icon="logout"
          colorScheme="amber"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon="warning"
          colorScheme="red"
        />
        <StatCard
          title="Returned"
          value={stats.returned}
          icon="login"
          colorScheme="green"
        />
      </FormGrid>

      {isStudent && (
        <FormCard
          title="Record an Out Entry"
          subtitle="Short duration is a same-day outing; long duration spans nights away."
          icon="sign-out"
        >
          <FormGrid columns={4}>
            <DropDownList
              label="Duration Type"
              data={[
                { id: 'Short', text: 'Short Duration (same day)' },
                { id: 'Long', text: 'Long Duration (overnight)' },
              ]}
              textField="text"
              valueField="id"
              value={form.durationType}
              onChange={v =>
                setForm({
                  ...form,
                  durationType: (v as Entry['durationType']) ?? 'Short',
                })
              }
            />
            <TextBox
              label="Purpose"
              placeholder="e.g. Market visit"
              value={form.purpose}
              onChange={v => setForm({ ...form, purpose: v })}
            />
            <TextBox
              label="Destination"
              placeholder="Where you are going"
              value={form.destination}
              onChange={v => setForm({ ...form, destination: v })}
            />
            <TextBox
              label="Out Date"
              type="date"
              value={form.outDate}
              onChange={v => setForm({ ...form, outDate: v })}
            />
            <TextBox
              label="Out Time"
              type="time"
              value={form.outTime}
              onChange={v => setForm({ ...form, outTime: v })}
            />
            {form.durationType === 'Long' ? (
              <TextBox
                label="Expected Return Date"
                type="date"
                value={form.expectedReturnDate}
                onChange={v => setForm({ ...form, expectedReturnDate: v })}
              />
            ) : (
              <TextBox
                label="Expected Return Time"
                type="time"
                value={form.expectedReturnTime}
                onChange={v => setForm({ ...form, expectedReturnTime: v })}
              />
            )}
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Record Entry"
              variant="primary"
              icon="sign-out"
              onClick={handleSubmit}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      {!isStudent && (
        <SectionNote tone="info">
          Students record their own out entries. Mark them in from the register
          below when they are back in the hostel.
        </SectionNote>
      )}

      <FormCard
        title={isStudent ? 'My Movement History' : 'Gate Register'}
        icon="list"
      >
        <GridPanel<Entry>
          data={rows}
          searchBox
          searchPlaceholder="Search by student, purpose or destination..."
          searchFields={['studentName', 'purpose', 'destination']}
          pagination
          emptyMessage="No movements recorded yet."
          columns={[
            ...(isStudent
              ? []
              : [
                  {
                    field: 'studentName' as const,
                    header: 'Student',
                    cell: (e: Entry) => (
                      <div className="flex flex-col">
                        <span className="font-semibold">{e.studentName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {e.studentId}
                        </span>
                      </div>
                    ),
                  },
                ]),
            {
              field: 'durationType',
              header: 'Duration',
              cell: e => (
                <StatusBadge
                  label={e.durationType}
                  variant={e.durationType === 'Long' ? 'info' : 'neutral'}
                />
              ),
            },
            { field: 'purpose', header: 'Purpose' },
            { field: 'destination', header: 'Destination' },
            {
              field: 'outDate',
              header: 'Out',
              cell: e => (
                <>
                  {e.outDate} {e.outTime}
                </>
              ),
            },
            {
              field: 'expectedReturnDate',
              header: 'Expected Back',
              cell: e => (
                <>
                  {e.expectedReturnDate} {e.expectedReturnTime}
                </>
              ),
            },
            {
              field: 'inDate',
              header: 'In',
              cell: e =>
                e.inDate ? (
                  <>
                    {e.inDate} {e.inTime}
                  </>
                ) : (
                  <span className="text-slate-400">—</span>
                ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: e => (
                <StatusBadge
                  label={e.status}
                  variant={STATUS_VARIANT[e.status]}
                />
              ),
            },
            ...(isStudent
              ? []
              : [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (e: Entry) =>
                      e.status === 'Returned' ? (
                        <span className="text-xs text-slate-400">Closed</span>
                      ) : (
                        <Button
                          label="Mark In"
                          icon="sign-in"
                          variant="success"
                          size="small"
                          onClick={() => markIn(e)}
                        />
                      ),
                  },
                ]),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
