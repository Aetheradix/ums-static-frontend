import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if it is a Teacher login or Student login
  const isTeacher = location.pathname.includes('/teacher');
  const userRole = isTeacher ? 'Teacher' : 'Student';
  const myEnroll = isTeacher ? 'EMP2014022' : 'CS2021001';
  const myName = isTeacher ? 'Dr. Vivek Kumar' : 'Arjun Sharma';
  const myDept = isTeacher ? 'Chemistry Department' : 'SCSIT Department';

  const myComplaints = complaints.filter(c => c.enrollmentNo === myEnroll);

  const total = myComplaints.length;
  const pending = myComplaints.filter(
    c => c.status === 'Submitted' || c.status === 'Department Review'
  ).length;
  const underReview = myComplaints.filter(
    c => c.status === 'HoD Review' || c.status === 'Committee Review'
  ).length;
  const resolved = myComplaints.filter(
    c => c.status === 'Registrar Decision'
  ).length;
  const closed = myComplaints.filter(c => c.status === 'Closed').length;

  const categoryRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let catChart: Chart | null = null;
    let statusChart: Chart | null = null;

    if (categoryRef.current) {
      const ctx = categoryRef.current.getContext('2d');
      if (ctx) {
        catChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [
              'Academic',
              'Financial',
              'Hostel',
              'Exam',
              'Administrative',
            ],
            datasets: [
              {
                data: [35, 25, 20, 10, 10],
                backgroundColor: [
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#0891b2',
                  '#6b7280',
                ],
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
                labels: { boxWidth: 10, font: { size: 10 } },
              },
            },
          },
        });
      }
    }

    if (statusRef.current) {
      const ctx = statusRef.current.getContext('2d');
      if (ctx) {
        statusChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Pending', 'Under Review', 'Resolved', 'Closed'],
            datasets: [
              {
                label: 'My Grievances by Status',
                data: [pending, underReview, resolved, closed],
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } },
          },
        });
      }
    }

    return () => {
      if (catChart) catChart.destroy();
      if (statusChart) statusChart.destroy();
    };
  }, [pending, underReview, resolved, closed]);

  const currentUrls = isTeacher ? grvUrls.teacher : grvUrls.student;

  return (
    <FormPage
      title={`${userRole} Grievance Dashboard`}
      description={`Welcome, ${myName} (${myEnroll}) · ${myDept}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: `${userRole} Portal`, to: currentUrls.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-alert info">
        <i className="pi pi-info-circle"></i>
        <div>
          <span className="font-bold">Government eOffice Protocol:</span>{' '}
          Grievance movement in this module is recorded on active digital
          notesheets. Notifications are auto-dispatched to your registered
          mobile and email at each review node.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total Grievances"
          value={total}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All filed tickets"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon="hourglass"
          colorScheme="orange"
          subtitle="Awaiting initiation"
        />
        <StatCard
          title="Under Review"
          value={underReview}
          icon="cached"
          colorScheme="teal"
          subtitle="Notesheet movement active"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon="check_circle"
          colorScheme="green"
          subtitle="Decision issued"
        />
        <StatCard
          title="Closed"
          value={closed}
          icon="archive"
          colorScheme="indigo"
          subtitle="Complaint settled"
        />
      </div>

      {/* Row with Charts */}
      <div className="grv-charts-row">
        <FormCard title="University Grievance Shares by Category">
          <div style={{ height: 220 }}>
            <canvas ref={categoryRef} />
          </div>
        </FormCard>
        <FormCard title="Grievance Settlement Status Distribution">
          <div style={{ height: 220 }}>
            <canvas ref={statusRef} />
          </div>
        </FormCard>
      </div>

      {/* Quick Action buttons */}
      <FormCard title="Quick Actions">
        <div className="grv-quick-actions">
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(currentUrls.raise)}
          >
            <i className="pi pi-plus-circle text-red-600"></i>
            <span>Raise Grievance</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(currentUrls.track)}
          >
            <i className="pi pi-map text-purple-600"></i>
            <span>Track Status</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(currentUrls.track)}
          >
            <i className="pi pi-list text-green-600"></i>
            <span>My Grievances</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(currentUrls.history)}
          >
            <i className="pi pi-history text-blue-600"></i>
            <span>Grievance History</span>
          </button>
        </div>
      </FormCard>
    </FormPage>
  );
}
