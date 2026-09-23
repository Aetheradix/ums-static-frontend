import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
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
import { SectionNote } from '../components/ui';
import {
  isAwaitingRoom,
  MOCK_WARDEN_HOSTEL_ID,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Application } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

const FILTERS = [
  { id: 'Awaiting', text: 'Awaiting Room Allotment' },
  { id: 'Allotted', text: 'Room Allotted' },
  { id: 'All', text: 'All Students' },
];

/**
 * The warden's intake list. Admission decisions belong to the University
 * Hostel Cell — everything here is already approved and forwarded, so the
 * warden's job on this screen is to read a student's details and allot them a
 * room.
 */
export default function AdmissionRequests() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('Awaiting');
  const [viewing, setViewing] = useState<Application | null>(null);

  /** Students the Hostel Cell has approved and forwarded to this hostel. */
  const scoped = useMemo(
    () =>
      data.applications.filter(
        a =>
          a.assignedHostelId === MOCK_WARDEN_HOSTEL_ID &&
          a.status === 'Approved'
      ),
    [data.applications]
  );

  /** The room number this student holds, once the warden has allotted one. */
  const roomNumber = (application: Application) => {
    if (!application.erpLoginId) return '';
    const allotment = data.allocations.find(
      a => a.status === 'Active' && a.studentId === application.erpLoginId
    );
    if (!allotment) return '';
    return (
      data.rooms.find(r => r.id === allotment.roomId)?.roomNumber ??
      allotment.roomId
    );
  };

  const rows = useMemo(() => {
    if (statusFilter === 'All') return scoped;
    const awaiting = statusFilter === 'Awaiting';
    return scoped.filter(a => isAwaitingRoom(a, data.allocations) === awaiting);
  }, [scoped, statusFilter, data.allocations]);

  const counts = useMemo(() => {
    const awaiting = scoped.filter(a =>
      isAwaitingRoom(a, data.allocations)
    ).length;
    return {
      forwarded: scoped.length,
      awaiting,
      allotted: scoped.length - awaiting,
    };
  }, [scoped, data.allocations]);

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  return (
    <FormPage
      title="Admission Requests"
      description="Students the University Hostel Cell has approved and forwarded to your hostel. Review each one and allot them a room — the admission decision has already been taken."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Admission Requests')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Forwarded to You"
          value={counts.forwarded}
          icon="how_to_reg"
          colorScheme="blue"
          subtitle="Approved by the Hostel Cell"
        />
        <StatCard
          title="Awaiting Room"
          value={counts.awaiting}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="No room allotted yet"
        />
        <StatCard
          title="Room Allotted"
          value={counts.allotted}
          icon="bed"
          colorScheme="green"
          subtitle="Settled into your hostel"
        />
      </FormGrid>

      <FormCard
        title="Forwarded Students"
        subtitle="Filter by allotment status, then open a student to review their application in full."
        icon="inbox"
        headerAction={
          <Button
            label="Room Allotment"
            icon="arrow-right"
            variant="outlined"
            size="small"
            onClick={() => navigate(hmsUrls.warden.roomAllocation)}
          />
        }
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Allotment Status"
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
          // Allotment state comes from allocations rather than the row, so a
          // memoised cell would keep showing the pre-allotment status.
          cellMemo={false}
          emptyMessage="No students in this bucket."
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
              width: 190,
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
              width: 150,
              cell: item => (
                <StatusBadge
                  label={item.preferredRoomType || 'No preference'}
                  variant={item.preferredRoomType ? 'info' : 'muted'}
                />
              ),
            },
            {
              field: 'forwardedOn',
              header: 'Forwarded',
              width: 130,
              cell: item => (
                <div className="flex flex-col">
                  <span>{item.forwardedOn || '—'}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Applied {item.submittedOn}
                  </span>
                </div>
              ),
            },
            {
              header: 'Room',
              sortable: false,
              width: 160,
              cell: item => {
                const room = roomNumber(item);
                return room ? (
                  <StatusBadge label={`Room ${room}`} variant="success" />
                ) : (
                  <StatusBadge label="Awaiting allotment" variant="pending" />
                );
              },
            },
            {
              header: 'Action',
              sortable: false,
              width: 210,
              cell: item => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    size="small"
                    onClick={() => setViewing(item)}
                  />
                  {isAwaitingRoom(item, data.allocations) && (
                    <Button
                      label="Allot Room"
                      icon="bed"
                      variant="primary"
                      size="small"
                      onClick={() => navigate(hmsUrls.warden.roomAllocation)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
        <div className="mt-4">
          <SectionNote tone="info" title="Who decides an admission">
            The University Hostel Cell approves or rejects every application and
            assigns the hostel. Students reach this list already approved, with
            their ERP credentials issued — allot each one a room under Room
            Allotment.
          </SectionNote>
        </div>
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
              {isAwaitingRoom(viewing, data.allocations) && (
                <Button
                  label="Allot a Room"
                  variant="primary"
                  icon="bed"
                  onClick={() => {
                    setViewing(null);
                    navigate(hmsUrls.warden.roomAllocation);
                  }}
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

            <PreviewSection title="Hostel Assignment & Emergency" step={3}>
              <PreviewField
                label="Assigned Hostel"
                value={hostelName(viewing.assignedHostelId)}
              />
              <PreviewField
                label="Preferred Room Type"
                value={viewing.preferredRoomType}
              />
              <PreviewField label="Forwarded On" value={viewing.forwardedOn} />
              <PreviewField label="Forwarded By" value={viewing.forwardedBy} />
              <PreviewField
                label="Note from Hostel Cell"
                value={viewing.adminRemarks}
                fullWidth
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

            <PreviewSection title="Hostel Cell's Decision" step={5}>
              <PreviewField
                label="Decision Date"
                value={viewing.decisionDate}
              />
              <PreviewField label="Decided By" value={viewing.decidedBy} />
              <PreviewField label="Remarks" value={viewing.remarks} fullWidth />
              <PreviewField label="ERP Login ID" value={viewing.erpLoginId} />
              <PreviewField label="ERP Password" value={viewing.erpPassword} />
            </PreviewSection>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
