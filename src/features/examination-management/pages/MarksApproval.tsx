import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useMarksEntriesQuery } from '../queries';
import { ToastService } from 'services';

export default function MarksApproval() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useMarksEntriesQuery(sid);

  const verified = (data ?? []).filter(m => m.status === 'Verified');

  const handleApprove = () => {
    ToastService.success('Marks entry approved.');
  };

  const handleReject = () => {
    ToastService.error('Marks entry rejected.');
  };

  return (
    <FormPage
      title="Marks Approval"
      description={`Approve or reject verified marks entries for session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={verified}
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
              header: 'Actions',
              cell: () => (
                <div className="flex gap-1">
                  <Button
                    icon="pi-check"
                    className="p-button-sm p-button-text p-button-success"
                    tooltip="Approve"
                    onClick={handleApprove}
                  />
                  <Button
                    icon="pi-times"
                    className="p-button-sm p-button-text p-button-danger"
                    tooltip="Reject"
                    onClick={handleReject}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
