import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { crumbs, useSelection } from '../../components/hooks';
import { useScope } from '../../components/scope';
import SelectableGrid from '../../components/SelectableGrid';
import {
  ApplicationDetails,
  ApplicationTypeBadge,
  StageNote,
  UniqueIdChip,
} from '../../components/ui';
import { DEPT_BRANCHES, hodBranchOf } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { applicationVariant, formatDate, makeUniqueId } from '../../utils';

/**
 * Stage J5 at the UTD Department — merit lists forwarded by the branch
 * HODs are reviewed here and sent on to the Registrar & VC, or returned to
 * the HOD with remarks.
 */
export default function MeritReview() {
  const scope = useScope();
  const { dept } = scope;
  const applications = useVisitingFacultyStore(s => s.applications);
  const utdForwardToRegistrar = useVisitingFacultyStore(
    s => s.utdForwardToRegistrar
  );
  const utdReturnToHod = useVisitingFacultyStore(s => s.utdReturnToHod);

  const [branch, setBranch] = useState('');
  const [viewing, setViewing] = useState<Application | null>(null);
  const [returning, setReturning] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('');
  const [confirming, setConfirming] = useState(false);

  const inBranch = (a: Application) => !branch || hodBranchOf(a) === branch;
  const toReview = applications
    .filter(
      a =>
        scope.appInScope(a) &&
        inBranch(a) &&
        ['Forwarded to UTD', 'Returned by Registrar & VC'].includes(a.status)
    )
    .sort(
      (a, b) =>
        hodBranchOf(a).localeCompare(hodBranchOf(b)) ||
        (a.meritRank ?? 0) - (b.meritRank ?? 0)
    );
  const sent = applications.filter(
    a =>
      scope.appInScope(a) &&
      inBranch(a) &&
      ['Pending Approval', 'Joined'].includes(a.status) &&
      a.hodForwardedOn
  );
  const sel = useSelection(toReview.map(a => a.id));

  const forward = () => {
    utdForwardToRegistrar(sel.ids);
    ToastService.success(
      `${sel.ids.length} candidate(s) forwarded to the Registrar & VC for approval.`
    );
    sel.clear();
    setConfirming(false);
  };

  const confirmReturn = () => {
    if (!returning) return;
    if (!remarks.trim()) {
      ToastService.error('Enter remarks for the HOD.');
      return;
    }
    utdReturnToHod(returning.id, remarks.trim());
    ToastService.success(
      `${returning.fullName} returned to the ${hodBranchOf(returning)} HOD.`
    );
    setReturning(null);
    setViewing(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Merit List Review"
      description={`Merit lists prepared by the branch HODs of ${dept}. Review each candidate, then forward to the Registrar & VC for final approval — or return to the HOD with remarks.`}
      breadcrumbs={crumbs(scope.login, 'Merit List Review')}
      headerAction={<scope.Switcher />}
    >
      {toReview.some(a => a.status === 'Returned by Registrar & VC') && (
        <StageNote tone="warning">
          The Registrar &amp; VC have returned one or more names with remarks.
          Review them and forward again, or return them to the HOD.
        </StageNote>
      )}

      <FormCard title="Filter" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Branch (HOD)"
            data={[
              { id: '', text: 'All Branches' },
              ...(DEPT_BRANCHES[dept] ?? []).map(b => ({ id: b, text: b })),
            ]}
            textField="text"
            valueField="id"
            value={branch}
            onChange={v => setBranch((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title={`Forwarded by HODs (${toReview.length})`}
        subtitle="Ranked by the HOD on interview marks"
        icon="inbox"
      >
        <SelectableGrid
          data={toReview}
          selected={toReview.filter(r => sel.selected.has(r.id))}
          onSelectionChange={r => sel.set(r.map(x => x.id))}
          noun="candidate"
          searchPlaceholder="Search by name or application no..."
          searchFields={['fullName', 'applicationNo', 'pan']}
          actions={[
            {
              label: 'Forward to Registrar & VC',
              icon: 'send',
              variant: 'primary',
              onClick: () => setConfirming(true),
            },
          ]}
          columns={[
            { header: 'Branch (HOD)', cell: a => hodBranchOf(a) },
            { header: 'Rank', cell: a => a.meritRank ?? '—' },
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
            {
              header: 'Marks',
              cell: a => `${a.interview?.marks ?? '—'} / 100`,
            },
            {
              header: 'HOD Forwarded',
              cell: a => formatDate(a.hodForwardedOn),
            },
            {
              header: 'Status',
              cell: a => (
                <div className="flex flex-col gap-1">
                  <StatusBadge
                    label={a.status}
                    variant={applicationVariant(a.status)}
                  />
                  {a.status === 'Returned by Registrar & VC' &&
                    a.headOfficeRemarks && (
                      <span className="text-xs text-amber-700 dark:text-amber-300">
                        {a.headOfficeRemarks}
                      </span>
                    )}
                </div>
              ),
            },
            {
              header: 'Actions',
              cell: a => (
                <div className="flex gap-1">
                  <Button
                    label="View"
                    icon="eye"
                    variant="text"
                    size="small"
                    onClick={() => setViewing(a)}
                  />
                  <Button
                    label="Return to HOD"
                    icon="replay"
                    variant="text"
                    size="small"
                    onClick={() => {
                      setRemarks('');
                      setReturning(a);
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Sent to Registrar & VC"
        subtitle="Awaiting final approval, or approved"
        icon="send"
      >
        <GridPanel
          data={sent}
          columns={[
            {
              header: 'Branch (HOD)',
              cell: (a: Application) => <span>{hodBranchOf(a)}</span>,
            },
            { field: 'applicationNo', header: 'Application No.' },
            { field: 'fullName', header: 'Name' },
            {
              header: 'Faculty Type',
              cell: (a: Application) => <ApplicationTypeBadge app={a} />,
            },
            {
              header: 'Sent On',
              cell: (a: Application) => (
                <span>{formatDate(a.forwardedOn)}</span>
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

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={viewing ? `${viewing.fullName} — ${hodBranchOf(viewing)}` : ''}
        subtitle={viewing?.applicationNo}
        size="xl"
      >
        {viewing && <ApplicationDetails app={viewing} />}
      </FormPopup>

      <FormPopup
        visible={!!returning}
        onHide={() => setReturning(null)}
        title="Return to HOD"
        subtitle={
          returning
            ? `${returning.fullName} · ${hodBranchOf(returning)} HOD`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setReturning(null)}
            />
            <Button
              label="Return"
              icon="replay"
              variant="warning"
              onClick={confirmReturn}
            />
          </div>
        }
      >
        <TextArea
          label="Remarks for the HOD"
          required
          rows={3}
          value={remarks}
          onChange={setRemarks}
        />
      </FormPopup>

      <ConfirmDialog
        visible={confirming}
        onHide={() => setConfirming(false)}
        onConfirm={forward}
        title="Forward to Registrar & VC"
        message={`Forward ${sel.ids.length} candidate(s) of ${dept} to the Registrar & VC for final approval?`}
        confirmLabel="Forward"
        variant="info"
      />
    </FormPage>
  );
}
