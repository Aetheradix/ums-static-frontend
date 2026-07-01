import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { learningUrls } from '../../urls';

type ReportTab =
  | 'course'
  | 'enrollment'
  | 'faculty'
  | 'assessment'
  | 'certificate'
  | 'completion'
  | 'progress';

const TABS = [
  { label: 'Course Report', key: 'course' },
  { label: 'Enrollment Report', key: 'enrollment' },
  { label: 'Faculty Report', key: 'faculty' },
  { label: 'Assessment Report', key: 'assessment' },
  { label: 'Certificate Report', key: 'certificate' },
  { label: 'Course Completion', key: 'completion' },
  { label: 'Learning Progress', key: 'progress' },
];

export default function Reports() {
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
            <ExportBar label="Course Report" />
            <Table
              headers={[
                'Course Code',
                'Course Name',
                'Category',
                'Duration',
                'Modules',
                'Status',
              ]}
              rows={[
                [
                  'BCA',
                  'Bachelor of Computer Applications',
                  'Technical',
                  '3 Years',
                  '6',
                  'Active',
                ],
                [
                  'MBA',
                  'Master of Business Administration',
                  'Management',
                  '2 Years',
                  '8',
                  'Active',
                ],
                [
                  'BTECH-CS',
                  'B.Tech Computer Science',
                  'Technical',
                  '4 Years',
                  '12',
                  'Active',
                ],
                [
                  'BCOM',
                  'Bachelor of Commerce',
                  'Commerce',
                  '3 Years',
                  '5',
                  'Active',
                ],
                [
                  'MCA',
                  'Master of Computer Applications',
                  'Technical',
                  '2 Years',
                  '9',
                  'Active',
                ],
              ]}
            />
          </div>
        );
      case 'enrollment':
        return (
          <div>
            <ExportBar label="Student Enrollment Report" />
            <Table
              headers={[
                'Enrollment No',
                'Student Name',
                'Course',
                'Enrollment Date',
                'Status',
              ]}
              rows={[
                [
                  'CS2021001',
                  'Arjun Sharma',
                  'B.Tech Computer Science',
                  '2023-07-15',
                  'Active',
                ],
                [
                  'CS2021002',
                  'Neha Gupta',
                  'B.Tech Computer Science',
                  '2023-07-16',
                  'Active',
                ],
                [
                  'CS2021003',
                  'Rahul Patel',
                  'Bachelor of Computer Applications',
                  '2024-07-20',
                  'Active',
                ],
                [
                  'MG2022011',
                  'Simran Kaur',
                  'Master of Business Administration',
                  '2025-08-01',
                  'Active',
                ],
              ]}
            />
          </div>
        );
      case 'faculty':
        return (
          <div>
            <ExportBar label="Faculty Assignment Report" />
            <Table
              headers={[
                'Faculty Name',
                'Department',
                'Assigned Courses',
                'Email',
                'Status',
              ]}
              rows={[
                [
                  'Dr. Amit Kumar',
                  'Computer Science',
                  '2',
                  'amit.kumar@university.edu',
                  'Active',
                ],
                [
                  'Prof. Priya Rawat',
                  'Information Technology',
                  '1',
                  'priya.rawat@university.edu',
                  'Active',
                ],
                [
                  'Ravi Verma',
                  'Business Administration',
                  '1',
                  'ravi.verma@university.edu',
                  'Active',
                ],
              ]}
            />
          </div>
        );
      case 'assessment':
        return (
          <div>
            <ExportBar label="Assessment Activity Report" />
            <Table
              headers={[
                'Assessment Title',
                'Type',
                'Course',
                'Questions',
                'Passing Score',
                'Due Date',
              ]}
              rows={[
                [
                  'Quiz 1: C++ Syntax',
                  'Quiz',
                  'B.Tech Computer Science',
                  '10',
                  '70%',
                  '2026-07-15',
                ],
                [
                  'Quiz 2: DBMS Joins',
                  'Quiz',
                  'B.Tech Computer Science',
                  '15',
                  '66%',
                  '2026-07-18',
                ],
                [
                  'Assignment 1: Logic Building',
                  'Assignment',
                  'B.Tech Computer Science',
                  '5 Problems',
                  '60%',
                  '2026-07-10',
                ],
              ]}
            />
          </div>
        );
      case 'certificate':
        return (
          <div>
            <ExportBar label="Certificates Report" />
            <Table
              headers={[
                'Credential ID',
                'Recipient',
                'Course Name',
                'Issue Date',
                'Verified By',
              ]}
              rows={[
                [
                  'LMS-CS-2026-9921',
                  'Arjun Sharma',
                  'Advanced Programming in C++',
                  '2026-05-12',
                  'Dr. Amit Kumar',
                ],
                [
                  'LMS-DB-2026-4402',
                  'Arjun Sharma',
                  'Database Systems & SQL',
                  '2026-06-18',
                  'Prof. Priya Rawat',
                ],
              ]}
            />
          </div>
        );
      case 'completion':
        return (
          <div>
            <ExportBar label="Course Completion Report" />
            <Table
              headers={[
                'Student Name',
                'Course Name',
                'Completion Date',
                'Grade Obtained',
                'Certificate Status',
              ]}
              rows={[
                [
                  'Arjun Sharma',
                  'Bachelor of Computer Applications',
                  '2026-06-10',
                  'A+',
                  'Generated',
                ],
                [
                  'Amit Singh',
                  'Bachelor of Computer Applications',
                  '2026-06-11',
                  'A',
                  'Generated',
                ],
                [
                  'Ravi Sen',
                  'Master of Business Administration',
                  '2026-06-15',
                  'A+',
                  'Generated',
                ],
              ]}
            />
          </div>
        );
      case 'progress':
        return (
          <div>
            <ExportBar label="Learning Progress Report" />
            <Table
              headers={[
                'Student Name',
                'Course Name',
                'Progress',
                'Modules Completed',
                'Last Active',
              ]}
              rows={[
                [
                  'Arjun Sharma',
                  'B.Tech Computer Science',
                  '78%',
                  '4 / 6',
                  'Today',
                ],
                [
                  'Neha Gupta',
                  'B.Tech Computer Science',
                  '45%',
                  '2 / 6',
                  'Yesterday',
                ],
                [
                  'Rahul Patel',
                  'Bachelor of Computer Applications',
                  '100%',
                  '6 / 6',
                  '2 days ago',
                ],
                [
                  'Simran Kaur',
                  'Master of Business Administration',
                  '15%',
                  '1 / 8',
                  '3 days ago',
                ],
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
      title="LMS Admin Reports"
      description="View and export reports related to courses, enrollment, assessments and achievements."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Admin Portal', to: learningUrls.admin.portal },
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
