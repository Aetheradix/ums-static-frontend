import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ProgressBar } from 'primereact/progressbar';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface MeritCandidate {
  rank: number;
  applicationNo: string;
  name: string;
  category: string;
  score: number;
  status: 'Selected' | 'Waitlisted' | 'Not Selected';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
];

export default function MeritListGeneration() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [meritList, setMeritList] = useState<MeritCandidate[]>([]);
  const [published, setPublished] = useState(false);

  const handleGenerate = () => {
    if (!selectedProgram) return;

    setGenerating(true);
    setMeritList([]);
    setPublished(false);

    // Simulate generation delay
    setTimeout(() => {
      const generated: MeritCandidate[] = [
        {
          rank: 1,
          applicationNo: 'APP-2024-045',
          name: 'Alice Smith',
          category: 'GEN',
          score: 98.5,
          status: 'Selected',
        },
        {
          rank: 2,
          applicationNo: 'APP-2024-102',
          name: 'Bob Johnson',
          category: 'OBC',
          score: 95.2,
          status: 'Selected',
        },
        {
          rank: 3,
          applicationNo: 'APP-2024-012',
          name: 'Charlie Brown',
          category: 'SC',
          score: 89.4,
          status: 'Selected',
        },
        {
          rank: 4,
          applicationNo: 'APP-2024-078',
          name: 'David Lee',
          category: 'GEN',
          score: 88.1,
          status: 'Waitlisted',
        },
        {
          rank: 5,
          applicationNo: 'APP-2024-099',
          name: 'Eva Green',
          category: 'GEN',
          score: 85.0,
          status: 'Not Selected',
        },
      ];
      setMeritList(generated);
      setGenerating(false);
      ToastService.success('Merit list generated successfully.');
    }, 2000);
  };

  const handlePublish = () => {
    setPublished(true);
    ToastService.success(
      'Merit list published successfully. Notifications sent.'
    );
  };

  const statusTemplate = (rowData: MeritCandidate) => {
    const severity =
      rowData.status === 'Selected'
        ? 'success'
        : rowData.status === 'Waitlisted'
          ? 'warning'
          : 'danger';
    return <StatusBadge label={rowData.status} variant={severity} />;
  };

  return (
    <FormPage
      title="Merit List Generation"
      description="Generate and publish merit lists based on applicant scores and seat matrix quotas."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Cell', to: admissionsUrls.cell.dashboard },
        { label: 'Merit List Generation' },
      ]}
    >
      <div className="flex flex-col gap-6 p-fluid">
        <FormCard>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="flex flex-col gap-2 flex-1 w-full">
              <DropDownList
                label="Select Program *"
                value={selectedProgram || ''}
                data={mockPrograms}
                textField="label"
                valueField="value"
                onChange={v => {
                  setSelectedProgram(v as string);
                  setMeritList([]);
                  setPublished(false);
                }}
                defaultOptionText="Select a Program"
              />
            </div>
            <Button
              label={generating ? 'Generating...' : 'Generate Merit List'}
              icon={generating ? 'pi pi-spin pi-spinner' : 'pi pi-cog'}
              onClick={handleGenerate}
              disabled={!selectedProgram || generating}
              className="w-full md:w-auto"
            />
          </div>

          {generating && (
            <div className="mt-8 text-center bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-gray-600 mb-4 font-medium">
                Calculating scores, applying quotas, and ranking candidates...
              </p>
              <ProgressBar
                mode="indeterminate"
                style={{ height: '6px' }}
              ></ProgressBar>
            </div>
          )}
        </FormCard>

        {meritList.length > 0 && !generating && (
          <FormCard>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 pb-2 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 m-0">
                  Generated Merit List:{' '}
                  <span className="text-blue-600">{selectedProgram}</span>
                </h3>
                <p className="text-sm text-gray-500 m-0 mt-1">
                  Total processed: {meritList.length} candidates
                </p>
              </div>
              <div>
                {published ? (
                  <StatusBadge
                    label="Published Live"
                    variant="success"
                    className="px-3 py-2 text-sm shadow-sm"
                  />
                ) : (
                  <Button
                    label="Publish Merit List"
                    icon="pi pi-globe"
                    variant="primary"
                    onClick={handlePublish}
                  />
                )}
              </div>
            </div>

            <GridPanel
              data={meritList}
              pagination={false}
              columns={[
                { field: 'rank', header: 'Rank', sortable: true },
                { field: 'applicationNo', header: 'App No.', sortable: true },
                { field: 'name', header: 'Candidate Name', sortable: true },
                {
                  field: 'category',
                  header: 'Category',
                  cell: row => (
                    <StatusBadge label={row.category} variant="info" />
                  ),
                  sortable: true,
                },
                { field: 'score', header: 'Score (%)', sortable: true },
                {
                  field: 'status',
                  header: 'Allocation Status',
                  cell: statusTemplate,
                  sortable: true,
                },
              ]}
            />

            {!published && (
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm flex items-start shadow-sm">
                <i className="pi pi-info-circle text-lg mr-3 mt-0.5 text-yellow-600"></i>
                <p className="m-0 leading-relaxed">
                  <strong>Note:</strong> This list is currently a draft.
                  Applicants will not be notified until you click "Publish Merit
                  List". Once published, selected candidates will receive
                  admission offers automatically.
                </p>
              </div>
            )}
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
