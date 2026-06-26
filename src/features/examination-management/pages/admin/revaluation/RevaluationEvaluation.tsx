import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useRevaluationEvaluationsQuery } from '../../../queries';

export default function RevaluationEvaluation() {
  const { data, isLoading } = useRevaluationEvaluationsQuery();
  const [list, setList] = useState(data ?? []);

  const handleEvaluate = (id: number) => {
    const revised = Math.floor(Math.random() * 20) + 30;
    setList(prev =>
      prev.map(item =>
        item.id === id
          ? ({
              ...item,
              newMarks: revised,
              status: 'Evaluated',
            } as Examination.RevaluationEvaluationItem)
          : item
      )
    );
    ToastService.success(`Evaluation completed. Revised marks: ${revised}`);
  };

  return (
    <FormPage
      title="Revaluation Evaluation"
      description="Re-evaluate student answer sheets applied for rechecking."
    >
      <FormCard>
        <GridPanel
          data={list}
          loading={isLoading}
          columns={[
            { field: 'rollNo', header: 'Roll Number' },
            { field: 'subject', header: 'Subject' },
            { field: 'oldMarks', header: 'Original Marks' },
            { field: 'newMarks', header: 'Revised Marks' },
            {
              header: 'Status',
              cell: (item: Examination.RevaluationEvaluationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Evaluated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.RevaluationEvaluationItem) => (
                <Button
                  label="Evaluate"
                  icon="pencil"
                  className="p-button-sm"
                  disabled={item.status === 'Evaluated'}
                  onClick={() => handleEvaluate(item.id)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
