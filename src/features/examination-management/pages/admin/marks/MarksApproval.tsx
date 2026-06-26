import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useMarksEntriesQuery } from '../../../queries';
import { ToastService } from 'services';

export default function MarksApproval() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useMarksEntriesQuery(sid);
  const [processedIds, setProcessedIds] = useState<Set<number>>(new Set());

  const verified = (data ?? []).filter(m => m.status === 'Verified');

  const handleApprove = (id: number) => {
    setProcessedIds(prev => new Set(prev).add(id));
    ToastService.success(`Marks entry #${id} approved.`);
  };

  const handleReject = (id: number) => {
    setProcessedIds(prev => new Set(prev).add(id));
    ToastService.error(`Marks entry #${id} rejected.`);
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
              cell: (item: Examination.MarksEntryItem) => {
                const done = processedIds.has(item.id);
                return (
                  <div className="flex gap-1">
                    <Button
                      icon="check"
                      variant="success"
                      tooltip="Approve"
                      disabled={done}
                      onClick={() => handleApprove(item.id)}
                    />
                    <Button
                      icon="times"
                      variant="danger"
                      tooltip="Reject"
                      disabled={done}
                      onClick={() => handleReject(item.id)}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
