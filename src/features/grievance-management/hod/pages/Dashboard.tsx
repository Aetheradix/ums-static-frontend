import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function HodDashboard() {
  const navigate = useNavigate();

  // Filter complaints in HoD Review stage
  const pendingCount = complaints.filter(c => c.status === 'HoD Review').length;
  const underProcessCount = complaints.filter(
    c => c.status === 'Committee Review' || c.status === 'Department Review'
  ).length;
  const completedCount = complaints.filter(
    c => c.status === 'Closed' || c.status === 'Registrar Decision'
  ).length;

  return (
    <FormPage
      title="HoD Evaluation Dashboard"
      description="DAVV Indore — Department head portal. Authorize notesheet approvals and file routing."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'HoD Portal', to: grvUrls.hod.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-alert info">
        <i className="pi pi-info-circle"></i>
        <div>
          <span className="font-bold">Pending Actions Alert:</span> There are{' '}
          <strong>{pendingCount}</strong> grievance files currently awaiting
          notesheet remarks from your office.
        </div>
      </div>

      <div className="grv-stats-grid">
        <StatCard
          title="Awaiting Review"
          value={pendingCount}
          icon="mark_unread_chat_alt"
          colorScheme="orange"
          subtitle="Files pending at your desk"
        />
        <StatCard
          title="Other Active Files"
          value={underProcessCount}
          icon="cached"
          colorScheme="blue"
          subtitle="Under officer/committee review"
        />
        <StatCard
          title="Resolved Cases"
          value={completedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Grievances completed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="HoD Action Centre">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.hod.pending)}
            >
              <i className="pi pi-inbox text-orange-600"></i>
              <span>Pending Reviews ({pendingCount})</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.portal)}
            >
              <i className="pi pi-sign-out text-red-600"></i>
              <span>Switch Portal</span>
            </button>
          </div>
        </FormCard>

        <FormCard title="eOffice File Rules">
          <div className="text-xs space-y-2 text-slate-600">
            <p>
              1. <strong>Approve Remarks:</strong> Appending your green remarks
              on notesheets is mandatory for all forwarded folders.
            </p>
            <p>
              2. <strong>File Returns:</strong> If additional data is needed,
              use the <em>Return File</em> action to send the file back to the
              Department Officer.
            </p>
            <p>
              3. <strong>Committee Referral:</strong> If complex investigations
              are needed, refer the notesheet to SGRC, Anti-Ragging, or ICC
              committees.
            </p>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
