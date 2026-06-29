import { mockAlumniProfiles } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import Tabs from 'shared/new-components/Tabs';

const KPI_COLORS: Record<string, string> = {
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
};

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${KPI_COLORS[color] || KPI_COLORS.teal}`}
    >
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ── Tab 1: Verification Queue ── */
function VerificationQueueTab() {
  const pending = mockAlumniProfiles.filter(p => p.status === 'Pending');
  const columns = [
    { field: 'enrolmentNo', header: 'Enrolment No' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'program', header: 'Programme' },
    { field: 'yearOfPassing', header: 'Year' },
    { field: 'mobileNumber', header: 'Mobile' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'registeredOn', header: 'Reg Date' },
    {
      field: 'pendingReason',
      header: 'Pending Reason',
      body: (row: any) => (
        <span className="text-amber-600 font-medium">{row.pendingReason}</span>
      ),
    },
  ];
  return (
    <FormCard title="Verification Queue">
      <div className="p-2">
        <GridPanel
          searchBox
          toolbar={<Button label="Export Queue" icon="pi pi-download" />}
          data={pending}
          columns={columns as any}
          editCaption="Verify"
          removeCaption="Reject"
          onEdit={() => {}}
          onRemove={() => {}}
        />
      </div>
    </FormCard>
  );
}

/* ── Tab 2: Duplicate Resolution ── */
function DuplicateRecordsTab() {
  const duplicates = mockAlumniProfiles.filter(p => p.isDuplicate);
  const columns = [
    { field: 'enrolmentNo', header: 'Enrolment No' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'program', header: 'Programme' },
    { field: 'yearOfPassing', header: 'Year' },
    {
      field: 'systemFlag',
      header: 'System Flag',
      body: (row: any) => (
        <span className="text-rose-600 font-medium">
          Potential Match: {row.systemFlag}
        </span>
      ),
    },
  ];
  return (
    <FormCard title="Duplicate Records Resolution">
      <div className="p-2">
        <GridPanel
          searchBox
          data={duplicates}
          columns={columns as any}
          editCaption="Merge / Resolve"
          removeCaption="Mark Unique"
          onEdit={() => {}}
          onRemove={() => {}}
        />
      </div>
    </FormCard>
  );
}

/* ── Tab 3: Rejected Applications ── */
function RejectedApplicationsTab() {
  const rejected = mockAlumniProfiles.filter(p => p.status === 'Rejected');
  const columns = [
    { field: 'enrolmentNo', header: 'Enrolment No' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'program', header: 'Programme' },
    { field: 'yearOfPassing', header: 'Year' },
    {
      field: 'rejectionReason',
      header: 'Rejection Reason',
      body: (row: any) => (
        <span className="text-red-600">{row.rejectionReason}</span>
      ),
    },
    {
      field: 'status',
      header: 'Status',
      body: () => <StatusBadge label="Rejected" variant="rejected" />,
    },
  ];
  return (
    <FormCard title="Rejected Alumni Applications">
      <div className="p-2">
        <GridPanel
          searchBox
          data={rejected}
          columns={columns as any}
          editCaption="View Details"
          removeCaption="Re-evaluate"
          onEdit={() => {}}
          onRemove={() => {}}
        />
      </div>
    </FormCard>
  );
}

/* ── Main Dashboard Page ── */
export default function RegistrationDashboard() {
  const total = mockAlumniProfiles.length;
  const verified = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  ).length;
  const pending = mockAlumniProfiles.filter(p => p.status === 'Pending').length;
  const rejected = mockAlumniProfiles.filter(
    p => p.status === 'Rejected'
  ).length;
  const duplicate = mockAlumniProfiles.filter(p => p.isDuplicate).length;

  return (
    <FormPage
      title="Registration Management"
      description="Manage new alumni registrations, verifications, and duplicate resolution"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Registration Management' },
      ]}
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Total Registered" value={total} color="teal" />
        <KpiCard label="Pending Verifications" value={pending} color="orange" />
        <KpiCard label="Verified" value={verified} color="green" />
        <KpiCard label="Duplicate Flags" value={duplicate} color="blue" />
        <KpiCard label="Rejected" value={rejected} color="red" />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { title: 'Verification Queue', content: <VerificationQueueTab /> },
          { title: 'Duplicate Records', content: <DuplicateRecordsTab /> },
          { title: 'Rejected Apps', content: <RejectedApplicationsTab /> },
        ]}
      />
    </FormPage>
  );
}
