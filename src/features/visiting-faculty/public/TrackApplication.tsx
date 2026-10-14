import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { StageNote, UniqueIdChip } from '../components/ui';
import { deptName } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { Application, ApplicationStatus } from '../types';
import { applicationVariant, formatDate, makeUniqueId } from '../utils';

const STAGES: { label: string; reached: ApplicationStatus[] }[] = [
  { label: 'Submitted', reached: [] },
  {
    label: 'Verified',
    reached: [
      'In Scrutiny List',
      'Interview Scheduled',
      'Not Selected',
      'In Merit List',
      'Pending Approval',
      'Returned by Registrar & VC',
      'Joined',
    ],
  },
  {
    label: 'Interview',
    reached: [
      'Not Selected',
      'In Merit List',
      'Pending Approval',
      'Returned by Registrar & VC',
      'Joined',
    ],
  },
  {
    label: 'Merit List',
    reached: [
      'In Merit List',
      'Pending Approval',
      'Returned by Registrar & VC',
      'Joined',
    ],
  },
  { label: 'Joined', reached: ['Joined'] },
];

function Timeline({ app }: { app: Application }) {
  const ended = app.status === 'Rejected' || app.status === 'Not Selected';
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {STAGES.map((s, i) => {
        const done = i === 0 || s.reached.includes(app.status);
        return (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${
                done
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <i
                className={`pi ${done ? 'pi-check' : 'pi-circle'} text-[10px]`}
              />
              {s.label}
            </span>
            {i < STAGES.length - 1 && (
              <i
                className={`pi pi-angle-right ${ended ? 'text-red-300' : 'text-slate-300'}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function TrackApplication() {
  const applications = useVisitingFacultyStore(s => s.applications);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Application[] | null>(null);

  const search = () => {
    const q = query.trim().toUpperCase();
    if (!q) return;
    setResults(
      applications.filter(
        a => a.applicationNo.toUpperCase() === q || a.pan === q
      )
    );
  };

  return (
    <FormPage
      title="Track Application"
      description="Enter your application number or PAN to see the status in every department you applied to."
    >
      <FormCard>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1">
            <TextBox
              label="Application No. or PAN"
              placeholder="e.g. VF26-IET-0008 or ABCPS1234F"
              value={query}
              onChange={setQuery}
            />
          </div>
          <Button
            label="Track"
            icon="search"
            variant="primary"
            onClick={search}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Demo: ABCPS1234F · HDCPC5521K · DPLPM6620J · JPSPS9902L
        </p>
      </FormCard>

      {results && results.length === 0 && (
        <StageNote tone="warning">
          No application found for “{query}”.
        </StageNote>
      )}

      {results?.map(a => (
        <FormCard
          key={a.id}
          title={deptName(a.department)}
          subtitle={`${a.applicationNo} · submitted ${formatDate(a.submittedOn)}`}
          icon="building"
          headerAction={
            <StatusBadge
              label={a.status}
              variant={applicationVariant(a.status)}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <Timeline app={a} />
            {a.status === 'Interview Scheduled' && a.interview && (
              <StageNote>
                Interview call: {formatDate(a.interview.date)} at{' '}
                {a.interview.time}, {a.interview.venue}. Bring your original
                documents.
              </StageNote>
            )}
            {a.status === 'Rejected' && (
              <StageNote tone="warning">
                Rejected by the department: {a.rejectionReason}
              </StageNote>
            )}
            {a.status === 'Not Selected' && (
              <StageNote tone="warning">
                Not selected in the interview.
              </StageNote>
            )}
            {a.status === 'Joined' && (
              <StageNote tone="success">
                Joining approved on {formatDate(a.joinedOn)}. Your Unique ID is{' '}
                <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} /> — use
                it to sign in to the Visiting Faculty mobile app.
              </StageNote>
            )}
          </div>
        </FormCard>
      ))}
    </FormPage>
  );
}
