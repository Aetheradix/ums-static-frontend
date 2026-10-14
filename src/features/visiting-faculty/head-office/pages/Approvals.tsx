import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
} from 'shared/new-components';
import SelectableGrid from '../../components/SelectableGrid';
import { crumbs, useSelection } from '../../components/hooks';
import {
  ApplicationDetails,
  StageNote,
  UniqueIdChip,
} from '../../components/ui';
import { DEPARTMENTS } from '../../data';
import { joinedPans, useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { formatDate, makeUniqueId } from '../../utils';

/** Stages J5–J6 — final approval of the merit list; the Unique ID goes live. */
export default function Approvals() {
  const applications = useVisitingFacultyStore(s => s.applications);
  const approveByHeadOffice = useVisitingFacultyStore(
    s => s.approveByHeadOffice
  );
  const returnByHeadOffice = useVisitingFacultyStore(s => s.returnByHeadOffice);

  const [dept, setDept] = useState('');
  const [viewing, setViewing] = useState<Application | null>(null);
  const [returning, setReturning] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('');
  const [confirming, setConfirming] = useState(false);

  const pans = useMemo(() => joinedPans(applications), [applications]);
  const pending = applications
    .filter(
      a => a.status === 'Pending Approval' && (!dept || a.department === dept)
    )
    .sort(
      (a, b) =>
        a.department.localeCompare(b.department) ||
        (a.meritRank ?? 0) - (b.meritRank ?? 0)
    );
  const sel = useSelection(pending.map(a => a.id));

  const approve = () => {
    const ids = sel.ids;
    const issued = pending
      .filter(a => ids.includes(a.id))
      .map(a => makeUniqueId(a.fullName, a.pan));
    approveByHeadOffice(ids);
    ToastService.success(
      `Joining approved. Unique ID(s): ${issued.join(', ')}`
    );
    sel.clear();
    setConfirming(false);
  };

  const confirmReturn = () => {
    if (!returning) return;
    if (!remarks.trim()) {
      ToastService.error('Enter remarks for the department.');
      return;
    }
    returnByHeadOffice(returning.id, remarks.trim());
    ToastService.success(
      `${returning.fullName} returned to ${returning.department}.`
    );
    setReturning(null);
    setViewing(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Merit List Approval"
      description="Merit lists forwarded by the University Teaching Departments. Approval completes the joining and activates the faculty's Unique ID."
      breadcrumbs={crumbs('headOffice', 'Merit List Approval')}
    >
      <StageNote>
        On approval the Unique ID (first 4 letters of the name + last 4
        characters of the PAN) is issued. If the PAN already belongs to a joined
        faculty, no new ID is made — the department is added under the existing
        ID.
      </StageNote>

      <FormCard title="Filter" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Department"
            data={[
              { id: '', text: 'All Departments' },
              ...DEPARTMENTS.map(d => ({
                id: d.code,
                text: `${d.code} — ${d.name}`,
              })),
            ]}
            textField="text"
            valueField="id"
            value={dept}
            onChange={v => setDept((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Pending Approval" icon="inbox">
        <SelectableGrid
          data={pending}
          selected={pending.filter(r => sel.selected.has(r.id))}
          onSelectionChange={r => sel.set(r.map(x => x.id))}
          noun="candidate"
          actions={[
            {
              label: 'Approve Joining',
              icon: 'check',
              variant: 'success',
              onClick: () => setConfirming(true),
            },
          ]}
          columns={[
            { header: 'UTD', field: 'department' },
            { header: 'Rank', field: 'meritRank' },
            {
              header: 'Unique ID',
              cell: a => (
                <div className="flex flex-col items-start gap-1">
                  <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} />
                  {pans.has(a.pan) && (
                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                      Existing ID
                    </span>
                  )}
                </div>
              ),
            },
            { header: 'Name', field: 'fullName' },
            { header: 'Qualification', cell: a => a.qualifications.join(', ') },
            { header: 'Interview Marks', cell: a => a.interview?.marks ?? '—' },
            { header: 'Forwarded On', cell: a => formatDate(a.forwardedOn) },
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
                    label="Return"
                    icon="replay"
                    variant="text"
                    size="small"
                    onClick={() => setReturning(a)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={viewing ? `${viewing.fullName} — ${viewing.department}` : ''}
        subtitle={viewing?.applicationNo}
        size="xl"
        footer={
          viewing?.status === 'Pending Approval' ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Return to Department"
                icon="replay"
                variant="outlined"
                onClick={() => setReturning(viewing)}
              />
              <Button
                label="Approve"
                icon="check"
                variant="success"
                onClick={() => {
                  approveByHeadOffice([viewing.id]);
                  ToastService.success(
                    `Joining approved — Unique ID ${makeUniqueId(viewing.fullName, viewing.pan)}.`
                  );
                  setViewing(null);
                }}
              />
            </div>
          ) : undefined
        }
      >
        {viewing && <ApplicationDetails app={viewing} />}
      </FormPopup>

      <FormPopup
        visible={!!returning}
        onHide={() => setReturning(null)}
        title="Return to Department"
        subtitle={
          returning
            ? `${returning.fullName} · ${returning.department}`
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
          label="Remarks"
          required
          rows={3}
          value={remarks}
          onChange={setRemarks}
        />
      </FormPopup>

      <ConfirmDialog
        visible={confirming}
        onHide={() => setConfirming(false)}
        onConfirm={approve}
        title="Approve Joining"
        message={`Approve the joining of ${sel.ids.length} candidate(s)? Their Unique IDs become active for attendance and billing.`}
        confirmLabel="Approve"
        variant="info"
      />
    </FormPage>
  );
}
