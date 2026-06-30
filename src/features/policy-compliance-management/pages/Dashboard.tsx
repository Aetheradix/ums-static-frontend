import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import {
  INITIAL_POLICIES,
  INITIAL_COMPLIANCE_ASSIGNMENTS,
  INITIAL_AUDITS,
  INITIAL_NON_COMPLIANCES,
  INITIAL_ACKNOWLEDGEMENTS,
} from '../data';

export default function Dashboard() {
  // ── Stat Calculations ────────────────────────────────────────────────
  const totalPolicies = INITIAL_POLICIES.length;
  const activePolicies = INITIAL_POLICIES.filter(
    p => p.status === 'Published'
  ).length;
  const draftPolicies = INITIAL_POLICIES.filter(
    p => p.status === 'Draft'
  ).length;
  const expiredPolicies = INITIAL_POLICIES.filter(
    p => p.status === 'Expired'
  ).length;
  const pendingApprovals = INITIAL_POLICIES.filter(
    p => p.status === 'Under Review' || p.status === 'Reviewed'
  ).length;
  const pendingCompliance = INITIAL_COMPLIANCE_ASSIGNMENTS.filter(
    a => a.status === 'Pending'
  ).length;
  const completedCompliance = INITIAL_COMPLIANCE_ASSIGNMENTS.filter(
    a => a.status === 'Verified'
  ).length;
  const overdueCompliance = INITIAL_COMPLIANCE_ASSIGNMENTS.filter(a => {
    const deadline = new Date(a.deadline);
    return deadline < new Date() && a.status !== 'Verified';
  }).length;
  const openAuditFindings = INITIAL_NON_COMPLIANCES.filter(
    nc => nc.status === 'Open' || nc.status === 'In Progress'
  ).length;
  const closedIssues = INITIAL_NON_COMPLIANCES.filter(
    nc => nc.status === 'Resolved' || nc.status === 'Closed'
  ).length;

  // ── Department-wise Compliance ────────────────────────────────────────
  const deptCompliance = INITIAL_COMPLIANCE_ASSIGNMENTS.reduce(
    (acc: Record<string, { total: number; completed: number }>, a) => {
      if (!acc[a.assignedTo]) acc[a.assignedTo] = { total: 0, completed: 0 };
      acc[a.assignedTo].total++;
      if (a.status === 'Verified') acc[a.assignedTo].completed++;
      return acc;
    },
    {}
  );

  // ── Acknowledgement Stats ────────────────────────────────────────────
  const ackByPolicy = INITIAL_ACKNOWLEDGEMENTS.reduce(
    (acc: Record<string, number>, a) => {
      acc[a.policyName] = (acc[a.policyName] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <FormPage
      title="Policy & Compliance Dashboard"
      description="Real-time overview of policy lifecycle, compliance status, and audit findings"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Dashboard' },
      ]}
    >
      {/* ── Top-Level Stat Cards ── */}
      <FormGrid columns={4}>
        <StatCard
          title="Total Policies"
          value={totalPolicies}
          icon="description"
          colorScheme="blue"
        />
        <StatCard
          title="Active Policies"
          value={activePolicies}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Draft Policies"
          value={draftPolicies}
          icon="edit_note"
          colorScheme="amber"
        />
        <StatCard
          title="Expired Policies"
          value={expiredPolicies}
          icon="schedule"
          colorScheme="red"
        />
      </FormGrid>

      <FormGrid columns={4}>
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon="pending_actions"
          colorScheme="orange"
        />
        <StatCard
          title="Pending Compliance"
          value={pendingCompliance}
          icon="assignment_late"
          colorScheme="purple"
        />
        <StatCard
          title="Completed Compliance"
          value={completedCompliance}
          icon="task_alt"
          colorScheme="teal"
        />
        <StatCard
          title="Overdue Compliance"
          value={overdueCompliance}
          icon="warning"
          colorScheme="red"
        />
      </FormGrid>

      <FormGrid columns={2}>
        <StatCard
          title="Open Audit Findings"
          value={openAuditFindings}
          icon="find_in_page"
          colorScheme="indigo"
        />
        <StatCard
          title="Closed Issues"
          value={closedIssues}
          icon="verified"
          colorScheme="green"
        />
      </FormGrid>

      {/* ── Department-wise Compliance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FormCard title="Department-wise Compliance" icon="bar_chart">
          <div className="space-y-4">
            {Object.entries(deptCompliance).map(([dept, data]) => {
              const pct =
                data.total > 0
                  ? Math.round((data.completed / data.total) * 100)
                  : 0;
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span className="truncate pr-2">{dept}</span>
                    <span>
                      {data.completed}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        pct === 100
                          ? 'bg-green-500'
                          : pct >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="User Acknowledgement by Policy" icon="how_to_reg">
          <div className="space-y-3">
            {Object.entries(ackByPolicy).map(([policy, count]) => (
              <div
                key={policy}
                className="flex justify-between text-sm text-gray-700 py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="truncate pr-2 font-medium">{policy}</span>
                <span className="font-bold text-gray-900 shrink-0">
                  {count} Acknowledgements
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      {/* ── Recent Policies ── */}
      <div className="mt-6">
        <FormCard title="Recent Policies" icon="list">
          <GridPanel
            data={INITIAL_POLICIES.slice(0, 5)}
            columns={[
              { field: 'id', header: 'Policy ID', width: '100px' },
              { field: 'name', header: 'Policy Name' },
              { field: 'category', header: 'Category' },
              { field: 'department', header: 'Department' },
              { field: 'versionNumber', header: 'Version', width: '80px' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => {
                  const variant =
                    item.status === 'Published'
                      ? 'approved'
                      : item.status === 'Draft'
                        ? 'neutral'
                        : item.status === 'Under Review'
                          ? 'pending'
                          : item.status === 'Rejected'
                            ? 'rejected'
                            : 'neutral';
                  return <StatusBadge label={item.status} variant={variant} />;
                },
              },
              { field: 'effectiveDate', header: 'Effective Date' },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>

      {/* ── Audit Overview ── */}
      <div className="mt-6">
        <FormCard title="Audit Overview" icon="fact_check">
          <GridPanel
            data={INITIAL_AUDITS}
            columns={[
              { field: 'id', header: 'Audit ID', width: '100px' },
              { field: 'name', header: 'Audit Name' },
              { field: 'department', header: 'Department' },
              { field: 'auditDate', header: 'Audit Date' },
              { field: 'auditor', header: 'Auditor' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => {
                  const variant =
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'In Progress'
                        ? 'pending'
                        : 'neutral';
                  return <StatusBadge label={item.status} variant={variant} />;
                },
              },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
