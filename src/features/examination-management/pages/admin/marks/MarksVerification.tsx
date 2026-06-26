import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useMarksEntriesQuery } from '../../../queries';
import { ToastService } from 'services';

export default function MarksVerification() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useMarksEntriesQuery(sid);
  const [verifiedIds, setVerifiedIds] = useState<Set<number>>(new Set());

  const submitted = (data ?? []).filter(m => m.status === 'Submitted');

  const handleVerify = (id: number) => {
    setVerifiedIds(prev => new Set(prev).add(id));
    ToastService.success(`Marks entry #${id} verified.`);
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
              cell: (item: Examination.MarksEntryItem) => {
                const done = verifiedIds.has(item.id);
                return (
                  <Button
                    icon={done ? 'pi-check-circle' : 'pi-circle'}
                    className={`p-button-sm p-button-text ${done ? 'p-button-success' : ''}`}
                    tooltip={done ? 'Verified' : 'Click to Verify'}
                    disabled={done}
                    onClick={() => handleVerify(item.id)}
                  />
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
