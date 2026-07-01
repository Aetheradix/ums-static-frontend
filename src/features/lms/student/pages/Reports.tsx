import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { learningUrls } from '../../urls';

type ReportTab = 'learning' | 'assessment' | 'progress';

const TABS = [
  { label: 'My Learning Report', key: 'learning' },
  { label: 'My Assessment Report', key: 'assessment' },
  { label: 'My Progress Report', key: 'progress' },
];

export default function StudentReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('learning');

  const mockExport = (type: string) => {
    ToastService.success(`Exporting ${type}... (simulated)`);
  };

  const ExportBar = ({ label }: { label: string }) => (
    <div className="flex gap-3 mb-4">
      <Button
        label="Export PDF"
        icon="file-pdf"
        variant="outlined"
        size="small"
        onClick={() => mockExport(`${label} PDF`)}
      />
      <Button
        label="Export Excel"
        icon="file-excel"
        variant="outlined"
        size="small"
        onClick={() => mockExport(`${label} Excel`)}
      />
      <Button
        label="Print"
        icon="print"
        variant="outlined"
        size="small"
        onClick={() => mockExport(`${label} Print`)}
      />
    </div>
  );

  const Table = ({
    headers,
    rows,
  }: {
    headers: string[];
    rows: string[][];
  }) => (
    <div className="overflow-x-auto w-full">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th
                key={h}
                style={{
                  fontSize: '0.688rem',
                  fontWeight: 600,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  textAlign: 'left',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#374151',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'learning':
        return (
          <div>
            <ExportBar label="My Learning Report" />
            <Table
              headers={['Course Name', 'Curriculum Progress', 'Modules Finished', 'Total Duration', 'Status']}
              rows={[
                ['B.Tech Computer Science', '78%', '4 / 6', '45 Hours', 'Active'],
                ['Bachelor of Computer Applications', '100%', '6 / 6', '36 Hours', 'Completed'],
                ['Master of Business Administration', '15%', '1 / 8', '40 Hours', 'Active'],
              ]}
            />
          </div>
        );
      case 'assessment':
        return (
          <div>
            <ExportBar label="My Assessment Report" />
            <Table
              headers={['Assessment Title', 'Assessment Type', 'Score / Grade', 'Submitted Date', 'Status']}
              rows={[
                ['Quiz 1: C++ Syntax & Basics', 'Quiz', '9/10', '2026-06-25', 'Graded'],
                ['Assignment 1: Logic Building', 'Assignment', '92/100', '2026-06-28', 'Graded'],
                ['Assignment 2: Pointer Arithmetic', 'Assignment', 'Pending Evaluation', '2026-07-01', 'Submitted'],
              ]}
            />
          </div>
        );
      case 'progress':
        return (
          <div>
            <ExportBar label="My Learning Activity Report" />
            <Table
              headers={['Activity Metric', 'Time Expended', 'Percentage Contribution', 'Last Updated']}
              rows={[
                ['Video Lectures Consumed', '22.0 Hours', '52%', '10 mins ago'],
                ['Attempting Quizzes & Exams', '12.0 Hours', '28%', '1 hour ago'],
                ['Reading Slides & PDF notes', '8.5 Hours', '20%', 'Yesterday'],
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormPage
      title="My Learning Reports"
      description="View and download reports regarding your courses, quizzes, assignments and activity metrics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'Reports' },
      ]}
    >
      <Tabs
        tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
        activeIndex={TABS.findIndex(t => t.key === activeTab)}
        onTabChange={e => setActiveTab(TABS[e.index].key as ReportTab)}
      />
      <div className="mt-4">
        <FormCard>{renderContent()}</FormCard>
      </div>
    </FormPage>
  );
}
