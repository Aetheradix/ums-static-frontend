import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useResultsQuery } from '../queries';
import { ToastService } from 'services';

export default function ResultProcessing() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useResultsQuery(sid);

  const handlePublish = () => {
    ToastService.success('Results published successfully.');
  };

  return (
    <FormPage
      title="Result Processing"
      description={`Manage results for session #${sid}`}
    >
      <FormCard>
        <div className="flex justify-end gap-2 mb-4">
          <Button
            label="Download Report"
            icon="pi-download"
            onClick={() => ToastService.success('Result report downloaded.')}
          />
          <Button
            label="Publish All Results"
            icon="pi-chart-line"
            onClick={handlePublish}
          />
        </div>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search students..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'subjectCode', header: 'Subject Code' },
            { field: 'subjectName', header: 'Subject Name' },
            { field: 'obtainedMarks', header: 'Obtained' },
            { field: 'maxMarks', header: 'Max' },
            { field: 'grade', header: 'Grade' },
            { field: 'gradePoint', header: 'GP' },
            {
              field: 'result',
              header: 'Result',
              cell: (item: Examination.ResultItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {item.result}
                </span>
              ),
            },
            {
              header: 'Download',
              cell: () => (
                <Button
                  icon="pi-download"
                  className="p-button-sm p-button-text"
                  tooltip="Download Result"
                  onClick={() => ToastService.success('Result PDF downloaded.')}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
