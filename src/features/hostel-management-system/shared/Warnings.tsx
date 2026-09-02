import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
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
import type { Warning } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const SEVERITY_VARIANT = {
  Low: 'info',
  Medium: 'warning',
  High: 'danger',
} as const;

const blank = () => ({
  studentId: '',
  studentName: '',
  warningTypeId: '',
  description: '',
  fineAmount: 0,
});

export default function Warnings() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();
  const [form, setForm] = useState(blank);

  const rows = useMemo(
    () =>
      isStudent
        ? data.warnings.filter(w => w.studentId === MOCK_STUDENT_ID)
        : data.warnings.filter(w => w.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.warnings, isStudent]
  );

  const stats = useMemo(
    () => ({
      total: rows.length,
      high: rows.filter(w => w.severity === 'High').length,
      pending: rows.filter(w => !w.acknowledged).length,
    }),
    [rows]
  );

  const residents = useMemo(
    () =>
      data.allocations
        .filter(
          a => a.hostelId === MOCK_WARDEN_HOSTEL_ID && a.status === 'Active'
        )
        .map(a => ({
          id: a.studentId,
          text: `${a.studentName} (${a.studentId})`,
        })),
    [data.allocations]
  );

  const typeName = (id: string) =>
    data.warningTypes.find(t => t.id === id)?.name ?? '—';

  const issue = () => {
    const type = data.warningTypes.find(t => t.id === form.warningTypeId);
    add('warnings', {
      id: uid('WN'),
      studentId: form.studentId,
      studentName:
        form.studentName ||
        residents.find(r => r.id === form.studentId)?.text.split(' (')[0] ||
        '',
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      warningTypeId: form.warningTypeId,
      severity: type?.severity ?? 'Low',
      description: form.description,
      issuedBy: MOCK_WARDEN_NAME,
      issuedOn: today(),
      fineAmount: form.fineAmount,
      acknowledged: false,
    });
    setForm(blank());
    ToastService.success(
      'Warning issued — the student sees it on their portal.'
    );
  };

  const acknowledge = (w: Warning) => {
    update('warnings', w.id, { ...w, acknowledged: true });
    ToastService.success('Warning acknowledged.');
  };

  return (
    <FormPage
      title={isStudent ? 'My Warnings' : 'Student Warnings'}
      description={
        isStudent
          ? 'Warnings issued to you by the warden. Acknowledge each one so the warden knows you have read it.'
          : 'Issue a warning for misbehaviour or indiscipline. It appears on the student portal immediately.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Student Warnings')}
    >
      <FormGrid columns={3}>
        <StatCard
          title={isStudent ? 'Warnings Received' : 'Warnings Issued'}
          value={stats.total}
          icon="warning"
          colorScheme="amber"
        />
        <StatCard
          title="High Severity"
          value={stats.high}
          icon="flag"
          colorScheme="red"
        />
        <StatCard
          title="Awaiting Acknowledgement"
          value={stats.pending}
          icon="notifications"
          colorScheme="orange"
        />
      </FormGrid>

      {!isStudent && (
        <FormCard title="Issue a Warning" icon="exclamation-triangle">
          <FormGrid columns={4}>
            <DropDownList
              label="Student"
              data={residents}
              textField="text"
              valueField="id"
              filter
              value={form.studentId}
              onChange={v => {
                const id = (v as string) ?? '';
                setForm({
                  ...form,
                  studentId: id,
                  studentName:
                    residents.find(r => r.id === id)?.text.split(' (')[0] ?? '',
                });
              }}
            />
            <DropDownList
              label="Warning Type"
              data={data.warningTypes.map(t => ({
                id: t.id,
                text: `${t.name} (${t.severity})`,
              }))}
              textField="text"
              valueField="id"
              value={form.warningTypeId}
              onChange={v =>
                setForm({ ...form, warningTypeId: (v as string) ?? '' })
              }
            />
            <NumberBox
              label="Fine Amount (₹)"
              min={0}
              value={form.fineAmount}
              onChange={v => setForm({ ...form, fineAmount: v ?? 0 })}
            />
            <TextBox
              label="Issued On"
              type="date"
              value={today()}
              disabled
              onChange={() => undefined}
            />
            <div className="md:col-span-4">
              <TextArea
                label="Incident Description"
                rows={2}
                placeholder="What happened, when, and who reported it"
                value={form.description}
                onChange={v => setForm({ ...form, description: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Issue Warning"
              variant="primary"
              icon="send"
              onClick={issue}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title={isStudent ? 'Warning History' : 'All Warnings'}
        icon="list"
      >
        <GridPanel<Warning>
          data={rows}
          searchBox
          searchPlaceholder="Search by student or description..."
          searchFields={['studentName', 'description']}
          pagination
          emptyMessage={
            isStudent
              ? 'No warnings on your record.'
              : 'No warnings issued yet.'
          }
          columns={[
            ...(isStudent
              ? []
              : [{ field: 'studentName' as const, header: 'Student' }]),
            {
              field: 'warningTypeId',
              header: 'Warning Type',
              cell: w => <>{typeName(w.warningTypeId)}</>,
            },
            {
              field: 'severity',
              header: 'Severity',
              cell: w => (
                <StatusBadge
                  label={w.severity}
                  variant={SEVERITY_VARIANT[w.severity]}
                />
              ),
            },
            { field: 'description', header: 'Description' },
            { field: 'issuedBy', header: 'Issued By' },
            { field: 'issuedOn', header: 'Issued On' },
            {
              field: 'fineAmount',
              header: 'Fine',
              cell: w => (
                <>{w.fineAmount ? `₹${w.fineAmount.toLocaleString()}` : '—'}</>
              ),
            },
            {
              field: 'acknowledged',
              header: 'Acknowledged',
              cell: w =>
                w.acknowledged ? (
                  <StatusBadge label="Acknowledged" variant="success" />
                ) : isStudent ? (
                  <Button
                    label="Acknowledge"
                    icon="check"
                    variant="outlined"
                    size="small"
                    onClick={() => acknowledge(w)}
                  />
                ) : (
                  <StatusBadge label="Pending" variant="pending" />
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
