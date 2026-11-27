import { useState } from 'react';
import { ToastService } from 'services';
import {
  ConfirmDialog,
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import SelectableGrid from '../../components/SelectableGrid';
import { useScope } from '../../components/scope';
import { crumbs, useSelection } from '../../components/hooks';
import {
  ApplicationTypeBadge,
  StageNote,
  UniqueIdChip,
} from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { applicationVariant, formatDate, makeUniqueId } from '../../utils';

/** Stage J5 — merit list of finalised candidates, forwarded to Registrar & VC. */
export default function MeritList() {
  const scope = useScope();
  const { dept } = scope;
  const applications = useVisitingFacultyStore(s => s.applications);
  const forwardMeritList = useVisitingFacultyStore(s => s.forwardMeritList);

  const byMarks = (a: Application, b: Application) =>
    (b.interview?.marks ?? 0) - (a.interview?.marks ?? 0);

  const finalised = applications
    .filter(a => scope.appInScope(a) && a.status === 'In Merit List')
    .sort(byMarks);
  const forwarded = applications
    .filter(
      a =>
        scope.appInScope(a) &&
        [
          'Forwarded to UTD',
          'Pending Approval',
          'Returned by Registrar & VC',
        ].includes(a.status)
    )
    .sort((a, b) => (a.meritRank ?? 0) - (b.meritRank ?? 0));

  const sel = useSelection(finalised.map(a => a.id));
  const [confirming, setConfirming] = useState(false);

  const forward = () => {
    forwardMeritList(sel.ids);
    ToastService.success(
      `Merit list of ${sel.ids.length} candidate(s) forwarded to the ${dept} UTD Department.`
    );
    sel.clear();
    setConfirming(false);
  };

  return (
    <FormPage
      title="Merit List"
      description={`Candidates of ${scope.branch} finalised by the interview committee, ranked by interview marks. Forward the merit list to the ${dept} UTD Department — it reviews and sends it to the Registrar & VC.`}
      breadcrumbs={crumbs(scope.login, 'Merit List')}
      headerAction={<scope.Switcher />}
    >
      {finalised.some(a => a.utdRemarks) && (
        <StageNote tone="warning">
          The UTD Department has returned one or more names with remarks. Review
          them and forward again.
        </StageNote>
      )}

      <FormCard
        title="Finalised Candidates"
        subtitle="Ranked by interview marks"
        icon="sort-amount-down"
      >
        <SelectableGrid
          data={finalised}
          selected={finalised.filter(r => sel.selected.has(r.id))}
          onSelectionChange={r => sel.set(r.map(x => x.id))}
          noun="candidate"
          actions={[
            {
              label: 'Forward to UTD Department',
              icon: 'send',
              variant: 'primary',
              onClick: () => setConfirming(true),
            },
          ]}
          columns={[
            {
              header: 'Rank',
              cell: a => (
                <span className="font-semibold">
                  {finalised.indexOf(a) + 1}
                </span>
              ),
            },
            {
              header: 'Unique ID',
              cell: a => (
                <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} />
              ),
            },
            { header: 'Name', field: 'fullName' },
            {
              header: 'Faculty Type',
              cell: a => <ApplicationTypeBadge app={a} />,
            },
            { header: 'Qualification', cell: a => a.qualifications.join(', ') },
            {
              header: 'Marks',
              cell: a => `${a.interview?.marks ?? '—'} / 100`,
            },
            {
              header: 'Committee Remarks',
              cell: a => a.interview?.remarks || '—',
            },
            {
              header: 'Status',
              cell: a => (
                <div className="flex flex-col gap-1">
                  <StatusBadge
                    label={a.status}
                    variant={applicationVariant(a.status)}
                  />
                  {a.utdRemarks && (
                    <span className="text-xs text-amber-700 dark:text-amber-300">
                      UTD: {a.utdRemarks}
                    </span>
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Forwarded"
        subtitle="With the UTD Department, or sent on by it to the Registrar & VC"
        icon="send"
      >
        <GridPanel
          data={forwarded}
          columns={[
            { field: 'meritRank', header: 'Rank' },
            { field: 'applicationNo', header: 'Application No.' },
            { field: 'fullName', header: 'Name' },
            {
              header: 'Faculty Type',
              cell: (a: Application) => <ApplicationTypeBadge app={a} />,
            },
            {
              header: 'Marks',
              cell: (a: Application) => (
                <span>{a.interview?.marks ?? '—'}</span>
              ),
            },
            {
              header: 'Forwarded On',
              cell: (a: Application) => (
                <span>{formatDate(a.hodForwardedOn ?? a.forwardedOn)}</span>
              ),
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
          ]}
        />
      </FormCard>

      <ConfirmDialog
        visible={confirming}
        onHide={() => setConfirming(false)}
        onConfirm={forward}
        title="Forward Merit List"
        message={`Forward the merit list of ${sel.ids.length} candidate(s) to the ${dept} UTD Department?`}
        confirmLabel="Forward"
        variant="info"
      />
    </FormPage>
  );
}
