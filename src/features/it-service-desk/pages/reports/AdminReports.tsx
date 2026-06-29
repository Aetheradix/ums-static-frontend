import { useMemo } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { KpiCard, PriorityBadge, TicketStatusBadge } from '../../components';
import {
  initialTickets,
  initialAgentWorkloads,
  TicketStatus,
} from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminReports() {
  const tickets = useMemo(() => initialTickets, []);

  const byAgent = useMemo(() => {
    const map: Record<string, number> = {};
    tickets.forEach(t => {
      if (t.assignedAgent && t.assignedAgent !== 'Unassigned') {
        map[t.assignedAgent] = (map[t.assignedAgent] ?? 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const byModule = useMemo(() => {
    const map: Record<string, number> = {};
    tickets.forEach(t => {
      map[t.module] = (map[t.module] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const byPriority = useMemo(() => {
    const map: Record<string, number> = {};
    tickets.forEach(t => {
      map[t.priority] = (map[t.priority] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};
    Object.values(TicketStatus).forEach(s => {
      map[s] = tickets.filter(t => t.status === s).length;
    });
    return Object.entries(map)
      .filter(([_, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  const bySLA = useMemo(() => {
    const violated = tickets.filter(t => t.slaViolated).length;
    const compliant = tickets.length - violated;
    return {
      compliant,
      violated,
      rate:
        tickets.length > 0
          ? Math.round((compliant / tickets.length) * 100)
          : 100,
    };
  }, [tickets]);

  const slaByPriority = useMemo(() => {
    const map: Record<string, { total: number; violated: number }> = {};
    tickets.forEach(t => {
      if (!map[t.priority]) map[t.priority] = { total: 0, violated: 0 };
      map[t.priority].total++;
      if (t.slaViolated) map[t.priority].violated++;
    });
    return Object.entries(map);
  }, [tickets]);

  const byDepartment = useMemo(() => {
    const map: Record<string, number> = {};
    tickets.forEach(t => {
      map[t.requesterDepartment] = (map[t.requesterDepartment] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

  function SimpleList({ data }: { data: [string, number][] }) {
    return (
      <div className="space-y-2">
        {data.map(([label, count]) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-800">{label}</span>
            <span className="text-lg font-bold text-indigo-600">{count}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <FormPage
      title="Reports & Analytics"
      description="Comprehensive ticket analytics by agent, module, priority, SLA, and more."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Reports' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Compliant"
          value={bySLA.compliant}
          color="green"
          icon="verified"
        />
        <KpiCard
          label="Violated"
          value={bySLA.violated}
          color="red"
          icon="warning"
        />
        <KpiCard
          label="Compliance Rate"
          value={`${bySLA.rate}%`}
          color="blue"
          icon="analytics"
        />
        <KpiCard
          label="Total Tickets"
          value={tickets.length}
          color="purple"
          icon="confirmation_number"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FormCard title="Tickets by Agent">
          <SimpleList data={byAgent} />
        </FormCard>
        <FormCard title="Tickets by Module">
          <SimpleList data={byModule} />
        </FormCard>
        <FormCard title="Tickets by Priority">
          <SimpleList data={byPriority} />
        </FormCard>
        <FormCard title="Tickets by Status">
          <div className="space-y-2">
            {byStatus.map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
              >
                <TicketStatusBadge status={status} />
                <span className="text-lg font-bold text-indigo-600">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FormCard title="SLA Compliance">
          <GridPanel
            data={slaByPriority}
            columns={[
              {
                header: 'Priority',
                cell: (item: [string, { total: number; violated: number }]) => (
                  <PriorityBadge priority={item[0]} />
                ),
              },
              {
                header: 'Total',
                cell: (item: [string, { total: number }]) => (
                  <span className="font-medium">{item[1].total}</span>
                ),
              },
              {
                header: 'Violated',
                cell: (item: [string, { violated: number }]) => (
                  <span className="text-red-600 font-medium">
                    {item[1].violated}
                  </span>
                ),
              },
              {
                header: 'Compliance %',
                cell: (item: [string, { total: number; violated: number }]) => {
                  const pct =
                    item[1].total > 0
                      ? Math.round(
                          ((item[1].total - item[1].violated) / item[1].total) *
                            100
                        )
                      : 100;
                  return (
                    <span
                      className={`font-medium ${pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-amber-600' : 'text-red-600'}`}
                    >
                      {pct}%
                    </span>
                  );
                },
              },
            ]}
          />
        </FormCard>
        <FormCard title="Agent Workload Summary">
          <GridPanel
            data={initialAgentWorkloads}
            columns={[
              {
                field: 'agentName',
                header: 'Agent',
                cell: (w: any) => (
                  <span className="font-medium">{w.agentName}</span>
                ),
              },
              { field: 'assigned', header: 'Assigned' },
              { field: 'inProgress', header: 'In Progress' },
              { field: 'resolved', header: 'Resolved' },
              {
                header: 'Overdue',
                cell: (w: any) => (
                  <span
                    className={w.overdue > 0 ? 'text-red-600 font-bold' : ''}
                  >
                    {w.overdue}
                  </span>
                ),
              },
            ]}
          />
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormCard title="Tickets by Department">
          <SimpleList data={byDepartment} />
        </FormCard>
      </div>
    </FormPage>
  );
}
