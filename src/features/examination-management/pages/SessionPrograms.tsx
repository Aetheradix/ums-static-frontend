import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { useSessionProgramsQuery } from '../queries';

export default function SessionPrograms() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useSessionProgramsQuery(sid);

  return (
    <FormPage
      title="Session Programs"
      description={`Programs mapped to examination session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search programs..."
          columns={[
            { field: 'programName', header: 'Program' },
            { field: 'termNo', header: 'Term' },
            { field: 'termType', header: 'Term Type' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            { field: 'lateFeeDate', header: 'Late Fee Date' },
            { field: 'adminLastDate', header: 'Admin Last Date' },
            {
              header: 'Feedback',
              cell: (item: Examination.SessionProgramItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.feedbackRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.feedbackRequired ? 'Required' : 'Not Required'}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: Examination.SessionProgramItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
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
