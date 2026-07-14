import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import type { Complaint } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function DepartmentOfficerDashboard() {
  const navigate = useNavigate();

  // Filter complaints assigned to this officer's department (SCSIT or Estate)
  const newComplaintsCount = complaints.filter(
    (c: Complaint) => c.status === 'Submitted'
  ).length;
  const underProcessCount = complaints.filter(
    (c: Complaint) =>
      c.status === 'Department Review' ||
      c.status === 'HoD Review' ||
      c.status === 'Committee Review'
  ).length;
  const completedCount = complaints.filter(
    (c: Complaint) => c.status === 'Closed' || c.status === 'Registrar Decision'
  ).length;

  return (
    <FormPage
      title="Department Officer Desk"
      description="DAVV Indore — Review assigned student/teacher files, compile official notesheets, and draft recommendations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: 'Department Officer Portal',
          to: grvUrls.departmentOfficer.portal,
        },
        { label: 'Dashboard' },
      ]}
    >
      {/* eOffice Notice banner */}
      <div className="grv-alert success">
        <i className="pi pi-check-circle"></i>
        <div>
          <span className="font-bold">eOffice Portal Status Active:</span> You
          are connected to the central university file tracking system.
          Notesheet drafting is mandatory for all file forward/return movements.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grv-stats-grid">
        <StatCard
          title="New Files"
          value={newComplaintsCount}
          icon="mark_unread_chat_alt"
          colorScheme="blue"
          subtitle="Awaiting notesheet creation"
        />
        <StatCard
          title="Under Process"
          value={underProcessCount}
          icon="cached"
          colorScheme="orange"
          subtitle="Notesheet movement active"
        />
        <StatCard
          title="Completed Cases"
          value={completedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Settled files"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Officer Action Shortcuts">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.departmentOfficer.inbox)}
            >
              <i className="pi pi-inbox text-green-600"></i>
              <span>Go to Inbox</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.portal)}
            >
              <i className="pi pi-sign-out text-red-600"></i>
              <span>Switch Role</span>
            </button>
          </div>
        </FormCard>

        <FormCard title="Summary Guidelines">
          <div className="text-xs space-y-2 text-slate-600 leading-relaxed">
            <p>
              1. <strong>Notesheet Draft:</strong> Click on any ticket in your
              inbox and click <em>Create Notesheet</em> to initialize
              green-paper drafting.
            </p>
            <p>
              2. <strong>File Movement:</strong> Ensure to mention the exact
              recipient and select action type (Verify, Forward, Return) before
              dispatching files to HOD.
            </p>
            <p>
              3. <strong>Document DMS:</strong> Supporting documents are
              auto-synced with the central Document Management System.
            </p>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
