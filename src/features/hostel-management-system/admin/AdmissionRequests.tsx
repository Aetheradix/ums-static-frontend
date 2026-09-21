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
  PreviewField,
  PreviewSection,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { KeyValueTile, OccupancyBar, SectionNote } from '../components/ui';
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_VARIANT,
  hostelPipeline,
  MOCK_ADMIN_NAME,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type {
  Application,
  Hostel,
  HostelPipeline,
} from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const FILTERS = [
  { id: 'Pending', text: 'Awaiting Assignment' },
  { id: 'Forwarded', text: 'Forwarded to Warden' },
  { id: 'Approved', text: 'Approved' },
  { id: 'Rejected', text: 'Rejected' },
  { id: 'All', text: 'All Applications' },
];

/** Boys hostels for male applicants, girls hostels for female — anyone else sees every hostel. */
const hostelMatchesGender = (hostel: Hostel, gender: string) =>
  gender === 'Male'
    ? hostel.type === 'Boys'
    : gender === 'Female'
      ? hostel.type === 'Girls'
      : true;

/** Green while there is room, amber for the last few seats, red once spoken for. */
const headroomTone = (headroom: number) =>
  headroom <= 0 ? 'danger' : headroom <= 3 ? 'warning' : 'success';

interface CapacityRow extends HostelPipeline {
  id: string;
  hostel: string;
  code: string;
  type: Hostel['type'];
  wardenName: string;
}

/**
 * The Hostel Cell's inbox. Every application from the public forum lands
 * here unassigned; the admin picks a hostel for it — with that hostel's
 * capacity, occupancy and already-forwarded requests in view — and forwards
 * it to the warden, who approves it and allots the room.
 */
