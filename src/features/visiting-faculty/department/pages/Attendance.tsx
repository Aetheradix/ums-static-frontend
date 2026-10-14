import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import SelectableGrid from '../../components/SelectableGrid';
import { crumbs, useFaculty, useSelection } from '../../components/hooks';
import { DeptSwitcher, StageNote, UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { DailyLog, LogStatus, TeachingSession } from '../../types';
import {
  billAmountOf,
  countSessions,
  formatDate,
  inr,
  logVariant,
  periodLabel,
  periodOf,
} from '../../utils';

/**
 * Attendance and lectures entered by visiting faculty from the mobile app,
 * by teacher and date. The department verifies them before billing.
 */
export default function Attendance() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const logs = useVisitingFacultyStore(s => s.logs);
  const rates = useVisitingFacultyStore(s => s.rates);
  const verifyLogs = useVisitingFacultyStore(s => s.verifyLogs);
  const rejectLog = useVisitingFacultyStore(s => s.rejectLog);
  const faculty = useFaculty();

  const deptLogs = logs.filter(l => l.department === dept);
  const periods = useMemo(
    () => [...new Set(deptLogs.map(l => periodOf(l.date)))].sort().reverse(),
    [deptLogs]
  );

  const [period, setPeriod] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [status, setStatus] = useState<LogStatus | ''>('Pending');
  const [viewing, setViewing] = useState<DailyLog | null>(null);
  const [rejecting, setRejecting] = useState<DailyLog | null>(null);
  const [remarks, setRemarks] = useState('');

  const activePeriod = period || periods[0] || '';
  const nameOf = (id: string) =>
    faculty.find(f => f.uniqueId === id)?.fullName ?? id;

  const inPeriod = deptLogs.filter(
    l =>
      periodOf(l.date) === activePeriod &&
      (!facultyId || l.uniqueId === facultyId)
  );
  const rows = inPeriod
    .filter(l => !status || l.status === status)
    .sort((a, b) => b.date.localeCompare(a.date));

  const sel = useSelection(
    rows.filter(l => l.status === 'Pending').map(l => l.id)
  );

  // Per-teacher summary for the period — what the bill will be built from.
  const summary = (() => {
    const ids = [...new Set(inPeriod.map(l => l.uniqueId))];
    return ids.map(id => {
      const own = inPeriod.filter(l => l.uniqueId === id);
      const ok = own.filter(l => l.status === 'Verified');
      const c = countSessions(ok);
      return {
        uniqueId: id,
        fullName: nameOf(id),
        entries: own.length,
        pending: own.filter(l => l.status === 'Pending').length,
        days: c.days,
        theory: c.theory,
        practical: c.practical,
        amount: billAmountOf(c.theory, c.practical, rates),
      };
    });
  })();

  const verifySelected = () => {
    verifyLogs(sel.ids);
    ToastService.success(
      `${sel.ids.length} entr${sel.ids.length === 1 ? 'y' : 'ies'} verified.`
    );
    sel.clear();
  };

  const confirmReject = () => {
    if (!rejecting) return;
    if (!remarks.trim()) {
      ToastService.error('Enter the reason.');
      return;
    }
    rejectLog(rejecting.id, remarks.trim());
    ToastService.success('Entry rejected — it will not be billed.');
    setRejecting(null);
    setViewing(null);
    setRemarks('');
  };

  const countOf = (l: DailyLog, type: TeachingSession['type']) =>
    l.sessions.filter(s => s.type === type).length;

  return (
    <FormPage
      title="Attendance & Lectures"
      description="Daily attendance, theory lectures and practicals entered by visiting faculty from the mobile app. Verify them before preparing the bill."
      breadcrumbs={crumbs('department', 'Attendance & Lectures')}
      headerAction={<DeptSwitcher />}
    >
      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Month"
            data={periods.map(p => ({ id: p, text: periodLabel(p) }))}
            textField="text"
            valueField="id"
            value={activePeriod}
            onChange={v => setPeriod((v as string) ?? '')}
          />
          <DropDownList
            label="Faculty"
            data={[
              { id: '', text: 'All Faculty' },
              ...faculty
                .filter(f => f.departments.includes(dept))
                .map(f => ({
                  id: f.uniqueId,
                  text: `${f.fullName} (${f.uniqueId})`,
                })),
            ]}
            textField="text"
            valueField="id"
            value={facultyId}
            onChange={v => setFacultyId((v as string) ?? '')}
          />
          <DropDownList
            label="Status"
            data={[
              { id: '', text: 'All' },
              { id: 'Pending', text: 'Pending' },
              { id: 'Verified', text: 'Verified' },
              { id: 'Rejected', text: 'Rejected' },
            ]}
            textField="text"
            valueField="id"
            value={status}
            onChange={v => setStatus((v as LogStatus) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title={`Teacher-wise Summary — ${activePeriod ? periodLabel(activePeriod) : ''}`}
        subtitle={`Verified entries only · ${inr(rates.theoryRate)} per theory, ${inr(rates.practicalRate)} per practical`}
        icon="users"
      >
        <GridPanel
          data={summary}
          columns={[
            {
              header: 'Unique ID',
              cell: r => <UniqueIdChip value={r.uniqueId} />,
            },
            { field: 'fullName', header: 'Faculty' },
            { field: 'entries', header: 'Entries' },
            {
              header: 'Pending',
              cell: r => (
                <span
                  className={r.pending ? 'font-semibold text-amber-600' : ''}
                >
                  {r.pending}
                </span>
              ),
            },
            { field: 'days', header: 'Days Present' },
            { field: 'theory', header: 'Theory' },
            { field: 'practical', header: 'Practical' },
            {
              header: 'Amount',
              cell: r => (
                <span className="font-semibold">
                  {inr(r.amount)}
                  {r.amount > rates.limit && (
                    <span className="ml-1 text-xs font-normal text-red-600">
                      (above {inr(rates.limit)})
                    </span>
                  )}
                </span>
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Mobile App Entries"
        subtitle="Select pending entries to verify in bulk"
        icon="mobile"
      >
        <StageNote>
          Each entry is one day — check-in time and location are captured by the
          app; the faculty adds every theory lecture and practical taken that
          day.
        </StageNote>
        <div className="mt-4">
          <SelectableGrid
            data={rows}
            selected={rows.filter(r => sel.selected.has(r.id))}
            onSelectionChange={r => sel.set(r.map(x => x.id))}
            noun="entry"
            isSelectable={l => l.status === 'Pending'}
            actions={[
              {
                label: 'Verify Selected',
                icon: 'check',
                variant: 'success',
                onClick: verifySelected,
              },
            ]}
            columns={[
              { header: 'Date', cell: l => formatDate(l.date) },
              { header: 'Faculty', cell: l => nameOf(l.uniqueId) },
              {
                header: 'Unique ID',
                cell: l => <UniqueIdChip value={l.uniqueId} />,
              },
              { header: 'Check-in', field: 'checkIn' },
              { header: 'Theory', cell: l => countOf(l, 'Theory') },
              { header: 'Practical', cell: l => countOf(l, 'Practical') },
              {
                header: 'Status',
                cell: l => (
                  <StatusBadge
                    label={l.status}
                    variant={logVariant(l.status)}
                  />
                ),
              },
              {
                header: 'Actions',
                cell: l => (
                  <div className="flex gap-1">
                    <Button
                      label="View"
                      icon="eye"
                      variant="text"
                      size="small"
                      onClick={() => setViewing(l)}
                    />
                    {l.status === 'Pending' && (
                      <Button
                        label="Reject"
                        icon="times"
                        variant="text"
                        size="small"
                        onClick={() => setRejecting(l)}
                      />
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </FormCard>

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={
          viewing
            ? `${nameOf(viewing.uniqueId)} — ${formatDate(viewing.date)}`
            : ''
        }
        subtitle={
          viewing
            ? `Check-in ${viewing.checkIn} · ${viewing.location}`
            : undefined
        }
        size="lg"
        footer={
          viewing?.status === 'Pending' ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Reject"
                icon="times"
                variant="danger"
                onClick={() => setRejecting(viewing)}
              />
              <Button
                label="Verify"
                icon="check"
                variant="success"
                onClick={() => {
                  verifyLogs([viewing.id]);
                  ToastService.success('Entry verified.');
                  setViewing(null);
                }}
              />
            </div>
          ) : undefined
        }
      >
        {viewing && (
          <GridPanel
            data={viewing.sessions}
            columns={[
              { field: 'time', header: 'Time' },
              { field: 'type', header: 'Type' },
              { field: 'subject', header: 'Subject Code' },
              { field: 'program', header: 'Program' },
              { field: 'topic', header: 'Topic Covered' },
            ]}
          />
        )}
      </FormPopup>

      <FormPopup
        visible={!!rejecting}
        onHide={() => setRejecting(null)}
        title="Reject Entry"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setRejecting(null)}
            />
            <Button
              label="Reject"
              icon="times"
              variant="danger"
              onClick={confirmReject}
            />
          </div>
        }
      >
        <TextArea
          label="Reason"
          required
          rows={3}
          value={remarks}
          onChange={setRemarks}
        />
      </FormPopup>
    </FormPage>
  );
}
