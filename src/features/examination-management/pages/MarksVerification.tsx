import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useMarksEntriesQuery } from '../queries';
import { ToastService } from 'services';

export default function MarksVerification() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useMarksEntriesQuery(sid);

  const submitted = (data ?? []).filter(m => m.status === 'Submitted');

  const handleVerify = () => {
    ToastService.success('Marks entry verified.');
  };

  return (
    <FormPage
      title="Marks Verification"
      description={`Verify submitted marks entries for session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={submitted}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search students..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'subjectCode', header: 'Subject Code' },
            { field: 'subjectName', header: 'Subject Name' },
            { field: 'theoryMarks', header: 'Theory' },
            { field: 'practicalMarks', header: 'Practical' },
            { field: 'iaMarks', header: 'IA' },
            { field: 'totalMarks', header: 'Total' },
            { field: 'maxMarks', header: 'Max' },
            {
              header: 'Verify',
              cell: () => (
                <Button
                  icon="pi-check-circle"
                  className="p-button-sm p-button-text"
                  tooltip="Verify"
                  onClick={handleVerify}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
