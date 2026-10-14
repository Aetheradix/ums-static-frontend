import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  RadioButtonList,
  TextArea,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { DeptSwitcher, StageNote, UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { applicationVariant, formatDate, withUniqueId } from '../../utils';

type Row = Application & { uniqueId: string };

/** Stage J4 — the committee interviews in person and records the result. */
export default function InterviewPage() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const applications = useVisitingFacultyStore(s => s.applications);
  const recordInterviewResult = useVisitingFacultyStore(
    s => s.recordInterviewResult
  );

  const [tab, setTab] = useState(0);
  const [date, setDate] = useState('');
  const [resultFor, setResultFor] = useState<Row | null>(null);
  const [result, setResult] = useState<'Finalised' | 'Not Selected'>(
    'Finalised'
  );
  const [marks, setMarks] = useState<number | undefined>();
  const [remarks, setRemarks] = useState('');

  const mine = withUniqueId(
    applications.filter(a => a.department === dept && a.interview)
  );
  const scheduled = mine.filter(
    a =>
      a.status === 'Interview Scheduled' &&
      (!date || a.interview?.date === date)
  );
  const recorded = mine.filter(a => a.interview?.result);
  const dates = [
    ...new Set(
      mine
        .filter(a => a.status === 'Interview Scheduled')
        .map(a => a.interview!.date)
    ),
  ].sort();

  const openResult = (a: Row) => {
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

  const base: Controls.ColumnProps<Row>[] = [
    { field: 'applicationNo', header: 'Application No.', sortable: true },
    { header: 'Unique ID', cell: a => <UniqueIdChip value={a.uniqueId} /> },
    { field: 'fullName', header: 'Name', sortable: true },
    {
      header: 'Interview',
      cell: a => (
        <span>
          {formatDate(a.interview?.date)}, {a.interview?.time}
        </span>
      ),
    },
  ];

  return (
    <FormPage
      title="Interview"
      description="Candidates called for the physical interview. The committee verifies original documents, interviews in person and records the result."
      breadcrumbs={crumbs('department', 'Interview')}
      headerAction={<DeptSwitcher />}
    >
      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={[
            {
              title: `Scheduled (${scheduled.length})`,
              content: (
                <div className="flex flex-col gap-4">
                  <FormGrid columns={3}>
                    <DropDownList
                      label="Interview Date"
                      data={[
                        { id: '', text: 'All Dates' },
                        ...dates.map(d => ({ id: d, text: formatDate(d) })),
                      ]}
                      textField="text"
                      valueField="id"
                      value={date}
                      onChange={v => setDate((v as string) ?? '')}
                    />
                  </FormGrid>
                  <GridPanel
                    data={scheduled}
                    searchBox
                    searchPlaceholder="Search by name, Unique ID or application no..."
                    searchFields={[
                      'applicationNo',
                      'uniqueId',
                      'fullName',
                      'pan',
                    ]}
                    columns={[
                      ...base,
                      {
                        header: 'Venue',
                        cell: a => <span>{a.interview?.venue}</span>,
                      },
                      {
                        header: 'Committee',
                        cell: a => <span>{a.interview?.committee}</span>,
                      },
                      {
                        header: 'Actions',
                        width: '150px',
                        cell: a => (
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
                </div>
              ),
            },
            {
              title: `Results Recorded (${recorded.length})`,
              content: (
                <GridPanel
                  data={recorded}
                  searchBox
                  searchPlaceholder="Search by name, Unique ID or application no..."
                  searchFields={[
                    'applicationNo',
                    'uniqueId',
                    'fullName',
                    'pan',
                  ]}
                  columns={[
                    ...base,
                    {
                      header: 'Marks',
                      cell: a => <span>{a.interview?.marks ?? '—'} / 100</span>,
                    },
                    {
                      header: 'Remarks',
                      cell: a => <span>{a.interview?.remarks || '—'}</span>,
                    },
                    {
                      header: 'Status',
                      cell: a => (
                        <StatusBadge
                          label={a.status}
                          variant={applicationVariant(a.status)}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </FormCard>

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
