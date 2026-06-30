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
  INITIAL_COMPLIANCE_SUBMISSIONS,
  INITIAL_AUDITS,
  INITIAL_NON_COMPLIANCES,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_ACKNOWLEDGEMENTS,
} from '../data';

export default function Reports() {
  // ── Aggregate Stats ──────────────────────────────────────────────────
  const totalPolicies = INITIAL_POLICIES.length;
  const publishedPolicies = INITIAL_POLICIES.filter(
    p => p.status === 'Published'
  ).length;
  const totalAcknowledgements = INITIAL_ACKNOWLEDGEMENTS.length;
  const totalAssignments = INITIAL_COMPLIANCE_ASSIGNMENTS.length;
  const verifiedSubmissions = INITIAL_COMPLIANCE_SUBMISSIONS.filter(
    s => s.status === 'Verified'
  ).length;
  const totalAudits = INITIAL_AUDITS.length;
  const completedAudits = INITIAL_AUDITS.filter(
    a => a.status === 'Completed'
  ).length;
  const totalNCIssues = INITIAL_NON_COMPLIANCES.length;
  const resolvedNCIssues = INITIAL_NON_COMPLIANCES.filter(
    nc => nc.status === 'Resolved' || nc.status === 'Closed'
  ).length;
  const totalCAPAs = INITIAL_CORRECTIVE_ACTIONS.length;

  // ── Department-wise data ─────────────────────────────────────────────
  const deptData = INITIAL_COMPLIANCE_ASSIGNMENTS.reduce(
    (
      acc: Record<
        string,
        { total: number; pending: number; verified: number; rejected: number }
      >,
      a
    ) => {
      if (!acc[a.assignedTo])
        acc[a.assignedTo] = {
          total: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
        };
      acc[a.assignedTo].total++;
      if (a.status === 'Pending') acc[a.assignedTo].pending++;
      if (a.status === 'Verified') acc[a.assignedTo].verified++;
      if (a.status === 'Rejected') acc[a.assignedTo].rejected++;
      return acc;
    },
    {}
  );

  // ── Policy category distribution ─────────────────────────────────────
  const categoryDistribution = INITIAL_POLICIES.reduce(
    (acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <FormPage
      title="Reports & Analytics"
      description="Comprehensive reports on policy lifecycle, compliance, audits, and corrective actions"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Reports' },
      ]}
    >
      {/* ── Summary Cards ── */}
      <FormGrid columns={4}>
        <StatCard
          title="Total Policies"
          value={totalPolicies}
          icon="description"
          colorScheme="blue"
          subtitle={`${publishedPolicies} Published`}
        />
        <StatCard
          title="Acknowledgements"
          value={totalAcknowledgements}
          icon="how_to_reg"
          colorScheme="green"
        />
        <StatCard
          title="Compliance Assignments"
          value={totalAssignments}
          icon="assignment"
          colorScheme="purple"
          subtitle={`${verifiedSubmissions} Verified`}
        />
        <StatCard
          title="Audits Conducted"
          value={totalAudits}
          icon="fact_check"
          colorScheme="orange"
          subtitle={`${completedAudits} Completed`}
        />
      </FormGrid>

      <FormGrid columns={3}>
        <StatCard
          title="Non-Compliance Issues"
          value={totalNCIssues}
          icon="warning"
          colorScheme="red"
          subtitle={`${resolvedNCIssues} Resolved`}
        />
        <StatCard
          title="CAPA Records"
          value={totalCAPAs}
          icon="build"
          colorScheme="teal"
        />
        <StatCard
          title="Compliance Rate"
          value={`${totalAssignments > 0 ? Math.round((verifiedSubmissions / totalAssignments) * 100) : 0}%`}
          icon="trending_up"
          colorScheme="indigo"
        />
      </FormGrid>

      {/* ── Department-wise Compliance Report ── */}
      <div className="mt-6">
        <FormCard title="Department-wise Compliance Report" icon="bar_chart">
          <GridPanel
            data={Object.entries(deptData).map(([dept, data]) => ({
              department: dept,
              total: data.total,
              pending: data.pending,
              verified: data.verified,
              rejected: data.rejected,
              completionRate:
                data.total > 0
                  ? `${Math.round((data.verified / data.total) * 100)}%`
                  : '0%',
            }))}
            columns={[
              { field: 'department', header: 'Department' },
              { field: 'total', header: 'Total', width: '80px' },
              {
                field: 'pending',
                header: 'Pending',
                width: '90px',
                cell: (item: any) => (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-bold">
                    {item.pending}
                  </span>
                ),
              },
              {
                field: 'verified',
                header: 'Verified',
                width: '90px',
                cell: (item: any) => (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-bold">
                    {item.verified}
                  </span>
                ),
              },
              {
                field: 'rejected',
                header: 'Rejected',
                width: '90px',
                cell: (item: any) => (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-bold">
                    {item.rejected}
                  </span>
                ),
              },
              {
                field: 'completionRate',
                header: 'Completion Rate',
                width: '130px',
                cell: (item: any) => (
                  <span className="font-bold text-indigo-700">
                    {item.completionRate}
                  </span>
                ),
              },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>

      {/* ── Policy Category Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FormCard title="Policy Category Distribution" icon="pie_chart">
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([cat, count]) => {
              const pct =
                totalPolicies > 0
                  ? Math.round((count / totalPolicies) * 100)
                  : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>{cat}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="Audit Summary" icon="summarize">
          <GridPanel
            data={INITIAL_AUDITS}
            columns={[
              { field: 'name', header: 'Audit Name' },
              { field: 'department', header: 'Dept.' },
              {
                field: 'status',
                header: 'Status',
                width: '110px',
                cell: (item: any) => (
                  <StatusBadge
                    label={item.status}
                    variant={
                      item.status === 'Completed'
                        ? 'approved'
                        : item.status === 'In Progress'
                          ? 'pending'
                          : 'neutral'
                    }
                  />
                ),
              },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>

      {/* ── Non-Compliance Summary ── */}
      <div className="mt-6">
        <FormCard title="Non-Compliance & CAPA Summary" icon="report">
          <GridPanel
            data={INITIAL_NON_COMPLIANCES}
            columns={[
              { field: 'id', header: 'NC ID', width: '90px' },
              { field: 'auditName', header: 'Audit' },
              { field: 'department', header: 'Department' },
              { field: 'responsiblePerson', header: 'Responsible' },
              { field: 'deadline', header: 'Deadline', width: '110px' },
              {
                field: 'status',
                header: 'Status',
                width: '110px',
                cell: (item: any) => {
                  const variant =
                    item.status === 'Resolved' || item.status === 'Closed'
                      ? 'approved'
                      : item.status === 'In Progress'
                        ? 'pending'
                        : 'rejected';
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
