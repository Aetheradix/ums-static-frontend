import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { KeyValueTile, SectionNote } from '../components/ui';
import {
  buildStudentCredentials,
  MOCK_WARDEN_HOSTEL_ID,
  nextStudentSequence,
  MOCK_WARDEN_NAME,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Application, ApplicationStatus } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

const STATUS_VARIANT: Record<
  ApplicationStatus,
  'approved' | 'rejected' | 'pending'
> = {
  Approved: 'approved',
  Rejected: 'rejected',
  Pending: 'pending',
};

const FILTERS = [
  { id: 'Pending', text: 'Pending' },
  { id: 'Approved', text: 'Approved' },
  { id: 'Rejected', text: 'Rejected' },
  { id: 'All', text: 'All Applications' },
];

export default function AdmissionRequests() {
  const { data, update } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('Pending');
  const [viewing, setViewing] = useState<Application | null>(null);
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [rejectRemark, setRejectRemark] = useState('');
  const [approved, setApproved] = useState<Application | null>(null);

  /** The warden only sees applications addressed to their own hostel. */
  const scoped = useMemo(
    () =>
      data.applications.filter(
        a => a.preferredHostelId === MOCK_WARDEN_HOSTEL_ID
      ),
    [data.applications]
  );

  const rows = useMemo(
    () =>
      statusFilter === 'All'
        ? scoped
        : scoped.filter(a => a.status === statusFilter),
    [scoped, statusFilter]
  );

  const counts = useMemo(
    () => ({
      pending: scoped.filter(a => a.status === 'Pending').length,
      approved: scoped.filter(a => a.status === 'Approved').length,
      rejected: scoped.filter(a => a.status === 'Rejected').length,
    }),
    [scoped]
  );

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  const handleApprove = (application: Application) => {
    const sequence = nextStudentSequence(data);
    const credentials = buildStudentCredentials(
      application.studentName,
      sequence
    );
    const next: Application = {
      ...application,
      status: 'Approved',
      decisionDate: today(),
      decidedBy: MOCK_WARDEN_NAME,
      remarks: application.remarks || 'Application approved.',
      ...credentials,
    };
    update('applications', application.id, next);
    setViewing(null);
    setApproved(next);
    ToastService.success(
      `${application.studentName}'s application approved. ERP credentials issued.`
    );
  };

  const handleReject = () => {
    if (!rejecting) return;
    update('applications', rejecting.id, {
      ...rejecting,
      status: 'Rejected',
      decisionDate: today(),
      decidedBy: MOCK_WARDEN_NAME,
      remarks: rejectRemark.trim() || 'Application rejected.',
      erpLoginId: '',
      erpPassword: '',
    });
    ToastService.success(`${rejecting.studentName}'s application rejected.`);
    setRejecting(null);
    setRejectRemark('');
    setViewing(null);
  };

  const handleReopen = (application: Application) => {
    update('applications', application.id, {
      ...application,
      status: 'Pending',
      decisionDate: '',
      decidedBy: '',
      remarks: '',
      erpLoginId: '',
      erpPassword: '',
    });
    ToastService.success('Application moved back to Pending.');
  };

  return (
    <FormPage
      title="Admission Requests"
      description="Applications sent to your hostel from the public forum. Approving one issues the student their ERP credentials so they can sign in and pay."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Admission Requests')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Pending Review"
          value={counts.pending}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Awaiting your decision"
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon="check_circle"
          colorScheme="green"
          subtitle="Credentials issued"
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
        title="Applications"
        subtitle="Filter by decision status, then open an application to review it in full."
        icon="inbox"
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Decision Status"
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
            { field: 'submittedOn', header: 'Submitted', width: 125 },
            {
              field: 'status',
              header: 'Status',
              width: 115,
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={STATUS_VARIANT[item.status]}
                />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              width: 260,
              cell: item => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    size="small"
                    onClick={() => setViewing(item)}
                  />
                  {item.status === 'Pending' ? (
                    <>
                      <Button
                        label="Approve"
                        icon="check"
                        variant="success"
                        size="small"
                        onClick={() => handleApprove(item)}
                      />
                      <Button
                        label="Reject"
                        icon="times"
                        variant="danger"
                        size="small"
                        onClick={() => {
                          setRejecting(item);
                          setRejectRemark('');
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      label="Re-open"
                      icon="replay"
                      variant="outlined"
                      size="small"
                      onClick={() => handleReopen(item)}
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
                <>
                  <Button
                    label="Reject"
                    variant="danger"
                    icon="times"
                    onClick={() => {
                      setRejecting(viewing);
                      setRejectRemark('');
                    }}
                  />
                  <Button
                    label="Approve & Issue Credentials"
                    variant="success"
                    icon="check"
                    onClick={() => handleApprove(viewing)}
                  />
                </>
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

            <PreviewSection title="Hostel Preference & Emergency" step={3}>
              <PreviewField
                label="Preferred Hostel"
                value={hostelName(viewing.preferredHostelId)}
              />
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

            <PreviewSection title="Decision" step={5}>
              <PreviewField label="Status" value={viewing.status} />
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

      <FormPopup
        visible={Boolean(rejecting)}
        onHide={() => setRejecting(null)}
        title="Reject Application"
        subtitle={rejecting?.studentName}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setRejecting(null)}
            />
            <Button
              label="Confirm Rejection"
              variant="danger"
              onClick={handleReject}
            />
          </div>
        }
      >
        <TextArea
          label="Reason for Rejection"
          rows={4}
          placeholder="Shown to the applicant on the public tracking page."
          value={rejectRemark}
          onChange={setRejectRemark}
        />
      </FormPopup>

      <FormPopup
        visible={Boolean(approved)}
        onHide={() => setApproved(null)}
        title="ERP Credentials Issued"
        subtitle="The student can now sign in, pay the hostel fee and caution money, and be allotted a room."
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Allot a Room"
              icon="bed"
              variant="outlined"
              onClick={() => {
                setApproved(null);
                navigate(hmsUrls.warden.roomAllocation);
              }}
            />
            <Button
              label="Done"
              variant="primary"
              onClick={() => setApproved(null)}
            />
          </div>
        }
      >
        {approved && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {approved.studentName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {approved.rollNumber} · {hostelName(approved.preferredHostelId)}{' '}
                · prefers{' '}
                {approved.preferredRoomType || 'no particular room type'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KeyValueTile label="Login ID" value={approved.erpLoginId} mono />
              <KeyValueTile
                label="Password"
                value={approved.erpPassword}
                mono
              />
            </div>
            <SectionNote tone="info">
              These also appear to the student on the public
              application-tracking page. Allot them a room once their fee is
              paid.
            </SectionNote>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
