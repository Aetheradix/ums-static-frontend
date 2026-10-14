import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup } from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import SelectableGrid from '../../components/SelectableGrid';
import { DeptSwitcher, StageNote, UniqueIdChip } from '../../components/ui';
import {
  BRANCH_OPTIONS,
  PROGRAM_OPTIONS,
  QUALIFICATION_OPTIONS,
} from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Interview } from '../../types';
import { formatDate, fromIso, toIso, withUniqueId } from '../../utils';

const blankInterview = (dept: string): Interview => ({
  date: '',
  time: '11:00',
  venue: `${dept} Committee Room, DAVV`,
  committee: '',
});

const ALL = { id: '', text: 'All' };

/** Stage J3 — verified applicants; the department sends the interview call. */
export default function Scrutiny() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const applications = useVisitingFacultyStore(s => s.applications);
  const scheduleInterview = useVisitingFacultyStore(s => s.scheduleInterview);

  const [program, setProgram] = useState('');
  const [branch, setBranch] = useState('');
  const [qualification, setQualification] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scheduling, setScheduling] = useState(false);
  const [interview, setInterview] = useState<Interview>(blankInterview(dept));

  const rows = withUniqueId(
    applications.filter(
      a =>
        a.department === dept &&
        a.status === 'In Scrutiny List' &&
        (!program || a.programs.includes(program)) &&
        (!branch || a.branches.includes(branch)) &&
        (!qualification || a.qualifications.includes(qualification))
    )
  ).map(a => ({
    ...a,
    subjectList: a.subjects.filter(Boolean).join(', '),
    qualificationList: a.qualifications.join(', '),
  }));
  const selected = rows.filter(r => selectedIds.includes(r.id));

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
    scheduleInterview(selectedIds, interview);
    ToastService.success(
      `Interview call sent to ${selectedIds.length} candidate(s).`
    );
    setSelectedIds([]);
    setScheduling(false);
  };

  return (
    <FormPage
      title="Scrutiny List"
      description="All verified applications of the department. Filter by program, branch or qualification, select candidates and send the interview call."
      breadcrumbs={crumbs('department', 'Scrutiny List')}
      headerAction={<DeptSwitcher />}
    >
      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Program"
            data={[ALL, ...PROGRAM_OPTIONS]}
            textField="text"
            valueField="id"
            value={program}
            onChange={v => setProgram((v as string) ?? '')}
          />
          <DropDownList
            label="Branch"
            data={[ALL, ...BRANCH_OPTIONS]}
            textField="text"
            valueField="id"
            value={branch}
            onChange={v => setBranch((v as string) ?? '')}
          />
          <DropDownList
            label="Qualification"
            data={[ALL, ...QUALIFICATION_OPTIONS]}
            textField="text"
            valueField="id"
            value={qualification}
            onChange={v => setQualification((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title={`Scrutiny List (${rows.length})`}
        subtitle="Select candidates — selection is kept across pages and searches."
        icon="list-check"
      >
        <SelectableGrid
          data={rows}
          selected={selected}
          onSelectionChange={r => setSelectedIds(r.map(x => x.id))}
          noun="candidate"
          searchPlaceholder="Search by name, Unique ID, PAN or subject..."
          searchFields={[
            'applicationNo',
            'uniqueId',
            'fullName',
            'pan',
            'subjectList',
          ]}
          actions={[
            {
              label: 'Schedule Interview',
              icon: 'calendar-plus',
              variant: 'primary',
              onClick: () => {
                setInterview(blankInterview(dept));
                setScheduling(true);
              },
            },
          ]}
          columns={[
            {
              header: 'Application No.',
              field: 'applicationNo',
              sortable: true,
            },
            {
              header: 'Unique ID',
              cell: a => <UniqueIdChip value={a.uniqueId} />,
            },
            { header: 'Name', field: 'fullName', sortable: true },
            { header: 'Qualification', field: 'qualificationList' },
            { header: 'Program', cell: a => a.programs.join(', ') },
            { header: 'Branch', cell: a => a.branches.join(', ') },
            { header: 'Subjects', field: 'subjectList' },
            { header: 'Verified On', cell: a => formatDate(a.verifiedOn) },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={scheduling}
        onHide={() => setScheduling(false)}
        title="Schedule Interview"
        subtitle={`${selectedIds.length} candidate(s) selected`}
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
        <div className="flex flex-col gap-4">
          <StageNote>
            The call, with date, time and venue, appears on each candidate's
            tracking page.
          </StageNote>
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
        </div>
      </FormPopup>
    </FormPage>
  );
}
