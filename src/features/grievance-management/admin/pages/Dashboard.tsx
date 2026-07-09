import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints, integrationPortals } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

function PortalSyncVolumeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'UGC e-Samadhan',
          'CM Helpline',
          'CPGRAMS',
          'DigiLocker',
          'eSign',
        ],
        datasets: [
          {
            label: 'API Request Syncs Volume',
            data: [248, 312, 178, 890, 234],
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref}></canvas>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalComplaints = complaints.length;
  const connectedAPIs = integrationPortals.filter(
    p => p.status === 'Connected'
  ).length;
  const totalAPIs = integrationPortals.length;

  return (
    <FormPage
      title="ERP System Administration Hub"
      description="Configure grievance rules, monitor external portal integrations and track system audit trail logs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-stats-grid">
        <StatCard
          title="Total Registered Complaints"
          value={totalComplaints}
          icon="folder"
          colorScheme="blue"
          subtitle="DAVV all features"
        />
        <StatCard
          title="Integrated Gateways"
          value={`${connectedAPIs}/${totalAPIs}`}
          icon="api"
          colorScheme="green"
          subtitle="API connections active"
        />
        <StatCard
          title="Escalated Alerts"
          value="2"
          icon="warning"
          colorScheme="red"
          subtitle="Critical SLA breaches"
        />
        <StatCard
          title="System Logs Generated"
          value="1,490"
          icon="history"
          colorScheme="purple"
          subtitle="RTI trail compliant"
        />
      </div>

      <div className="grv-charts-row">
        <FormCard title="External Portal Sync Volume Share">
          <div style={{ height: 220 }}>
            <PortalSyncVolumeChart />
          </div>
        </FormCard>

        <FormCard title="Administration Configurations Desk">
          <div className="grv-quick-actions font-bold">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.categories)}
            >
              <i className="pi pi-tags text-blue-600"></i>
              <span>Category Master</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.departments)}
            >
              <i className="pi pi-map text-green-600"></i>
              <span>Department Mapping</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.workflow)}
            >
              <i className="pi pi-sliders-h text-yellow-600"></i>
              <span>Workflow & Escalation</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.sla)}
            >
              <i className="pi pi-clock text-red-600"></i>
              <span>SLA Configuration</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.notifications)}
            >
              <i className="pi pi-bell text-teal-600"></i>
              <span>Notification Templates</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.integrations)}
            >
              <i className="pi pi-globe text-indigo-600"></i>
              <span>Integration Gateway</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.audit)}
            >
              <i className="pi pi-lock text-gray-600"></i>
              <span>Audit Trails</span>
            </button>
          </div>
        </FormCard>
      </div>

      <FormCard title="Direct API Connections Status" icon="api">
        <table className="grv-table">
          <thead>
            <tr>
              <th>Portal Name</th>
              <th>Endpoint URL</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Total Transferred</th>
              <th>Failed Request Actions</th>
            </tr>
          </thead>
          <tbody>
            {integrationPortals.slice(0, 4).map(p => (
              <tr key={p.id}>
                <td className="font-bold text-slate-800">
                  {p.name} ({p.acronym})
                </td>
                <td className="font-mono text-xs text-slate-500">
                  {p.endpoint}
                </td>
                <td>
                  <span
                    className={`grv-status-pill ${p.status === 'Connected' ? 'active' : 'sla-breached'}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{p.lastSync}</td>
                <td>{p.totalSynced} items</td>
                <td>
                  <button
                    onClick={() => navigate(grvUrls.admin.integrations)}
                    className="text-xs bg-slate-100 border hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded"
                  >
                    Setup API
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
