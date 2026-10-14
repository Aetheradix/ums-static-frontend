import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import {
  ApplicationDetails,
  DeptSwitcher,
  StageNote,
  UniqueIdChip,
} from '../../components/ui';
import { joinedPans, useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { applicationVariant, formatDate, makeUniqueId } from '../../utils';

const TABS: { title: string; statuses: Application['status'][] | null }[] = [
  { title: 'Pending Verification', statuses: ['Submitted'] },
  {
    title: 'Verified',
    statuses: [
      'In Scrutiny List',
      'Interview Scheduled',
      'In Merit List',
      'Pending Approval',
      'Returned by Registrar & VC',
      'Joined',
      'Not Selected',
    ],
  },
  { title: 'Rejected', statuses: ['Rejected'] },
  { title: 'All', statuses: null },
];

/** Stage J2 — the department verifies or rejects each application. */
export default function Applications() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const applications = useVisitingFacultyStore(s => s.applications);
  const verifyApplication = useVisitingFacultyStore(s => s.verifyApplication);
  const rejectApplication = useVisitingFacultyStore(s => s.rejectApplication);

  const [tab, setTab] = useState(0);
  const [viewing, setViewing] = useState<Application | null>(null);
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [reason, setReason] = useState('');

  const pans = useMemo(() => joinedPans(applications), [applications]);
  const mine = applications.filter(a => a.department === dept);

  const rowsFor = (statuses: Application['status'][] | null) =>
    mine.filter(a => !statuses || statuses.includes(a.status));

  const verify = (a: Application) => {
    verifyApplication(a.id);
    setViewing(null);
    ToastService.success(
      `${a.applicationNo} verified and moved to the scrutiny list.`
    );
  };

  const confirmReject = () => {
    if (!rejecting) return;
    if (!reason.trim()) {
      ToastService.error('Enter the reason for rejection.');
      return;
    }
    rejectApplication(rejecting.id, reason.trim());
    ToastService.success(`${rejecting.applicationNo} rejected.`);
    setRejecting(null);
    setViewing(null);
    setReason('');
  };

  const columns: Controls.ColumnProps<Application>[] = [
    { field: 'applicationNo', header: 'Application No.', sortable: true },
    {
      header: 'Unique ID',
      cell: a => (
        <div className="flex flex-col items-start gap-1">
          <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} />
          {pans.has(a.pan) && a.status !== 'Joined' && (
            <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
              Existing faculty
            </span>
          )}
        </div>
      ),
    },
    { field: 'fullName', header: 'Name', sortable: true },
    { field: 'pan', header: 'PAN' },
    {
      header: 'Qualification',
      cell: a => <span>{a.qualifications.join(', ')}</span>,
    },
    {
      header: 'Submitted',
      cell: a => <span>{formatDate(a.submittedOn)}</span>,
    },
    {
      header: 'Status',
      cell: a => (
        <StatusBadge label={a.status} variant={applicationVariant(a.status)} />
      ),
    },
    {
      header: 'Actions',
      width: '230px',
      cell: a => (
        <div className="flex gap-1">
          <Button
            label="View"
            icon="eye"
            variant="text"
            size="small"
            onClick={() => setViewing(a)}
          />
          {a.status === 'Submitted' && (
            <>
              <Button
                label="Verify"
                icon="check"
                variant="text"
                size="small"
                onClick={() => verify(a)}
              />
              <Button
                label="Reject"
                icon="times"
                variant="text"
                size="small"
                onClick={() => setRejecting(a)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Applications"
      description="Applications from the public forum for your department. View the form and documents, then verify or reject."
      breadcrumbs={crumbs('department', 'Applications')}
      headerAction={<DeptSwitcher />}
    >
      <StageNote>
        The Unique ID (first 4 letters of the name + last 4 characters of the
        PAN) is generated automatically. “Existing faculty” means the PAN
        already belongs to a joined visiting faculty — on approval this
        department is added under the same ID.
      </StageNote>
      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={TABS.map(t => ({
            title: `${t.title} (${rowsFor(t.statuses).length})`,
            content: (
              <GridPanel
                data={rowsFor(t.statuses)}
                columns={columns}
                searchBox
                searchPlaceholder="Search by name, PAN or application no..."
              />
            ),
          }))}
        />
      </FormCard>

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={viewing ? `Application ${viewing.applicationNo}` : 'Application'}
        subtitle={viewing?.fullName}
        size="xl"
        footer={
          viewing?.status === 'Submitted' ? (
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
                onClick={() => verify(viewing)}
              />
            </div>
          ) : undefined
        }
      >
        {viewing && <ApplicationDetails app={viewing} />}
      </FormPopup>

      <FormPopup
        visible={!!rejecting}
        onHide={() => setRejecting(null)}
        title="Reject Application"
        subtitle={
          rejecting
            ? `${rejecting.applicationNo} · ${rejecting.fullName}`
            : undefined
        }
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
          label="Reason for rejection"
          required
          rows={3}
          placeholder="Shared with the applicant on the tracking page"
          value={reason}
          onChange={setReason}
        />
      </FormPopup>
    </FormPage>
  );
}
