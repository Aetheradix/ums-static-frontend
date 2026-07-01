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

const sportsRegistrationData = [
  {
    id: 1,
    sport: 'Football',
    experience: 'Intermediate',
    position: 'Forward',
    trialDate: '2026-07-20',
    status: 'Registered',
  },
  {
    id: 2,
    sport: 'Cricket',
    experience: 'Advanced',
    position: 'Batsman',
    trialDate: '2026-07-25',
    status: 'Registered',
  },
];

const eventRegistrationData = [
  {
    id: 1,
    event: 'Inter-University Cricket Cup 2026',
    type: 'Team',
    participant: "University Cricket Team - Men's 2026",
    date: '2026-06-20',
    status: 'Approved',
  },
  {
    id: 2,
    event: 'Annual Sports Meet 2026',
    type: 'Individual',
    participant: 'John Doe',
    date: '2026-06-25',
    status: 'Pending',
  },
];

const facilityBookingData = [
  {
    id: 1,
    facility: 'Main Cricket Ground',
    date: '2026-07-05',
    timeSlot: '6-8 AM',
    status: 'Approved',
  },
  {
    id: 2,
    facility: 'Indoor Badminton Court 1',
    date: '2026-07-06',
    timeSlot: '4-6 PM',
    status: 'Pending',
  },
  {
    id: 3,
    facility: 'Practice Nets',
    date: '2026-06-28',
    timeSlot: '6-8 AM',
    status: 'Approved',
  },
];

export default function StudentReportsPage() {
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
      title: 'Sports Registration',
      content: (
        <GridPanel
          data={sportsRegistrationData}
          columns={[
            { field: 'sport', header: 'Sport Name' },
            { field: 'experience', header: 'Experience Level' },
            { field: 'position', header: 'Position' },
            { field: 'trialDate', header: 'Preferred Trial Date' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Registered' ? 'approved' : 'pending'
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
      title: 'Event Registration',
      content: (
        <GridPanel
          data={eventRegistrationData}
          columns={[
            { field: 'event', header: 'Event Name' },
            { field: 'type', header: 'Registration Type' },
            { field: 'participant', header: 'Participant/Team Name' },
            { field: 'date', header: 'Registration Date' },
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
      title: 'Facility Booking',
      content: (
        <GridPanel
          data={facilityBookingData}
          columns={[
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
  ];

  return (
    <FormPage
      title="My Sports Report"
      description="Detailed records of your sports registrations, event participations, and facility bookings."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Student Portal', to: '/sports-management/student' },
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
