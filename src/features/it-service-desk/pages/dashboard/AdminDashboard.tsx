import Chart from 'chart.js/auto';
import { useEffect, useMemo, useRef } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { KpiCard, PriorityBadge, TicketStatusBadge } from '../../components';
import {
  initialAgentWorkloads,
  initialTickets,
  TicketStatus,
} from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminDashboard() {
  const tickets = useMemo(() => initialTickets, []);

  const open = tickets.filter(
    t =>
      t.status === TicketStatus.OPEN ||
      t.status === TicketStatus.ASSIGNED ||
      t.status === TicketStatus.ACCEPTED
  ).length;
  const assigned = tickets.filter(
    t => t.status === TicketStatus.ASSIGNED
  ).length;
  const pending = tickets.filter(
    t =>
      t.status === TicketStatus.PENDING ||
      t.status === TicketStatus.WAITING_FOR_USER
  ).length;
  const closed = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
  const reopened = tickets.filter(
    t => t.status === TicketStatus.REOPENED
  ).length;
  const total = tickets.length;

  return (
    <FormPage
      title="Service Desk Admin Dashboard"
      description="Complete enterprise service desk KPIs, SLA compliance, and agent performance monitoring."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Admin Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Tickets"
          value={total}
          color="blue"
          icon="confirmation_number"
        />
        <KpiCard label="Open" value={open} color="indigo" icon="pending" />
        <KpiCard
          label="Assigned"
          value={assigned}
          color="purple"
          icon="assignment_ind"
        />
        <KpiCard
          label="Pending"
          value={pending}
          color="orange"
          icon="hourglass_empty"
        />
        <KpiCard
          label="Closed"
          value={closed}
          color="green"
          icon="check_circle"
        />
        <KpiCard
          label="Reopened"
          value={reopened}
          color="amber"
          icon="refresh"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FormCard title="Ticket Trend (This Week)">
          <TicketTrendChart />
        </FormCard>
        <FormCard title="Tickets by Module">
          <TicketsByModuleChart />
        </FormCard>
        <FormCard title="Agent Workload">
          <AgentWorkloadChart />
        </FormCard>
        <FormCard title="SLA Compliance">
          <SlaComplianceChart />
        </FormCard>
      </div>

      <FormCard title="Recent Tickets">
        <GridPanel
          data={tickets.slice(0, 10)}
          columns={[
            { field: 'code', header: 'Code', width: '140px' },
            {
              field: 'title',
              header: 'Title',
              cell: (t: any) => (
                <span className="text-sm font-medium">{t.title}</span>
              ),
            },
            {
              header: 'Status',
              width: '130px',
              cell: (t: any) => <TicketStatusBadge status={t.status} />,
            },
            {
              header: 'Priority',
              width: '100px',
              cell: (t: any) => <PriorityBadge priority={t.priority} />,
            },
            { field: 'requesterName', header: 'Requester', width: '140px' },
            { field: 'assignedAgent', header: 'Agent', width: '140px' },
            { field: 'slaDeadline', header: 'SLA Deadline', width: '160px' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}

function TicketTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Tickets Created',
            data: [12, 19, 15, 22, 18, 8, 5],
            borderColor: '#6366f1',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div style={{ height: '220px' }}>
      <canvas ref={ref} />
    </div>
  );
}

function TicketsByModuleChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['Infrastructure', 'Network', 'Software', 'Hardware'],
        datasets: [
          {
            data: [8, 7, 10, 5],
            backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div style={{ height: '220px' }}>
      <canvas ref={ref} />
    </div>
  );
}

function AgentWorkloadChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: initialAgentWorkloads.map(w => w.agentName.split(' ').pop()),
        datasets: [
          {
            label: 'Assigned',
            data: initialAgentWorkloads.map(w => w.assigned),
            backgroundColor: '#6366f1',
          },
          {
            label: 'In Progress',
            data: initialAgentWorkloads.map(w => w.inProgress),
            backgroundColor: '#f59e0b',
          },
          {
            label: 'Resolved',
            data: initialAgentWorkloads.map(w => w.resolved),
            backgroundColor: '#22c55e',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div style={{ height: '220px' }}>
      <canvas ref={ref} />
    </div>
  );
}

function SlaComplianceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
          {
            label: 'Compliant',
            data: [3, 5, 8, 2],
            backgroundColor: '#22c55e',
          },
          {
            label: 'Breached',
            data: [2, 1, 0, 0],
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div style={{ height: '220px' }}>
      <canvas ref={ref} />
    </div>
  );
}
