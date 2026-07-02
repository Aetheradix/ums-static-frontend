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
  caseStatusVariant,
  caseTypes,
  courts,
  cases as ALL_CASES,
  payments as ALL_PAYMENTS,
  type LegalCase,
} from '../../mocks';
import { legalUrls } from '../../urls';
import '../../LegalCase.css';

const STATUS_FILTER = [
  { name: 'All Statuses', value: '' },
  { name: 'Pending', value: 'Pending' },
  { name: 'In-favour', value: 'In-favour' },
  { name: 'Against', value: 'Against' },
  { name: 'Disposed', value: 'Disposed' },
];

function StatusBarChart({ data }: { data: LegalCase[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = ['Pending', 'In-favour', 'Against', 'Disposed'];
    const counts = labels.map(l => data.filter(c => c.status === l).length);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cases',
            data: counts,
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#94a3b8'],
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

function PaymentStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = ['Logged', 'Verified', 'Paid'];
    const counts = labels.map(
      l => ALL_PAYMENTS.filter(p => p.status === l).length
    );
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#f59e0b', '#0ea5e9', '#10b981'],
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
  roleCrumb = { url: legalUrls.admin.portal, label: 'Case Administrator' },
}: {
  roleCrumb?: { url: string; label: string };
}) {
  const [courtFilter, setCourtFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(
    () =>
      ALL_CASES.filter(
        c =>
          (courtFilter === '' || String(c.courtId) === courtFilter) &&
          (typeFilter === '' || String(c.caseTypeId) === typeFilter) &&
          (statusFilter === '' || c.status === statusFilter)
      ),
    [courtFilter, typeFilter, statusFilter]
  );

  const courtOptions = [
    { name: 'All Courts', value: '' },
    ...courts.map(c => ({ name: c.name, value: String(c.id) })),
  ];
  const typeOptions = [
    { name: 'All Types', value: '' },
    ...caseTypes.map(t => ({ name: t.name, value: String(t.id) })),
  ];

  return (
    <FormPage
      title="Legal Reports"
      description="Case analytics by status, court and type, with advocate payment summaries."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: roleCrumb.label, to: roleCrumb.url },
        { label: 'Reports' },
      ]}
    >
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sky-800">
        <i className="pi pi-info-circle mt-0.5" />
        <p className="text-sm">
          Reports reflect the currently registered cases. Use the filters below
          to narrow the register by court, case type or status, then export or
          print the resulting list.
        </p>
      </div>

      <FormCard title="Filters" icon="filter">
        <div className="lcm-filter-row">
          <DropDownList
            label="Court"
            data={courtOptions}
            textField="name"
            valueField="value"
            value={courtFilter}
            onChange={val => setCourtFilter((val as string) ?? '')}
          />
          <DropDownList
            label="Case Type"
            data={typeOptions}
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

      <div className="lcm-charts-row">
        <FormCard title="Cases by Status (filtered)">
          <div className="lcm-chart-box">
            <StatusBarChart data={filtered} />
          </div>
        </FormCard>
        <FormCard title="Advocate Payments by Status">
          <div className="lcm-chart-box">
            <PaymentStatusChart />
          </div>
        </FormCard>
      </div>

      <FormCard title={`Case Register (${filtered.length})`}>
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search within results..."
          exportExcel
          print
          emptyMessage="No cases match the selected filters."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'caseNumber', header: 'Case No.', sortable: true },
            { field: 'title', header: 'Title' },
            { field: 'courtName', header: 'Court' },
            { field: 'caseTypeName', header: 'Type' },
            { field: 'filingDate', header: 'Filed On' },
            {
              header: 'Status',
              cell: (c: LegalCase) => (
                <StatusBadge
                  label={c.status}
                  variant={caseStatusVariant(c.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
