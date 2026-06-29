import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import './Dashboard.css';

const studentAppStats = {
  applicationStatus: 'Pending Review',
  feeStatus: 'Paid',
  documentsVerified: 4,
  totalDocuments: 5,
};

function ApplicationProgressDoughnut() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed Stages', 'Remaining Stages'],
        datasets: [
          {
            data: [3, 1],
            backgroundColor: ['#3b82f6', '#e5e7eb'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function EntranceExamBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Math', 'Physics', 'Chemistry', 'English', 'Aptitude'],
        datasets: [
          {
            label: 'Score Obtained',
            data: [85, 76, 88, 92, 80],
            backgroundColor: '#8b5cf6',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function EligibilityPieChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Matched Criteria', 'Pending/Missing', 'Not Met'],
        datasets: [
          {
            data: [8, 1, 1],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
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
  return <canvas ref={ref} />;
}

export default function StudentDashboard() {
  const docPct = Math.round(
    (studentAppStats.documentsVerified / studentAppStats.totalDocuments) * 100
  );

  return (
    <FormPage
      title="Admissions Student Dashboard"
      description="Track the status of your admission application and next steps."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Portal', to: admissionsUrls.root },
        { label: 'Student Portal', to: admissionsUrls.student.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="admissions-student-stats-grid">
        <StatCard
          title="Application Status"
          value={studentAppStats.applicationStatus}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Currently under review"
        />
        <StatCard
          title="Registration Fee"
          value={studentAppStats.feeStatus}
          icon="check_circle"
          colorScheme="green"
          subtitle="Transaction successful"
        />
        <StatCard
          title="Documents Uploaded"
          value={`${studentAppStats.documentsVerified}/${studentAppStats.totalDocuments}`}
          icon="folder"
          colorScheme="blue"
          subtitle="Awaiting final verification"
        />
      </div>

      <div className="admissions-student-split-row">
        <FormCard title="Application Progress" className="progress-card">
          <div className="progress-doughnut-container">
            <ApplicationProgressDoughnut />
            <div className="progress-doughnut-center">
              <span className="progress-doughnut-value">75%</span>
              <span className="progress-doughnut-label">Complete</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Next Step: Wait for document verification approval.
          </p>
        </FormCard>

        <FormCard title="Entrance Exam Mock Scores" className="chart-card">
          <div className="student-chart-container">
            <EntranceExamBarChart />
          </div>
        </FormCard>

        <FormCard title="Eligibility Match" className="chart-card">
          <div className="student-chart-container">
            <EligibilityPieChart />
          </div>
        </FormCard>

        <FormCard title="Profile Completeness" className="completeness-card">
          <div className="completeness-progress-container">
            <div className="completeness-progress-header">
              <span className="completeness-progress-label">
                Documents Verified
              </span>
              <span className="completeness-progress-value">{docPct}%</span>
            </div>
            <div className="completeness-progress-track">
              <div
                className="completeness-progress-fill"
                style={{ width: `${docPct}%` }}
              ></div>
            </div>
            <p className="completeness-progress-subtitle">
              {studentAppStats.totalDocuments -
                studentAppStats.documentsVerified}{' '}
              document(s) pending verification.
            </p>
          </div>
        </FormCard>
      </div>

      <div className="admissions-student-bottom-row">
        <FormCard title="Action Items Feed" icon="fact_check">
          <ul className="action-items-list">
            <li className="action-item pending">
              <i className="pi pi-exclamation-circle text-orange-500" />
              <div className="action-details">
                <strong>Upload Migration Certificate</strong>
                <p>Required before final enrollment generation.</p>
              </div>
              <button className="action-btn">Upload</button>
            </li>
            <li className="action-item completed">
              <i className="pi pi-check-circle text-green-500" />
              <div className="action-details">
                <strong>Pay Semester 1 Fee</strong>
                <p>Payment successful. Receipt generated.</p>
              </div>
              <button className="action-btn-disabled" disabled>
                Paid
              </button>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Important Dates" icon="event">
          <ul className="important-dates-list">
            <li>
              <div className="date-badge">
                <span className="month">Oct</span>
                <span className="day">15</span>
              </div>
              <div className="date-info">
                <strong>Personal Interview</strong>
                <p>Online Zoom link will be sent via email.</p>
              </div>
            </li>
            <li>
              <div className="date-badge">
                <span className="month">Oct</span>
                <span className="day">20</span>
              </div>
              <div className="date-info">
                <strong>Document Verification</strong>
                <p>Physical verification at campus building block A.</p>
              </div>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Quick Links" icon="link">
          <div className="mt-2 space-y-3">
            <a
              href={admissionsUrls.student.apply}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <i className="pi pi-file-edit text-blue-500" />
                View Application Form
              </div>
              <i className="pi pi-chevron-right text-gray-400 text-xs" />
            </a>
            <a
              href={admissionsUrls.student.feePayment}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <i className="pi pi-wallet text-green-500" />
                Fee Payment Receipts
              </div>
              <i className="pi pi-chevron-right text-gray-400 text-xs" />
            </a>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
