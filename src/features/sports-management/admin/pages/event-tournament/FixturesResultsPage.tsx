import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function FixturesResultsPage() {
  const [selectedEvent, setSelectedEvent] = useState('1');

  const eventOptions = [
    { id: '1', name: 'Inter-University Cricket Cup 2026' },
    { id: '2', name: 'Annual Sports Meet 2026' },
  ];

  const fixturesData = [
    {
      id: 1,
      match: 'Semi-Final 1',
      participants: 'University Team vs City College',
      date: '2026-10-15',
      venue: 'Main Cricket Ground',
      result: '-',
      status: 'Scheduled',
    },
    {
      id: 2,
      match: 'Quarter-Final 2',
      participants: 'University Team vs Engineering College',
      date: '2026-10-12',
      venue: 'Main Cricket Ground',
      result: 'University Team Won by 4 wickets',
      status: 'Completed',
    },
    {
      id: 3,
      match: 'Practice Match',
      participants: 'Team A vs Team B',
      date: '2026-10-10',
      venue: 'Practice Nets',
      result: 'Draw',
      status: 'Ongoing',
    },
  ];

  return (
    <FormPage
      title="Fixtures & Results"
      description="Manage match schedules, venues, and record final results."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Event Management' },
        { label: 'Fixtures & Results' },
      ]}
    >
      <FormCard title="Select Event">
        <div className="w-full md:w-1/2 flex items-end gap-4">
          <div className="flex-1">
            <DropDownList
              label="Event / Tournament"
              data={eventOptions}
              textField="name"
              valueField="id"
              placeholder="Select Event"
              value={selectedEvent}
              onChange={(val: any) => setSelectedEvent(val)}
            />
          </div>
          <Button
            label="Add New Match"
            variant="outlined"
            icon="add"
            onClick={() => ToastService.success('New match added!')}
          />
        </div>
      </FormCard>

      <FormCard title="Match Schedule & Results" className="mt-6">
        <GridPanel
          data={fixturesData}
          columns={[
            { field: 'match', header: 'Match Name/Stage' },
            { field: 'participants', header: 'Participants / Teams' },
            { field: 'date', header: 'Date & Time' },
            { field: 'venue', header: 'Venue' },
            {
              header: 'Result',
              cell: (item: any) =>
                item.status === 'Completed' ? (
                  <span className="font-medium text-green-700">
                    {item.result}
                  </span>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter result..."
                    className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                ),
            },
            {
              header: 'Match Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Completed'
                      ? 'approved'
                      : item.status === 'Ongoing'
                        ? 'neutral'
                        : 'pending'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
