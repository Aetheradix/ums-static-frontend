import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';

// ─── Mock employee-specific data ─────────────────────────────────────────────

const EMPLOYEE = {
  name: 'Dr. John A. Doe',
  code: 'EMP-001',
  post: 'Professor',
  department: 'Computer Science',
  joiningDate: '2018-06-01',
  profileCompletion: 82,
};

const LEAVE_SUMMARY = [
  { type: 'Casual Leave', entitled: 12, used: 4, balance: 8 },
  { type: 'Medical Leave', entitled: 10, used: 4, balance: 6 },
  { type: 'Earned Leave', entitled: 30, used: 10, balance: 20 },
];

const LEAVE_HISTORY_MONTHLY = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  days: [2, 0, 4, 1, 5, 2],
};

const APPRAISAL_RATINGS = {
  periods: ['2022–23', '2023–24', '2024–25'],
  scores: [3.8, 4.2, 4.5],
};

const RESEARCH_BY_TYPE = [
  { type: 'Journal', count: 8 },
  { type: 'Conference', count: 5 },
  { type: 'Book Chapter', count: 3 },
  { type: 'Patent', count: 1 },
];

const TRAVEL_STATUS = { approved: 4, pending: 1, rejected: 0 };

// ─── Derived KPIs ─────────────────────────────────────────────────────────────
const totalLeaveBalance = LEAVE_SUMMARY.reduce((a, c) => a + c.balance, 0);
const totalLeaveUsed = LEAVE_SUMMARY.reduce((a, c) => a + c.used, 0);
const totalResearch = RESEARCH_BY_TYPE.reduce((a, c) => a + c.count, 0);
const totalTravel =
  TRAVEL_STATUS.approved + TRAVEL_STATUS.pending + TRAVEL_STATUS.rejected;

// ─── Chart Configs ────────────────────────────────────────────────────────────

const leaveBalanceChartData = {
  labels: LEAVE_SUMMARY.map(l => l.type),
  datasets: [
    {
      label: 'Used',
      data: LEAVE_SUMMARY.map(l => l.used),
      backgroundColor: 'rgba(245, 158, 11, 0.85)',
      borderRadius: 6,
    },
    {
      label: 'Balance',
      data: LEAVE_SUMMARY.map(l => l.balance),
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      borderRadius: 6,
    },
  ],
};

const leaveBalanceOptions = {
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index' as const, intersect: false },
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

const leaveHistoryChartData = {
  labels: LEAVE_HISTORY_MONTHLY.months,
  datasets: [
    {
      label: 'Days Taken',
      data: LEAVE_HISTORY_MONTHLY.days,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#f59e0b',
    },
  ],
};

const leaveHistoryOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8', stepSize: 1 },
    },
  },
  maintainAspectRatio: false,
};

const appraisalChartData = {
  labels: APPRAISAL_RATINGS.periods,
  datasets: [
    {
      label: 'SAR Rating (out of 5)',
      data: APPRAISAL_RATINGS.scores,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
  ],
};

const appraisalChartOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      min: 0,
      max: 5,
      ticks: { stepSize: 1, color: '#94a3b8' },
      grid: { color: 'rgba(148,163,184,0.1)' },
    },
  },
  maintainAspectRatio: false,
};

const researchChartData = {
  labels: RESEARCH_BY_TYPE.map(r => r.type),
  datasets: [
    {
      data: RESEARCH_BY_TYPE.map(r => r.count),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      hoverOffset: 8,
      borderWidth: 0,
    },
  ],
};

