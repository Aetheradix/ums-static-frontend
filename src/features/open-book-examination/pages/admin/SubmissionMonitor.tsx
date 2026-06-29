import { useMemo, useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockAttempts, mockExams, mockRegistrations } from '../../data';
import { InfoBanner } from '../../components';

export default function SubmissionMonitor() {
  const [examId, setExamId] = useState<string>('');

  const examOptions = mockExams
    .filter(e => e.status === 'in_progress' || e.status === 'submission')
    .map(e => ({ value: String(e.id), label: e.title }));
  const regs = examId
    ? mockRegistrations.filter(
        r => r.examId === Number(examId) && r.status === 'registered'
      )
    : [];
  const attempts = examId
    ? mockAttempts.filter(a => a.examId === Number(examId))
    : [];
  const submitted = attempts.filter(a => a.status === 'submitted');
  const inProgress = attempts.filter(a => a.status === 'in_progress');
  const notStarted = regs.filter(
    r => !attempts.some(a => a.studentId === r.studentId)
  );

  const rows = useMemo(
    () =>
      regs.map(r => {
        const a = attempts.find(x => x.studentId === r.studentId);
        return {
          id: r.id,
          studentName: r.studentName,
          status: !a ? 'not_started' : a.status,
          startTime: a ? new Date(a.startTime).toLocaleTimeString() : '-',
          tabSwitchCount: a?.tabSwitchCount ?? '-',
          autoSaveVersion: a?.autoSaveVersion ?? '-',
        };
      }),
    [regs, attempts]
  );

  return (
    <FormPage
      title="Submission Monitor"
      description="Real-time exam submission tracking"
    >
      <InfoBanner
        title="About Submission Monitor"
        message="Track real-time exam submissions for active examinations. You can see who is currently taking the exam, monitor tab switches, and track auto-save progress to identify potential issues."
      />
      <div className="mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => setExamId(v as string)}
          data={examOptions}
          textField="label"
          valueField="value"
        />
      </div>
      {examId && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Registered"
              value={regs.length}
              icon="how_to_reg"
              colorScheme="blue"
            />
            <StatCard
              title="In Progress"
              value={inProgress.length}
              icon="play_circle"
              colorScheme="orange"
            />
            <StatCard
              title="Submitted"
              value={submitted.length}
              icon="check_circle"
              colorScheme="green"
            />
            <StatCard
              title="Not Started"
              value={notStarted.length}
              icon="hourglass_empty"
              colorScheme="blue"
            />
          </div>
          <GridPanel
            title="Submission Details"
            data={rows}
            dataKey="id"
            pagination={{ rows: 10 }}
            searchBox
            columns={
              [
                { field: 'studentName', header: 'Student' },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (row: { status: string }) => (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'not_started' ? 'bg-gray-100 text-gray-600' : row.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {row.status === 'not_started'
                        ? 'Not started'
                        : row.status === 'submitted'
                          ? 'Submitted'
                          : 'In progress'}
                    </span>
                  ),
                },
                { field: 'startTime', header: 'Start Time' },
                { field: 'tabSwitchCount', header: 'Tab Switches' },
                { field: 'autoSaveVersion', header: 'Auto-Save' },
              ] as any
            }
          />
        </>
      )}
    </FormPage>
  );
}
