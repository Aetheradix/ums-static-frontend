import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { learningUrls } from '../../urls';

type ReportTab = 'course' | 'performance' | 'quiz' | 'assignment';

const TABS = [
  { label: 'My Course Report', key: 'course' },
  { label: 'Student Performance', key: 'performance' },
  { label: 'Quiz Report', key: 'quiz' },
  { label: 'Assignment Report', key: 'assignment' },
];

export default function TeacherReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('course');

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
      case 'course':
        return (
          <div>
            <ExportBar label="My Course Report" />
            <Table
              headers={['Course Name', 'Semester', 'Enrolled Students', 'Average Progress', 'Passing Rate']}
              rows={[
                ['B.Tech Computer Science', '5th Sem', '240', '78%', '92%'],
                ['Bachelor of Computer Applications', '3rd Sem', '120', '100%', '98%'],
                ['Master of Business Administration', '1st Sem', '85', '15%', 'N/A'],
              ]}
            />
          </div>
        );
      case 'performance':
        return (
          <div>
            <ExportBar label="Student Performance Report" />
            <Table
              headers={['Student Name', 'Average Grade', 'Quizzes Completed', 'Assignments Graded', 'Status']}
              rows={[
                ['Arjun Sharma', 'A+ (94%)', '2 / 3', '2 / 2', 'Exemplary'],
                ['Neha Gupta', 'B (76%)', '2 / 3', '1 / 2', 'On Track'],
                ['Rohan Shah', 'A (89%)', '3 / 3', '2 / 2', 'Exemplary'],
              ]}
            />
          </div>
        );
      case 'quiz':
        return (
          <div>
            <ExportBar label="Quiz Performance Report" />
            <Table
              headers={['Quiz Name', 'Course Name', 'Attempts', 'Class Average', 'Highest Score']}
              rows={[
                ['Quiz 1: C++ Syntax & Basics', 'B.Tech Computer Science', '238', '8.2/10', '10/10'],
                ['Quiz 2: DBMS Joins & Subqueries', 'B.Tech Computer Science', '230', '11.5/15', '15/15'],
              ]}
            />
          </div>
        );
      case 'assignment':
        return (
          <div>
            <ExportBar label="Assignment Grading Report" />
            <Table
              headers={['Assignment Title', 'Due Date', 'Submitted Ratio', 'Grading Pending', 'Average Score']}
              rows={[
                ['Assignment 1: Logic Building & Flowcharts', '2026-07-10', '236 / 240', '0', '88.5 / 100'],
                ['Assignment 2: Pointer Arithmetic & Functions', '2026-07-20', '180 / 240', '32', 'N/A'],
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
      title="LMS Faculty Reports"
      description="Access class performance analytics, grade distributions, and resource lists."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
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