const researchChartOptions = {
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

const travelChartData = {
  labels: ['Approved', 'Pending', 'Rejected'],
  datasets: [
    {
      data: [
        TRAVEL_STATUS.approved,
        TRAVEL_STATUS.pending,
        TRAVEL_STATUS.rejected,
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      hoverOffset: 8,
      borderWidth: 0,
    },
  ],
};

const travelChartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#94a3b8',
        padding: 16,
        font: { size: 12 },
        boxWidth: 12,
      },
    },
  },
  cutout: '60%',
  maintainAspectRatio: false,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ESSDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title={`Welcome, ${EMPLOYEE.name}`}
      description={`${EMPLOYEE.post} · ${EMPLOYEE.department} · Joined ${EMPLOYEE.joiningDate} · Profile ${EMPLOYEE.profileCompletion}% complete`}
      breadcrumbs={[
        {
          label: 'Employee Self-Service',
          to: '/home/sub-menu/employee-self-service',
        },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Row 1: KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Leave Balance"
            value={totalLeaveBalance}
            icon="calendar_month"
            colorScheme="green"
            subtitle={`${totalLeaveUsed} days taken this year`}
          />
          <StatCard
            title="Appraisal Score"
            value={`${APPRAISAL_RATINGS.scores[APPRAISAL_RATINGS.scores.length - 1]}/5`}
            icon="star"
            colorScheme="blue"
            subtitle="Latest SAR rating"
          />
          <StatCard
            title="Publications"
            value={totalResearch}
            icon="menu_book"
            colorScheme="orange"
            subtitle="Total research outputs"
          />
          <StatCard
            title="Travel Requests"
            value={totalTravel}
            icon="flight"
            colorScheme="red"
            subtitle={`${TRAVEL_STATUS.approved} approved`}
          />
        </div>

        {/* ── Row 2: Leave Balance (stacked bar) + Leave Trend (line) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Leave Balance by Type"
            icon="bar_chart"
            headerAction={
              <Button
                label="Apply Leave"
                variant="text"
                size="small"
                icon="plus"
                onClick={() => navigate('/employee-management/leave')}
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="bar"
                data={leaveBalanceChartData}
                options={leaveBalanceOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard
            title="My Leave History — This Year"
            icon="show_chart"
            headerAction={
              <Button
                label="View All"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() => navigate('/employee-management/leave')}
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="line"
                data={leaveHistoryChartData}
                options={leaveHistoryOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Row 3: Appraisal Rating Trend (line) + Research Breakdown (doughnut) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Appraisal Performance Trend"
            icon="insights"
            headerAction={
              <Button
                label="Submit SAR"
                variant="text"
                size="small"
                icon="plus"
                onClick={() =>
                  navigate('/employee-management/personal-appraisal')
                }
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="line"
                data={appraisalChartData}
                options={appraisalChartOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard
            title="Research Publications by Category"
            icon="donut_large"
            headerAction={
              <Button
                label="Add Publication"
                variant="text"
                size="small"
                icon="plus"
                onClick={() => navigate('/employee-management/research')}
              />
            }
          >
            <div className="w-full h-64">
              <Chart
                type="doughnut"
                data={researchChartData}
                options={researchChartOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Row 4: Travel Requests Doughnut + Quick Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard
            title="Travel Requests Status"
            icon="pie_chart"
            headerAction={
              <Button
                label="Apply Travel"
                variant="text"
                size="small"
                icon="plus"
                onClick={() => navigate('/employee-management/travel')}
              />
            }
          >
            <div className="w-full h-56">
              <Chart
                type="doughnut"
                data={travelChartData}
                options={travelChartOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard title="Quick Actions" icon="bolt">
            <div className="flex flex-col gap-3 pt-2">
              <Button
                label="Apply for Leave"
                icon="calendar_month"
                variant="outlined"
                onClick={() => navigate('/employee-management/leave')}
              />
              <Button
                label="Submit Self-Appraisal (SAR)"
                icon="rate_review"
                variant="outlined"
                onClick={() =>
                  navigate('/employee-management/personal-appraisal')
                }
              />
              <Button
                label="Add Research Publication"
                icon="menu_book"
                variant="outlined"
                onClick={() => navigate('/employee-management/research')}
              />
              <Button
                label="Apply for Travel Sanction"
                icon="flight"
                variant="outlined"
                onClick={() => navigate('/employee-management/travel')}
              />
              <Button
                label="View My Profile"
                icon="account_box"
                variant="outlined"
                onClick={() => navigate('/settings/employee-profile/1')}
              />
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
