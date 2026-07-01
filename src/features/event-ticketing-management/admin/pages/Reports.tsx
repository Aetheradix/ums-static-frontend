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
  categories,
  eventStatusVariant,
  events as ALL_EVENTS,
  venues,
  type Event,
} from '../../mocks';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

const STATUS_FILTER = [
  { name: 'All Statuses', value: '' },
  { name: 'Draft', value: 'Draft' },
  { name: 'Pending Approval', value: 'Pending Approval' },
  { name: 'Approved', value: 'Approved' },
  { name: 'Published', value: 'Published' },
  { name: 'Ongoing', value: 'Ongoing' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Archived', value: 'Archived' },
];

function CategoryBarChart({ data }: { data: Event[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = categories.map(c => c.name);
    const counts = categories.map(
      cat => data.filter(e => e.categoryId === cat.id).length
    );
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Events',
            data: counts,
            backgroundColor: ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b'],
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

function RegistrationByCategoryChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = categories.map(c => c.name);
    const data = categories.map(cat =>
      ALL_EVENTS.filter(e => e.categoryId === cat.id).reduce(
        (sum, e) => sum + e.registered,
        0
      )
    );
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b'],
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
  roleCrumb = { url: eventUrls.admin.portal, label: 'Event Administrator' },
}: {
  roleCrumb?: { url: string; label: string };
}) {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(
    () =>
      ALL_EVENTS.filter(
        e =>
          (categoryFilter === '' || String(e.categoryId) === categoryFilter) &&
          (venueFilter === '' || String(e.venueId) === venueFilter) &&
          (statusFilter === '' || e.status === statusFilter)
      ),
    [categoryFilter, venueFilter, statusFilter]
  );

  const categoryOptions = [
    { name: 'All Categories', value: '' },
    ...categories.map(c => ({ name: c.name, value: String(c.id) })),
  ];
  const venueOptions = [
    { name: 'All Venues', value: '' },
    ...venues.map(v => ({ name: v.name, value: String(v.id) })),
  ];

  return (
    <FormPage
      title="Event Reports"
      description="Event analytics by status, category and venue, with registration summaries."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: roleCrumb.label, to: roleCrumb.url },
        { label: 'Reports' },
      ]}
    >
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sky-800">
        <i className="pi pi-info-circle mt-0.5" />
        <p className="text-sm">
          Reports reflect the currently registered events. Use the filters below
          to narrow the list by category, venue or status, then export or print
          the resulting register.
        </p>
      </div>

      <FormCard title="Filters" icon="filter">
        <div className="etm-filter-row">
          <DropDownList
            label="Category"
            data={categoryOptions}
            textField="name"
            valueField="value"
            value={categoryFilter}
            onChange={val => setCategoryFilter((val as string) ?? '')}
          />
          <DropDownList
            label="Venue"
            data={venueOptions}
            textField="name"
            valueField="value"
            value={venueFilter}
            onChange={val => setVenueFilter((val as string) ?? '')}
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

      <div className="etm-charts-row">
        <FormCard title="Events by Category (filtered)">
          <div className="etm-chart-box">
            <CategoryBarChart data={filtered} />
          </div>
        </FormCard>
        <FormCard title="Registrations by Category">
          <div className="etm-chart-box">
            <RegistrationByCategoryChart />
          </div>
        </FormCard>
      </div>

      <FormCard title={`Event Register (${filtered.length})`}>
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search within results..."
          exportExcel
          print
          emptyMessage="No events match the selected filters."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'code', header: 'Code', sortable: true },
            { field: 'title', header: 'Title' },
            { field: 'categoryName', header: 'Category' },
            { field: 'venueName', header: 'Venue' },
            { field: 'startDate', header: 'Start Date' },
            {
              header: 'Status',
              cell: (e: Event) => (
                <StatusBadge
                  label={e.status}
                  variant={eventStatusVariant(e.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
