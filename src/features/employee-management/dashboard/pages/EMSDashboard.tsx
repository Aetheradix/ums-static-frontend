import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const HEADCOUNT = [
  { dept: 'Computer Science', sanctioned: 9, recruited: 6 },
  { dept: 'Physics', sanctioned: 5, recruited: 5 },
  { dept: 'Mathematics', sanctioned: 2, recruited: 3 },
  { dept: 'Chemistry', sanctioned: 4, recruited: 3 },
  { dept: 'Administration', sanctioned: 1, recruited: 1 },
  { dept: 'Economics', sanctioned: 6, recruited: 4 },
];

const LEAVE_TREND = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  casual: [12, 19, 7, 14, 10, 16],
  earned: [5, 8, 11, 6, 9, 13],
  medical: [3, 5, 2, 8, 4, 6],
};

const CAREER_EVENTS = [
  { type: 'Promotion', count: 8, color: '#10b981' },
  { type: 'Transfer', count: 14, color: '#f59e0b' },
  { type: 'Deputation', count: 5, color: '#3b82f6' },
  { type: 'Retirement', count: 3, color: '#ef4444' },
  { type: 'Reinstatement', count: 2, color: '#8b5cf6' },
];

const APPRAISAL_STATUS = {
  submitted: 42,
  underReview: 18,
  completed: 31,
  overdue: 7,
};

const ONBOARDING_MONTHLY = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  quick: [3, 5, 2, 6, 4, 7],
  full: [1, 2, 3, 1, 3, 2],
};

// ─── Derived KPIs ─────────────────────────────────────────────────────────────
const totalRecruited = HEADCOUNT.reduce((a, c) => a + c.recruited, 0);
const totalSanctioned = HEADCOUNT.reduce((a, c) => a + c.sanctioned, 0);
const totalVacant = HEADCOUNT.reduce(
  (a, c) => a + Math.max(0, c.sanctioned - c.recruited),
  0
);
const overAllocated = HEADCOUNT.filter(d => d.recruited > d.sanctioned).length;

// ─── Chart Configs ────────────────────────────────────────────────────────────

const headcountChartData = {
  labels: HEADCOUNT.map(d => d.dept),
  datasets: [
    {
      label: 'Recruited',
      backgroundColor: 'rgba(59, 130, 246, 0.85)',
      borderRadius: 6,
      data: HEADCOUNT.map(d => d.recruited),
    },
    {
      label: 'Sanctioned',
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      borderRadius: 6,
      data: HEADCOUNT.map(d => d.sanctioned),
    },
  ],
};

const headcountChartOptions = {
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: {
      stacked: false,
      grid: { display: false },
      ticks: { color: '#94a3b8' },
    },
    y: {
      stacked: false,
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

const leaveTrendChartData = {
  labels: LEAVE_TREND.months,
  datasets: [
    {
      label: 'Casual Leave',
      data: LEAVE_TREND.casual,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
    {
      label: 'Earned Leave',
      data: LEAVE_TREND.earned,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
    {
      label: 'Medical Leave',
      data: LEAVE_TREND.medical,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
  ],
};

const leaveTrendOptions = {
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

const careerEventsChartData = {
  labels: CAREER_EVENTS.map(e => e.type),
  datasets: [
    {
      data: CAREER_EVENTS.map(e => e.count),
      backgroundColor: CAREER_EVENTS.map(e => e.color),
      hoverOffset: 8,
      borderWidth: 0,
    },
  ],
};

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#94a3b8',
        padding: 16,
        font: { size: 12 },
        boxWidth: 12,
        borderRadius: 4,
      },
    },
  },
  cutout: '65%',
  maintainAspectRatio: false,
};

const appraisalChartData = {
  labels: ['Submitted', 'Under Review', 'Completed', 'Overdue'],
  datasets: [
    {
      data: [
        APPRAISAL_STATUS.submitted,
        APPRAISAL_STATUS.underReview,
        APPRAISAL_STATUS.completed,
        APPRAISAL_STATUS.overdue,
      ],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      hoverOffset: 8,
      borderWidth: 0,
    },
  ],
};

const onboardingChartData = {
  labels: ONBOARDING_MONTHLY.months,
  datasets: [
    {
      label: 'Quick Onboarding',
      data: ONBOARDING_MONTHLY.quick,
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      borderRadius: 6,
    },
    {
      label: 'Full Onboarding',
      data: ONBOARDING_MONTHLY.full,
      backgroundColor: 'rgba(99, 102, 241, 0.85)',
      borderRadius: 6,
    },
  ],
};

const onboardingChartOptions = {
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
  },
  scales: {
    x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function EMSDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="EMS Dashboard"
      description="HR command center — real-time overview of workforce health, leave activity, career events, and onboarding pipeline."
      breadcrumbs={[
        { label: 'Employee Management', to: '/employee-management' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Row 1: KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value={totalRecruited}
            icon="groups"
            colorScheme="blue"
            subtitle={`of ${totalSanctioned} sanctioned posts`}
          />
          <StatCard
            title="Open Vacancies"
            value={totalVacant}
            icon="person_off"
            colorScheme="orange"
            subtitle="Unfilled sanctioned positions"
          />
          <StatCard
            title="Pending Approvals"
            value={APPRAISAL_STATUS.underReview + 3}
            icon="pending_actions"
            colorScheme="red"
            subtitle="Leaves + appraisals awaiting"
          />
          <StatCard
            title="Over-Allocated"
            value={overAllocated}
            icon="warning"
            colorScheme="red"
            subtitle="Departments exceeding limit"
          />
        </div>

        {/* ── Row 2: Headcount Bar + Leave Trend Line ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Departmental Headcount"
            icon="bar_chart"
            headerAction={
              <Button
                label="Manage Headcount"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() =>
                  navigate('/employee-management/headcount-control')
                }
              />
            }
          >
            <div className="w-full h-72">
              <Chart
                type="bar"
                data={headcountChartData}
                options={headcountChartOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard
            title="Leave Applications — 6 Month Trend"
            icon="show_chart"
            headerAction={
              <Button
                label="Leave Approval"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() => navigate('/employee-management/leave-approval')}
              />
            }
          >
            <div className="w-full h-72">
              <Chart
                type="line"
                data={leaveTrendChartData}
                options={leaveTrendOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Row 3: Career Events Doughnut + Appraisal Doughnut ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard
            title="Career Events by Type"
            icon="pie_chart"
            headerAction={
              <Button
                label="View Events"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() =>
                  navigate('/employee-management/career-event-tracking')
                }
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="doughnut"
                data={careerEventsChartData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard
            title="Appraisal Status Breakdown"
            icon="donut_large"
            headerAction={
              <Button
                label="Manage Appraisals"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() => navigate('/employee-management/appraisals')}
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="doughnut"
                data={appraisalChartData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Row 4: Onboarding Pipeline ── */}
        <FormCard
          title="Onboarding Activity — Monthly Pipeline"
          icon="person_add"
          headerAction={
            <Button
              label="Manage Employees"
              variant="text"
              size="small"
              icon="arrow-right"
              onClick={() => navigate('/employee-management/manage-employees')}
            />
          }
        >
          <div className="w-full h-64">
            <Chart
              type="bar"
              data={onboardingChartData}
              options={onboardingChartOptions}
              className="w-full h-full"
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
