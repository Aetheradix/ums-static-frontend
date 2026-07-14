import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function RegistrarDashboard() {
  const navigate = useNavigate();

  const pendingCount = complaints.filter(
    c => c.status === 'Registrar Decision'
  ).length;
  const underReviewCount = complaints.filter(
    c => c.status !== 'Closed' && c.status !== 'Registrar Decision'
  ).length;
  const closedCount = complaints.filter(c => c.status === 'Closed').length;

  return (
    <FormPage
      title="Registrar Executive Dashboard"
      description="DAVV Indore — Registrar office. Sanction resolutions and generate official circulars."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Registrar Portal', to: grvUrls.registrar.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-alert success">
        <i className="pi pi-check-circle"></i>
        <div>
          <span className="font-bold">Executive Control Active:</span> All
          resolutions issued from this portal are mapped directly to complainant
          downloads. Ensure notesheet reviews are finalized.
        </div>
      </div>

      <div className="grv-stats-grid">
        <StatCard
          title="Pending Decision"
          value={pendingCount}
          icon="gavel"
          colorScheme="orange"
          subtitle="Files awaiting final orders"
        />
        <StatCard
          title="Under Process Files"
          value={underReviewCount}
          icon="cached"
          colorScheme="blue"
          subtitle="Active notesheets in departments"
        />
        <StatCard
          title="Closed Grievance Files"
          value={closedCount}
          icon="archive"
          colorScheme="green"
          subtitle="Settled petitions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Registrar Actions">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.registrar.pending)}
            >
              <i className="pi pi-inbox text-orange-600"></i>
              <span>Pending Decisions ({pendingCount})</span>
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

        <FormCard title="Legal Guidelines">
          <div className="text-xs space-y-2 text-slate-600">
            <p>
              1. <strong>Final Sanction:</strong> Appending your final remarks
              on notesheets completes the eOffice file movement lifecycle.
            </p>
            <p>
              2. <strong>Resolution Letter:</strong> Generate official order
              letters detailing compensation or actions which are immediately
              pushed to student/teacher dashboard downloads.
            </p>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