export default function AdmissionRequests() {
  const { data, update } = useHms();
  const { activePortal } = useHmsRole();

  const [statusFilter, setStatusFilter] = useState('Pending');
  const [viewing, setViewing] = useState<Application | null>(null);
  const [assigning, setAssigning] = useState<Application | null>(null);
  const [hostelId, setHostelId] = useState('');
  const [note, setNote] = useState('');

  /** Capacity, occupancy and forwarded requests for every hostel on the system. */
  const capacityRows: CapacityRow[] = useMemo(
    () =>
      data.hostels.map(h => ({
        ...hostelPipeline(h, data.rooms, data.applications, data.allocations),
        id: h.id,
        hostel: h.nameEn,
        code: h.code,
        type: h.type,
        wardenName: h.wardenName,
      })),
    [data.hostels, data.rooms, data.applications, data.allocations]
  );

  const pipelineById = useMemo(
    () => new Map(capacityRows.map(r => [r.id, r] as const)),
    [capacityRows]
  );

  /**
   * Numbers for a hostel as they would stand without the application being
   * assigned — when re-assigning, the current hostel's forwarded count
   * includes this very application, which would otherwise mislead.
   */
  const pipelineFor = (id: string): CapacityRow | undefined => {
    const row = pipelineById.get(id);
    if (!row || !assigning) return row;
    if (assigning.status !== 'Forwarded' || assigning.assignedHostelId !== id)
      return row;
    return {
      ...row,
      awaitingDecision: row.awaitingDecision - 1,
      forwarded: row.forwarded - 1,
      headroom: row.headroom + 1,
    };
  };

  const rows = useMemo(
    () =>
      statusFilter === 'All'
        ? data.applications
        : data.applications.filter(a => a.status === statusFilter),
    [data.applications, statusFilter]
  );

  const counts = useMemo(
    () => ({
      pending: data.applications.filter(a => a.status === 'Pending').length,
      forwarded: data.applications.filter(a => a.status === 'Forwarded').length,
      approved: data.applications.filter(a => a.status === 'Approved').length,
      rejected: data.applications.filter(a => a.status === 'Rejected').length,
    }),
    [data.applications]
  );

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  /** Hostels the applicant can be sent to, each labelled with what it can still take. */
  const hostelOptions = assigning
    ? data.hostels
        .filter(
          h => h.status === 'Active' && hostelMatchesGender(h, assigning.gender)
        )
        .map(h => {
          const headroom = pipelineFor(h.id)?.headroom ?? h.capacity;
          return {
            id: h.id,
            text: `${h.nameEn} — ${Math.max(headroom, 0)} of ${h.capacity} seats free to forward`,
          };
        })
    : [];

  const selectedHostel = data.hostels.find(h => h.id === hostelId);
  const selectedPipeline = hostelId ? pipelineFor(hostelId) : undefined;

  const openAssign = (application: Application) => {
    setAssigning(application);
    setHostelId(application.assignedHostelId);
    setNote(application.adminRemarks);
    setViewing(null);
  };

  const closeAssign = () => {
    setAssigning(null);
    setHostelId('');
    setNote('');
  };

  const handleForward = () => {
    if (!assigning || !hostelId) {
      ToastService.success('Pick a hostel to forward this application to.');
      return;
    }
    const moved = assigning.status === 'Forwarded';
    update('applications', assigning.id, {
      ...assigning,
      status: 'Forwarded',
      assignedHostelId: hostelId,
      forwardedOn: today(),
      forwardedBy: MOCK_ADMIN_NAME,
      adminRemarks: note.trim(),
    });
    ToastService.success(
      `${assigning.studentName}'s application ${moved ? 'moved' : 'forwarded'} to ${hostelName(hostelId)}.`
    );
    closeAssign();
  };

  return (
    <FormPage
      title="Admission Requests"
      description="Applications from the public forum land here. Assign each one a hostel — with capacity, occupancy and forwarded requests in view — and forward it to that hostel's warden for approval and room allotment."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Admission Requests')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Awaiting Assignment"
          value={counts.pending}
          icon="forward_to_inbox"
          colorScheme="amber"
          subtitle="With the Hostel Cell — no hostel yet"
        />
        <StatCard
          title="Forwarded to Wardens"
          value={counts.forwarded}
          icon="send"
          colorScheme="blue"
          subtitle="Awaiting a warden's decision"
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon="check_circle"
          colorScheme="green"
          subtitle="Credentials issued by wardens"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon="cancel"
          colorScheme="red"
          subtitle="Returned to the applicant"
        />
      </FormGrid>

      <FormCard
        title="Hostel Capacity at a Glance"
        subtitle="Total capacity, seats occupied and requests already forwarded — so you can judge how many more each hostel can take before you forward."
        icon="chart-bar"
      >
        <GridPanel<CapacityRow>
          data={capacityRows}
          // Every cell derives from applications and allotments, so a
          // memoised cell would keep showing the pre-forward figures.
          cellMemo={false}
          emptyMessage="No hostels registered yet."
          columns={[
            {
              field: 'hostel',
              header: 'Hostel',
              width: 230,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.hostel}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.code} · {item.wardenName || 'No warden'}
                  </span>
                </div>
              ),
            },
            {
              field: 'type',
              header: 'Type',
              width: 90,
              cell: item => (
                <StatusBadge
                  label={item.type}
                  variant={item.type === 'Girls' ? 'info' : 'neutral'}
                />
              ),
            },
            {
              field: 'capacity',
              header: 'Total Capacity',
              width: 130,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.capacity}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.configuredBeds} beds configured
                  </span>
                </div>
              ),
            },
            {
              field: 'occupied',
              header: 'Occupied',
              width: 100,
              cell: item => (
                <span className="font-semibold">{item.occupied}</span>
              ),
            },
            {
              field: 'forwarded',
              header: 'Forwarded',
              width: 190,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.forwarded}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.awaitingDecision} awaiting decision ·{' '}
                    {item.approvedAwaitingRoom} approved, no room yet
                  </span>
                </div>
              ),
            },
            {
              field: 'headroom',
              header: 'Can Forward',
              width: 125,
              cell: item => (
                <StatusBadge
                  label={item.headroom <= 0 ? 'Full' : `${item.headroom} more`}
                  variant={headroomTone(item.headroom)}
                />
              ),
            },
            {
              header: 'Seats Committed',
              sortable: false,
              width: 200,
              cell: item => (
                <OccupancyBar
                  allotted={item.occupied + item.forwarded}
                  total={item.capacity}
                />
              ),
            },
          ]}
        />
        <div className="mt-4">
          <SectionNote tone="info" title="How to read these numbers">
            Occupied counts beds under an active allotment. Forwarded counts
            every request already with the warden that has not yet become an
            occupied bed — awaiting a decision, or approved and waiting for a
            room. Can Forward is the total capacity less both.
          </SectionNote>
        </div>
      </FormCard>

      <FormCard
        title="Applications"
        subtitle="Filter by status, then assign a hostel to each application awaiting assignment."
        icon="inbox"
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Status"
            data={FILTERS}
            textField="text"
            valueField="id"
            value={statusFilter}
            onChange={v => setStatusFilter((v as string) ?? 'All')}
          />
        </FormGrid>

        <GridPanel<Application>
          data={rows}
          searchBox
          searchPlaceholder="Search by name, roll number or application number..."
          searchFields={['studentName', 'rollNumber', 'applicationNo']}
          pagination
          emptyMessage="No applications in this bucket."
          columns={[
            {
              field: 'applicationNo',
              header: 'Application No.',
              width: 155,
              cell: item => (
                <span className="font-mono text-xs">{item.applicationNo}</span>
              ),
            },
            {
              field: 'studentName',
              header: 'Student',
              width: 195,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.studentName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.rollNumber} · {item.gender}
                  </span>
                </div>
              ),
            },
            {
              field: 'programme',
              header: 'Programme',
              width: 180,
              cell: item => (
                <div className="flex flex-col">
                  <span>{item.programme}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.branch}
                  </span>
                </div>
              ),
            },
            {
              field: 'preferredRoomType',
              header: 'Room Preference',
              width: 140,
              cell: item => (
                <StatusBadge
                  label={item.preferredRoomType || 'No preference'}
                  variant={item.preferredRoomType ? 'info' : 'muted'}
                />
              ),
            },
            { field: 'submittedOn', header: 'Submitted', width: 120 },
            {
              field: 'assignedHostelId',
              header: 'Assigned Hostel',
              width: 200,
              cell: item =>
                item.assignedHostelId ? (
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {hostelName(item.assignedHostelId)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Forwarded {item.forwardedOn}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Not assigned</span>
                ),
            },
            {
              field: 'status',
              header: 'Status',
              width: 160,
              cell: item => (
                <StatusBadge
                  label={APPLICATION_STATUS_LABEL[item.status]}
                  variant={APPLICATION_STATUS_VARIANT[item.status]}
                />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              width: 250,
              cell: item => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    size="small"
                    onClick={() => setViewing(item)}
                  />
                  {item.status === 'Pending' && (
                    <Button
                      label="Assign & Forward"
                      icon="send"
                      variant="primary"
                      size="small"
                      onClick={() => openAssign(item)}
                    />
                  )}
                  {item.status === 'Forwarded' && (
                    <Button
                      label="Re-assign"
                      icon="sync"
                      variant="outlined"
                      size="small"
                      onClick={() => openAssign(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={Boolean(viewing)}
        onHide={() => setViewing(null)}
        title="Application Details"
        subtitle={
          viewing ? `${viewing.applicationNo} — ${viewing.studentName}` : ''
        }
        size="xl"
        footer={
          viewing && (
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setViewing(null)}
              />
              {viewing.status === 'Pending' && (
                <Button
                  label="Assign Hostel & Forward"
                  variant="primary"
                  icon="send"
                  onClick={() => openAssign(viewing)}
                />
              )}
              {viewing.status === 'Forwarded' && (
                <Button
                  label="Re-assign Hostel"
                  variant="outlined"
                  icon="sync"
                  onClick={() => openAssign(viewing)}
                />
              )}
            </div>
          )
        }
      >
        {viewing && (
          <>
            <PreviewSection title="Student Details" step={1}>
              <PreviewField label="Student Name" value={viewing.studentName} />
              <PreviewField label="Roll Number" value={viewing.rollNumber} />
              <PreviewField
                label="Enrollment Number"
                value={viewing.enrollmentNumber}
              />
              <PreviewField label="Programme" value={viewing.programme} />
              <PreviewField label="Branch" value={viewing.branch} />
              <PreviewField label="Gender" value={viewing.gender} />
              <PreviewField label="Category" value={viewing.category} />
              <PreviewField label="Date of Birth" value={viewing.dateOfBirth} />
              <PreviewField label="Email" value={viewing.email} />
              <PreviewField label="Mobile" value={viewing.mobileNumber} />
              <PreviewField label="Photograph" value={viewing.photo} />
            </PreviewSection>

            <PreviewSection title="Parent & Guardian" step={2}>
              <PreviewField label="Father's Name" value={viewing.fatherName} />
              <PreviewField label="Mother's Name" value={viewing.motherName} />
              <PreviewField
                label="Parents' Mobile"
                value={viewing.parentMobile}
              />
              <PreviewField
                label="Parents' Email"
                value={viewing.parentEmail}
              />
              <PreviewField
                label="Permanent Address"
                value={viewing.permanentAddress}
                fullWidth
              />
              <PreviewField
                label="Guardian Name"
                value={viewing.guardianName}
              />
              <PreviewField label="Relation" value={viewing.guardianRelation} />
              <PreviewField
                label="Guardian Contact"
                value={viewing.guardianContact}
              />
              <PreviewField
                label="Guardian Address"
                value={viewing.guardianAddress}
                fullWidth
              />
            </PreviewSection>

            <PreviewSection title="Room Preference & Emergency" step={3}>
              <PreviewField
                label="Preferred Room Type"
                value={viewing.preferredRoomType}
              />
              <PreviewField
                label="Emergency Contact"
                value={viewing.emergencyName}
              />
              <PreviewField
                label="Relation"
                value={viewing.emergencyRelation}
              />
              <PreviewField
                label="Contact Number"
                value={viewing.emergencyContact}
              />
            </PreviewSection>

            <PreviewSection title="Health & Consent" step={4}>
              <PreviewField label="Blood Group" value={viewing.bloodGroup} />
              <PreviewField label="Allergies" value={viewing.allergies} />
              <PreviewField
                label="Regular Medication"
                value={viewing.medication}
              />
              <PreviewField
                label="Medical Conditions"
                value={viewing.medicalConditions}
                fullWidth
              />
              <PreviewField
                label="Health Certificate"
                value={viewing.healthCertificate}
              />
              <PreviewField
                label="Guardian Consent"
                value={viewing.guardianConsent ? 'Given' : 'Not given'}
              />
              <PreviewField
                label="Declaration"
                value={viewing.declaration ? 'Accepted' : 'Not accepted'}
              />
            </PreviewSection>

            <PreviewSection title="Hostel Assignment" step={5}>
              <PreviewField
                label="Status"
                value={APPLICATION_STATUS_LABEL[viewing.status]}
              />
              <PreviewField
                label="Assigned Hostel"
                value={
                  viewing.assignedHostelId
                    ? hostelName(viewing.assignedHostelId)
                    : ''
                }
              />
              <PreviewField label="Forwarded On" value={viewing.forwardedOn} />
              <PreviewField label="Forwarded By" value={viewing.forwardedBy} />
              <PreviewField
                label="Note to Warden"
                value={viewing.adminRemarks}
                fullWidth
              />
            </PreviewSection>

            {viewing.status !== 'Pending' && (
              <PreviewSection title="Warden's Decision" step={6}>
                <PreviewField
                  label="Decision Date"
                  value={viewing.decisionDate}
                />
                <PreviewField label="Decided By" value={viewing.decidedBy} />
                <PreviewField
                  label="Remarks"
                  value={viewing.remarks}
                  fullWidth
                />
                <PreviewField label="ERP Login ID" value={viewing.erpLoginId} />
              </PreviewSection>
            )}
          </>
        )}
      </FormPopup>

      <FormPopup
        visible={Boolean(assigning)}
        onHide={closeAssign}
        title={
          assigning?.status === 'Forwarded'
            ? 'Re-assign Hostel'
            : 'Assign Hostel & Forward'
        }
        subtitle={
          assigning
            ? `${assigning.applicationNo} — ${assigning.studentName}`
            : ''
        }
        size="lg"
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button label="Cancel" variant="outlined" onClick={closeAssign} />
            <Button
              label={
                assigning?.status === 'Forwarded'
                  ? 'Move to This Warden'
                  : 'Forward to Warden'
              }
              variant="primary"
              icon="send"
              disabled={!hostelId}
              onClick={handleForward}
            />
          </div>
        }
      >
        {assigning && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <KeyValueTile label="Student" value={assigning.studentName} />
              <KeyValueTile
                label="Gender · Category"
                value={`${assigning.gender || '—'} · ${assigning.category || '—'}`}
              />
              <KeyValueTile
                label="Programme"
                value={`${assigning.programme} · ${assigning.branch}`}
              />
              <KeyValueTile
                label="Preferred Room Type"
                value={assigning.preferredRoomType}
              />
            </div>

            {hostelOptions.length === 0 ? (
              <SectionNote tone="warning" title="No matching hostel">
                No active{' '}
                {assigning.gender === 'Female'
                  ? 'girls'
                  : assigning.gender === 'Male'
                    ? 'boys'
                    : ''}{' '}
                hostel is registered on the system. Register one under Hostel
                Registration, then come back to forward this application.
              </SectionNote>
            ) : (
              <FormGrid columns={1}>
                <DropDownList
                  label="Assign to Hostel"
                  subLabel="Only hostels matching the applicant's gender are listed"
                  data={hostelOptions}
                  textField="text"
                  valueField="id"
                  value={hostelId}
                  onChange={v => setHostelId((v as string) ?? '')}
                />
                <TextArea
                  label="Note to Warden (optional)"
                  rows={2}
                  placeholder="e.g. Documents verified; sibling already resident in this hostel."
                  value={note}
                  onChange={setNote}
                />
              </FormGrid>
            )}

            {selectedHostel && selectedPipeline && (
              <div className="rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {selectedHostel.nameEn} · {selectedHostel.type}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Warden {selectedHostel.wardenName || '—'} ·{' '}
                  {selectedPipeline.configuredBeds} beds configured as rooms
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <KeyValueTile
                    label="Total Capacity"
                    value={selectedPipeline.capacity}
                  />
                  <KeyValueTile
                    label="Occupied"
                    value={selectedPipeline.occupied}
                  />
                  <KeyValueTile
                    label="Forwarded"
                    value={selectedPipeline.forwarded}
                    tone="info"
                  />
                  <KeyValueTile
                    label="Can Forward"
                    value={Math.max(selectedPipeline.headroom, 0)}
                    tone={headroomTone(selectedPipeline.headroom)}
                  />
                </div>
                <div className="mt-3">
                  <OccupancyBar
                    allotted={
                      selectedPipeline.occupied + selectedPipeline.forwarded
                    }
                    total={selectedPipeline.capacity}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {selectedPipeline.headroom <= 0
                    ? 'Every seat in this hostel is occupied or already spoken for.'
                    : `After forwarding this one, ${selectedPipeline.headroom - 1} more request${selectedPipeline.headroom - 1 === 1 ? '' : 's'} can be forwarded here.`}
                </p>
              </div>
            )}

            {selectedPipeline && selectedPipeline.headroom <= 0 && (
              <SectionNote
                tone="danger"
                title="No seats left to forward against"
              >
                Forwarding will still send the application to the warden, but
                they may have no bed to allot. Consider another hostel.
              </SectionNote>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
