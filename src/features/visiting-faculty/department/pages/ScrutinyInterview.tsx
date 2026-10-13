import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  NumberBox,
  RadioButtonList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  BulkSelectTable,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { crumbs, useSelection } from '../../components/hooks';
import { DeptSwitcher, StageNote, UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { Application, Interview } from '../../types';
import {
  applicationVariant,
  formatDate,
  fromIso,
  makeUniqueId,
  toIso,
} from '../../utils';

const blankInterview = (dept: string): Interview => ({
  date: '',
  time: '11:00',
  venue: `${dept} Committee Room, DAVV`,
  committee: '',
});

/** Stages J3–J4 — scrutiny list, interview call, and the committee's result. */
export default function ScrutinyInterview() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const applications = useVisitingFacultyStore(s => s.applications);
  const scheduleInterview = useVisitingFacultyStore(s => s.scheduleInterview);
  const recordInterviewResult = useVisitingFacultyStore(
    s => s.recordInterviewResult
  );

  const scrutiny = applications.filter(
    a => a.department === dept && a.status === 'In Scrutiny List'
  );
  const scheduled = applications.filter(
    a => a.department === dept && a.status === 'Interview Scheduled'
  );
  const sel = useSelection(scrutiny.map(a => a.id));

  const [scheduling, setScheduling] = useState(false);
  const [interview, setInterview] = useState<Interview>(blankInterview(dept));
  const [resultFor, setResultFor] = useState<Application | null>(null);
  const [result, setResult] = useState<'Finalised' | 'Not Selected'>(
    'Finalised'
  );
  const [marks, setMarks] = useState<number | undefined>();
  const [remarks, setRemarks] = useState('');

  const openSchedule = () => {
    setInterview(blankInterview(dept));
    setScheduling(true);
  };

  const saveSchedule = () => {
    if (
      !interview.date ||
      !interview.time ||
      !interview.venue ||
      !interview.committee
    ) {
      ToastService.error('Fill the date, time, venue and committee.');
      return;
    }
    scheduleInterview(sel.ids, interview);
    ToastService.success(
      `Interview call sent to ${sel.ids.length} candidate(s).`
    );
    sel.clear();
    setScheduling(false);
  };

  const openResult = (a: Application) => {
    setResultFor(a);
    setResult('Finalised');
    setMarks(undefined);
    setRemarks('');
  };

  const saveResult = () => {
    if (!resultFor) return;
    if (marks === undefined || marks < 0 || marks > 100) {
      ToastService.error('Enter interview marks between 0 and 100.');
      return;
    }
    recordInterviewResult(resultFor.id, result, marks, remarks.trim());
    ToastService.success(
      result === 'Finalised'
        ? `${resultFor.fullName} finalised and placed in the merit list.`
        : `${resultFor.fullName} marked Not Selected.`
    );
    setResultFor(null);
  };

  return (
    <FormPage
      title="Scrutiny & Interview"
      description="Verified applicants form the scrutiny list. Call them for the physical interview, then record the committee's result."
      breadcrumbs={crumbs('department', 'Scrutiny & Interview')}
      headerAction={<DeptSwitcher />}
    >
      <FormCard
        title="Scrutiny List"
        subtitle="Select candidates and fix the interview date, venue and committee."
        icon="list-check"
      >
        <BulkSelectTable
          data={scrutiny}
          selected={sel.selected}
          onToggleOne={sel.toggleOne}
          onToggleAll={sel.toggleAll}
          onClearSelection={sel.clear}
          selectionNoun="candidate"
          emptyMessage="No verified candidates waiting for an interview call."
          bulkActions={[
            {
              label: 'Schedule Interview',
              icon: 'calendar-plus',
              variant: 'primary',
              onClick: openSchedule,
            },
          ]}
          columns={[
            { header: 'Application No.', field: 'applicationNo' },
            {
              header: 'Unique ID',
              cell: a => (
                <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} />
              ),
            },
            { header: 'Name', field: 'fullName' },
            { header: 'Qualification', cell: a => a.qualifications.join(', ') },
            {
              header: 'Subjects',
              cell: a => a.subjects.filter(Boolean).join(', '),
            },
            { header: 'Verified On', cell: a => formatDate(a.verifiedOn) },
          ]}
        />
      </FormCard>

      <FormCard
        title="Interviews Scheduled"
        subtitle="Record the result after the committee has interviewed the candidate in person."
        icon="calendar"
      >
        <GridPanel
          data={scheduled}
          columns={[
            { field: 'applicationNo', header: 'Application No.' },
            { field: 'fullName', header: 'Name' },
            {
              header: 'Interview',
              cell: (a: Application) => (
                <span>
                  {formatDate(a.interview?.date)}, {a.interview?.time}
                </span>
              ),
            },
            {
              header: 'Venue',
              cell: (a: Application) => <span>{a.interview?.venue}</span>,
            },
            {
              header: 'Committee',
              cell: (a: Application) => <span>{a.interview?.committee}</span>,
            },
            {
              header: 'Status',
              cell: (a: Application) => (
                <StatusBadge
                  label={a.status}
                  variant={applicationVariant(a.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '150px',
              cell: (a: Application) => (
                <Button
                  label="Record Result"
                  icon="pencil"
                  variant="text"
                  size="small"
                  onClick={() => openResult(a)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={scheduling}
        onHide={() => setScheduling(false)}
        title="Schedule Interview"
        subtitle={`${sel.ids.length} candidate(s) selected`}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setScheduling(false)}
            />
            <Button
              label="Send Interview Call"
              icon="send"
              variant="primary"
              onClick={saveSchedule}
            />
          </div>
        }
      >
        <FormGrid columns={2}>
          <DatePicker
            label="Interview Date"
            required
            minDate={new Date()}
            value={fromIso(interview.date)}
            onChange={v =>
              setInterview({ ...interview, date: v ? toIso(v) : '' })
            }
          />
          <TextBox
            label="Time"
            required
            placeholder="e.g. 11:00"
            value={interview.time}
            onChange={v => setInterview({ ...interview, time: v })}
          />
          <TextBox
            label="Venue"
            required
            value={interview.venue}
            onChange={v => setInterview({ ...interview, venue: v })}
          />
          <TextBox
            label="Committee Members"
            required
            placeholder="e.g. HoD, Senior Professor, Subject Expert"
            value={interview.committee}
            onChange={v => setInterview({ ...interview, committee: v })}
          />
        </FormGrid>
      </FormPopup>

      <FormPopup
        visible={!!resultFor}
        onHide={() => setResultFor(null)}
        title="Interview Result"
        subtitle={
          resultFor
            ? `${resultFor.applicationNo} · ${resultFor.fullName}`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setResultFor(null)}
            />
            <Button
              label="Save Result"
              icon="check"
              variant="primary"
              onClick={saveResult}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <StageNote>
            The committee verifies the original documents before recording the
            result.
          </StageNote>
          <RadioButtonList
            name="interview-result"
            label="Result"
            optionLayout="horizontal"
            options={[
              { label: 'Finalised', value: 'Finalised' },
              { label: 'Not Selected', value: 'Not Selected' },
            ]}
            value={result}
            onChange={e =>
              setResult(e.target.value as 'Finalised' | 'Not Selected')
            }
          />
          <NumberBox
            label="Interview Marks (out of 100)"
            required
            min={0}
            max={100}
            value={marks}
            onChange={v => setMarks(v ?? undefined)}
          />
          <TextArea
            label="Committee Remarks"
            rows={2}
            value={remarks}
            onChange={setRemarks}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
