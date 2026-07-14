import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  complaints,
  grievanceCategories,
  departmentMappings,
  integrationPortals,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const total = complaints.length;
  const categoriesCount = grievanceCategories.length;
  const deptsCount = departmentMappings.length;
  const integrationsCount = integrationPortals.length;

  return (
    <FormPage
      title="ERP Administration Hub"
      description="DAVV Indore — Central control hub for configuring categories, managing workflows, mapping roles, and checking security audit trails."
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
          value={total}
          icon="folder"
          colorScheme="blue"
          subtitle="All lodgings in system"
        />
        <StatCard
          title="Grievance Categories"
          value={categoriesCount}
          icon="tags"
          colorScheme="green"
          subtitle="Configured intake categories"
        />
        <StatCard
          title="Mapped Departments"
          value={deptsCount}
          icon="business"
          colorScheme="purple"
          subtitle="Active routing channels"
        />
        <StatCard
          title="Active Integrations"
          value={integrationsCount}
          icon="sync"
          colorScheme="orange"
          subtitle="National/State API portals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Administration Quick Links">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.masters)}
            >
              <i className="pi pi-cog text-blue-600"></i>
              <span>Masters</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.users)}
            >
              <i className="pi pi-users text-green-600"></i>
              <span>User & Roles</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.workflow)}
            >
              <i className="pi pi-sitemap text-purple-600"></i>
              <span>Workflow Setup</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.admin.reports)}
            >
              <i className="pi pi-history text-red-600"></i>
              <span>Audit & Reports</span>
            </button>
          </div>
        </FormCard>

        <FormCard title="Active External Gateways">
          <div className="overflow-x-auto text-[11px]">
            <table className="grv-table w-full">
              <thead>
                <tr>
                  <th>Portal</th>
                  <th>Last Sync</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {integrationPortals.map(p => (
                  <tr key={p.id}>
                    <td className="font-bold text-slate-700">{p.name}</td>
                    <td className="font-mono text-slate-500">{p.lastSync}</td>
                    <td>
                      <span className="grv-status-pill approved">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
