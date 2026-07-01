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

export default function SquadTrialSelectionPage() {
  const [selectedTeam, setSelectedTeam] = useState('1');

  const teamOptions = [
    { id: '1', name: "University Cricket Team - Men's 2026" },
    { id: '2', name: "University Football Team - Men's 2026" },
  ];

  const trialApplicants = [
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'CS2025001',
      position: 'Opening Batsman',
      skillLevel: 'State/National',
      trialResult: 'Selected',
      squadRole: 'Captain',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'EC2025042',
      position: 'Fast Bowler',
      skillLevel: 'Advanced',
      trialResult: 'Selected',
      squadRole: 'Player',
    },
    {
      id: 3,
      name: 'Mike Ross',
      rollNo: 'ME2025110',
      position: 'Wicket Keeper',
      skillLevel: 'Intermediate',
      trialResult: 'Rejected',
      squadRole: '-',
    },
  ];

  return (
    <FormPage
      title="Squad & Trial Selection"
      description="Manage trial applicants, record trial results, and finalize the squad."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Team Management' },
        { label: 'Squad Selection' },
      ]}
    >
      <FormCard title="Select Team">
        <div className="w-full md:w-1/2">
          <DropDownList
            label="Team"
            data={teamOptions}
            textField="name"
            valueField="id"
            placeholder="Select a Team"
            value={selectedTeam}
            onChange={(val: any) => setSelectedTeam(val)}
          />
        </div>
      </FormCard>

      <FormCard title="Trial Applicants & Squad Selection" className="mt-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing registered applicants who opted for Cricket trials.
          </div>
          <Button
            label="Finalize Squad"
            variant="primary"
            icon="check_circle"
            onClick={() =>
              ToastService.success('Squad finalized successfully!')
            }
          />
        </div>

        <GridPanel
          data={trialApplicants}
          columns={[
            { field: 'name', header: 'Student Name' },
            { field: 'rollNo', header: 'Roll No.' },
            { field: 'position', header: 'Preferred Position' },
            { field: 'skillLevel', header: 'Skill Level' },
            {
              header: 'Trial Result',
              cell: (item: any) => (
                <select
                  className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={item.trialResult}
                >
                  <option value="Pending">Pending</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ),
            },
            {
              header: 'Squad Role',
              cell: (item: any) => (
                <select
                  className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={item.squadRole}
                  disabled={item.trialResult !== 'Selected'}
                >
                  <option value="-">-</option>
                  <option value="Player">Player</option>
                  <option value="Captain">Captain</option>
                  <option value="Vice-Captain">Vice-Captain</option>
                </select>
              ),
            },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.trialResult === 'Selected'
                      ? 'approved'
                      : item.trialResult === 'Rejected'
                        ? 'rejected'
                        : 'pending'
                  }
                  label={item.trialResult}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
