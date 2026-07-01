import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';

const teamReportData = [
  {
    id: 1,
    teamName: "University Cricket Team - Men's 2026",
    sport: 'Cricket',
    academicYear: '2025-26',
    coach: 'Ravi Shastri',
    captain: 'John Doe',
    status: 'Finalized',
  },
  {
    id: 2,
    teamName: "University Football Team - Men's 2026",
    sport: 'Football',
    academicYear: '2025-26',
    coach: 'Igor Stimac',
    captain: '-',
    status: 'Trials Open',
  },
];

const squadReportData = [
  {
    id: 1,
    studentName: 'John Doe',
    rollNo: 'CS-2022-001',
    teamName: 'Cricket Team',
    position: 'Batsman',
    skillLevel: 'Advanced',
    trialResult: 'Selected',
    squadRole: 'Captain',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    rollNo: 'ME-2023-014',
    teamName: 'Football Team',
    position: 'Forward',
    skillLevel: 'Intermediate',
    trialResult: 'Pending',
    squadRole: 'Pending',
  },
];

const eventReportData = [
  {
    id: 1,
    event: 'Inter-University Cricket Cup 2026',
    type: 'Inter-University',
    startDate: '2026-10-15',
    endDate: '2026-10-25',
    status: 'Upcoming',
  },
  {
    id: 2,
    event: 'Annual Sports Meet 2025',
    type: 'Intra-College',
    startDate: '2025-11-20',
    endDate: '2025-11-25',
    status: 'Completed',
  },
];

const fixtureReportData = [
  {
    id: 1,
    matchName: 'Finals',
    participants: 'Team A vs Team B',
    dateTime: '2026-10-25 10:00 AM',
    venue: 'Main Ground',
    result: 'Team A Won',
    status: 'Completed',
  },
  {
    id: 2,
    matchName: 'Semi Finals',
    participants: 'Team C vs Team D',
    dateTime: '2026-10-23 02:00 PM',
    venue: 'Main Ground',
    result: '-',
    status: 'Scheduled',
  },
];

const bookingReportData = [
  {
    id: 1,
    applicant: 'John Doe',
    facility: 'Main Cricket Ground',
    date: '2026-07-05',
    timeSlot: '6-8 AM',
    status: 'Approved',
  },
  {
    id: 2,
    applicant: 'Jane Smith',
    facility: 'Indoor Badminton Court 1',
    date: '2026-07-06',
    timeSlot: '4-6 PM',
    status: 'Pending',
  },
];

const equipmentReportData = [
  {
    id: 1,
    student: 'John Doe',
    equipment: 'Cricket Bat',
    qty: 1,
    issueDate: '2026-06-25',
    dueDate: '2026-07-25',
    status: 'Issued',
  },
  {
    id: 2,
    student: 'Mike Ross',
    equipment: 'Badminton Racket',
    qty: 1,
    issueDate: '2026-06-15',
    dueDate: '2026-06-20',
    status: 'Overdue',
  },
];

const achievementReportData = [
  {
    id: 1,
    recipient: 'John Doe',
    event: 'Annual Sports Meet 2025',
    award: 'Gold Medal',
    rank: '1st Place',
    points: 50,
  },
  {
    id: 2,
    recipient: 'University Cricket Team',
    event: 'Inter-University Cup 2026',
    award: 'Silver Medal',
    rank: '2nd Place',
    points: 30,
  },
];

export default function AdminReportsPage() {
  const [filterSport, setFilterSport] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>();

  const sportOptions = [
    { id: '', name: 'All Sports' },
    { id: 'Cricket', name: 'Cricket' },
    { id: 'Football', name: 'Football' },
    { id: 'Badminton', name: 'Badminton' },
    { id: 'Athletics', name: 'Athletics' },
  ];

  const handleExport = () => {
    ToastService.success('Report exported successfully!');
  };

  const handleSearch = () => {
    ToastService.success('Report updated!');
  };

  const tabItems = [
    {
      title: 'Teams',
      content: (
        <GridPanel
          data={teamReportData}
          columns={[
            { field: 'teamName', header: 'Team Name' },
            { field: 'sport', header: 'Sport' },
            { field: 'academicYear', header: 'Year/Season' },
            { field: 'coach', header: 'Coach' },
            { field: 'captain', header: 'Captain' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Finalized'
                      ? 'approved'
                      : item.status === 'Trials Open'
                        ? 'pending'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Squad Selections',
      content: (
        <GridPanel
          data={squadReportData}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNo', header: 'Roll No.' },
            { field: 'teamName', header: 'Team' },
            { field: 'position', header: 'Position' },
            { field: 'trialResult', header: 'Trial Result' },
            { field: 'squadRole', header: 'Squad Role' },
          ]}
        />
      ),
    },
    {
      title: 'Events',
      content: (
        <GridPanel
          data={eventReportData}
          columns={[
            { field: 'event', header: 'Event Name' },
            { field: 'type', header: 'Type' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'Upcoming'
                        ? 'pending'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Fixtures & Results',
      content: (
        <GridPanel
          data={fixtureReportData}
          columns={[
            { field: 'matchName', header: 'Match Stage' },
            { field: 'participants', header: 'Participants' },
            { field: 'dateTime', header: 'Date & Time' },
            { field: 'venue', header: 'Venue' },
            { field: 'result', header: 'Result' },
            { field: 'status', header: 'Status' },
          ]}
        />
      ),
    },
    {
      title: 'Facility Booking',
      content: (
        <GridPanel
          data={bookingReportData}
          columns={[
            { field: 'applicant', header: 'Applicant' },
            { field: 'facility', header: 'Facility' },
            { field: 'date', header: 'Date' },
            { field: 'timeSlot', header: 'Time Slot' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Pending'
                        ? 'pending'
                        : 'rejected'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Equipment Issue',
      content: (
        <GridPanel
          data={equipmentReportData}
          columns={[
            { field: 'student', header: 'Student' },
            { field: 'equipment', header: 'Equipment' },
            { field: 'qty', header: 'Qty' },
            { field: 'issueDate', header: 'Issue Date' },
            { field: 'dueDate', header: 'Due Date' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Returned'
                      ? 'approved'
                      : item.status === 'Overdue'
                        ? 'rejected'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Achievements',
      content: (
        <GridPanel
          data={achievementReportData}
          columns={[
            { field: 'recipient', header: 'Recipient' },
            { field: 'event', header: 'Event' },
            { field: 'award', header: 'Award' },
            { field: 'rank', header: 'Rank' },
            {
              header: 'Points',
              cell: (item: any) => (
                <span className="font-semibold text-green-600">
                  +{item.points}
                </span>
              ),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Admin Sports Reports"
      description="Comprehensive reports on all sports management transactions."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Admin Portal', to: '/sports-management/admin' },
        { label: 'Reports' },
      ]}
    >
      <FormCard>
        <FormGrid columns={3}>
          <DropDownList
            label="Filter by Sport"
            data={sportOptions}
            textField="name"
            valueField="id"
            placeholder="All Sports"
            value={filterSport}
            onChange={(val: any) => setFilterSport(val)}
          />
          <DatePicker
            label="From Date"
            value={filterDate}
            onChange={(val: any) => setFilterDate(val)}
          />
          <div className="flex gap-3 items-end mb-4">
            <Button
              label="Search"
              variant="primary"
              icon="search"
              onClick={handleSearch}
            />
            <Button
              label="Export Report"
              variant="outlined"
              icon="download"
              onClick={handleExport}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Detailed Reports" className="mt-6">
        <Tabs tabs={tabItems} />
      </FormCard>
    </FormPage>
  );
}
