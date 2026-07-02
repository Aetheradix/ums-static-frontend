import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  clashes as ALL_CLASHES,
  statusVariant,
  type Clash,
  type ClashSeverity,
  type ClashType,
} from '../../mocks';
import { timetableUrls } from '../../urls';
import '../../Timetable.css';

const SEVERITY_FILTER = [
  { name: 'All Severities', value: '' },
  { name: 'Critical', value: 'Critical' },
  { name: 'High', value: 'High' },
  { name: 'Medium', value: 'Medium' },
  { name: 'Low', value: 'Low' },
];

const TYPE_FILTER = [
  { name: 'All Types', value: '' },
  { name: 'Faculty', value: 'Faculty' },
  { name: 'Room', value: 'Room' },
  { name: 'Section', value: 'Section' },
  { name: 'Equipment', value: 'Equipment' },
];

const STATUS_FILTER = [
  { name: 'All Statuses', value: '' },
  { name: 'Detected', value: 'Detected' },
  { name: 'Under Review', value: 'Under Review' },
  { name: 'Resolved', value: 'Resolved' },
];

function SeverityChart({ data }: { data: Clash[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels: ClashSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
    const counts = labels.map(l => data.filter(c => c.severity === l).length);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Clashes',
            data: counts,
            backgroundColor: ['#ef4444', '#f59e0b', '#94a3b8', '#0ea5e9'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      },
    });
    return () => chart.destroy();
  }, [data]);
  return <canvas ref={ref} />;
}

function TypeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels: ClashType[] = ['Faculty', 'Room', 'Section', 'Equipment'];
    const counts = labels.map(
      l => ALL_CLASHES.filter(c => c.type === l).length
    );
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#6366f1', '#0ea5e9', '#f43f5e', '#22c55e'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function Reports({
  roleCrumb = { url: timetableUrls.admin.portal, label: 'Timetable Admin' },
}: {
  roleCrumb?: { url: string; label: string };
}) {
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(
    () =>
      ALL_CLASHES.filter(
        c =>
          (severityFilter === '' || c.severity === severityFilter) &&
          (typeFilter === '' || c.type === typeFilter) &&
          (statusFilter === '' || c.status === statusFilter)
      ),
    [severityFilter, typeFilter, statusFilter]
  );

  return (
    <FormPage
      title="Timetable Reports"
      description="Clash analytics by severity and type, with a filterable clash register."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: roleCrumb.label, to: roleCrumb.url },
        { label: 'Reports' },
      ]}
    >
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sky-800">
        <i className="pi pi-info-circle mt-0.5" />
        <p className="text-sm">
          Reports reflect the currently detected scheduling clashes. Use the
          filters below to narrow the register by severity, type or status, then
          export or print the resulting list.
        </p>
      </div>

      <FormCard title="Filters" icon="filter">
        <div className="ttm-filter-row">
          <DropDownList
            label="Severity"
            data={SEVERITY_FILTER}
            textField="name"
            valueField="value"
            value={severityFilter}
            onChange={val => setSeverityFilter((val as string) ?? '')}
          />
          <DropDownList
            label="Type"
            data={TYPE_FILTER}
            textField="name"
            valueField="value"
            value={typeFilter}
            onChange={val => setTypeFilter((val as string) ?? '')}
          />
          <DropDownList
            label="Status"
            data={STATUS_FILTER}
            textField="name"
            valueField="value"
            value={statusFilter}
            onChange={val => setStatusFilter((val as string) ?? '')}
          />
        </div>
      </FormCard>

      <div className="ttm-charts-row">
        <FormCard title="Clashes by Severity (filtered)">
          <div className="ttm-chart-box">
            <SeverityChart data={filtered} />
          </div>
        </FormCard>
        <FormCard title="Clashes by Type">
          <div className="ttm-chart-box">
            <TypeChart />
          </div>
        </FormCard>
      </div>

      <FormCard title={`Clash Register (${filtered.length})`}>
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search within results..."
          emptyMessage="No clashes match the selected filters."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'code', header: 'Clash', sortable: true },
            { field: 'type', header: 'Type' },
            { field: 'description', header: 'Description' },
            { field: 'day', header: 'Day' },
            {
              header: 'Severity',
              cell: (c: Clash) => (
                <StatusBadge
                  label={c.severity}
                  variant={statusVariant(c.severity)}
                />
              ),
            },
            {
              header: 'Status',
              cell: (c: Clash) => (
                <StatusBadge
                  label={c.status}
                  variant={statusVariant(c.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
