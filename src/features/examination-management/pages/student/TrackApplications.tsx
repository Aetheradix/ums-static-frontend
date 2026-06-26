import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { useStudentTrackApplicationsQuery } from '../../queries';

const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-800',
  Verified: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Generated: 'bg-purple-100 text-purple-800',
  'Under Review': 'bg-orange-100 text-orange-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function TrackApplications() {
  const { data, isLoading } = useStudentTrackApplicationsQuery();

  return (
    <FormPage
      title="Track My Applications"
      description="Track the status of all your examination-related applications"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by reference..."
          columns={[
            {
              header: 'Application Type',
              cell: (item: Examination.TrackApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Exam Form' ? 'bg-blue-100 text-blue-800' : item.type === 'Revaluation' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}
                >
                  {item.type}
                </span>
              ),
            },
            { field: 'referenceNo', header: 'Reference No.' },
            { field: 'sessionName', header: 'Session' },
            { field: 'appliedDate', header: 'Applied Date' },
            { field: 'lastUpdated', header: 'Last Updated' },
            {
              header: 'Status',
              cell: (item: Examination.TrackApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
