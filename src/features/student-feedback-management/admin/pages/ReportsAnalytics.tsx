import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { feedbackSessions, studentResponses } from '../../data';
import { feedbackUrls } from '../../urls';

function OverallRatingChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
          {
            label: 'Responses',
            data: [45, 78, 210, 385, 520],
            backgroundColor: [
              '#ef4444cc',
              '#f97316cc',
              '#f59e0bcc',
              '#22c55ecc',
              '#16a34acc',
            ],
            borderColor: [
              '#ef4444',
              '#f97316',
              '#f59e0b',
              '#22c55e',
              '#16a34a',
            ],
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function DepartmentComparisonChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Teaching',
          'Infrastructure',
          'Curriculum',
          'Facilities',
          'Library',
          'Discipline',
        ],
        datasets: [
          {
            label: 'CSE',
            data: [4.2, 3.8, 4.0, 3.5, 4.5, 4.1],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            pointBackgroundColor: '#3b82f6',
          },
          {
            label: 'ECE',
            data: [4.0, 4.2, 3.9, 3.8, 4.0, 3.9],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.1)',
            pointBackgroundColor: '#22c55e',
          },
          {
            label: 'ME',
            data: [3.8, 3.5, 4.1, 4.0, 3.7, 4.0],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.1)',
            pointBackgroundColor: '#f59e0b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function QuestionScoreChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
        datasets: [
          {
            label: 'Avg Score',
            data: [4.2, 3.8, 4.5, 3.2, 4.0, 4.3, 3.6, 4.1],
            backgroundColor: '#8b5cf6cc',
            borderColor: '#8b5cf6',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function ResponseDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'],
        datasets: [
          {
            data: [35, 28, 22, 10, 5],
            backgroundColor: [
              '#16a34a',
              '#22c55e',
              '#f59e0b',
              '#f97316',
              '#ef4444',
            ],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

const TAB_ITEMS = [
  {
    title: 'Summary',
    content: <SummaryTab />,
  },
  {
    title: 'Faculty',
    content: <FacultyTab />,
  },
  {
    title: 'Department',
    content: <SummaryTab />,
  },
  {
    title: 'Question Analysis',
    content: <QuestionAnalysisTab />,
  },
];

export default function ReportsAnalytics() {
  return (
    <FormPage
      title="Reports & Analytics"
      description="Analyze feedback data across sessions, faculty, departments, and questions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Reports' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <Button label="PDF" icon="file" variant="outlined" size="small" />
          <Button label="Excel" icon="table" variant="outlined" size="small" />
          <Button label="CSV" icon="download" variant="outlined" size="small" />
        </div>
      }
    >
      <Tabs tabs={TAB_ITEMS} />
    </FormPage>
  );
}

function SummaryTab() {
  const totalResponses = studentResponses.filter(
    r => r.completionStatus === 'Completed'
  ).length;
  const totalAssigned = feedbackSessions.reduce((s, x) => s + x.targetCount, 0);
  const completionRate =
    totalAssigned > 0 ? Math.round((totalResponses / totalAssigned) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard title="Summary">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Overall Rating</p>
            <p className="text-2xl font-bold text-blue-700">4.1 / 5</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 font-medium">
              Completion Rate
            </p>
            <p className="text-2xl font-bold text-green-700">
              {completionRate}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-medium">
              Total Responses
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {totalResponses}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 font-medium">
              Total Sessions
            </p>
            <p className="text-2xl font-bold text-orange-700">
              {feedbackSessions.length}
            </p>
          </div>
        </div>
      </FormCard>
      <FormCard title="Rating Distribution">
        <div className="h-64">
          <OverallRatingChart />
        </div>
      </FormCard>
    </div>
  );
}

function FacultyTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard title="Faculty Ratings">
        <div className="space-y-4">
          {[
            {
              name: 'Dr. Sharma',
              rating: 4.2,
              strength: 'Teaching',
              weak: 'Course Materials',
            },
            {
              name: 'Prof. Verma',
              rating: 3.8,
              strength: 'Interaction',
              weak: 'Pacing',
            },
            {
              name: 'Dr. Patel',
              rating: 4.5,
              strength: 'Subject Knowledge',
              weak: 'Assignment Feedback',
            },
          ].map(f => (
            <div
              key={f.name}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{f.name}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>
                    <span className="text-green-600">Strength:</span>{' '}
                    {f.strength}
                  </span>
                  <span>
                    <span className="text-red-500">Weak:</span> {f.weak}
                  </span>
                </div>
              </div>
              <span
                className={`text-lg font-bold ${f.rating >= 4 ? 'text-green-600' : f.rating >= 3.5 ? 'text-yellow-600' : 'text-red-600'}`}
              >
                {f.rating}
              </span>
            </div>
          ))}
        </div>
      </FormCard>
      <FormCard title="Department Comparison">
        <div className="h-64">
          <DepartmentComparisonChart />
        </div>
      </FormCard>
    </div>
  );
}

function QuestionAnalysisTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <FormCard title="Average Score per Question">
        <div className="h-64">
          <QuestionScoreChart />
        </div>
      </FormCard>
      <FormCard title="Response Distribution">
        <div className="h-64">
          <ResponseDistributionChart />
        </div>
      </FormCard>
    </div>
  );
}
