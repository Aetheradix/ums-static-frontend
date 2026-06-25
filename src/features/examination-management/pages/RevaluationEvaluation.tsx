import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';

export default function RevaluationEvaluation() {
  return (
    <FormPage
      title="Revaluation Evaluation"
      description="Re-evaluate student answer sheets applied for rechecking."
    >
      <FormCard>
        <GridPanel
          data={[
            {
              id: 1,
              subject: 'Engineering Mathematics III',
              rollNo: 'B.Tech/2024/001',
              oldMarks: 42,
              newMarks: null,
              status: 'Pending Evaluation',
            },
            {
              id: 2,
              subject: 'Principles of Management',
              rollNo: 'MBA/2024/002',
              oldMarks: 55,
              newMarks: 58,
              status: 'Evaluated',
            },
          ]}
          loading={false}
          columns={[
            { field: 'rollNo', header: 'Roll Number' },
            { field: 'subject', header: 'Subject' },
            { field: 'oldMarks', header: 'Original Marks' },
            { field: 'newMarks', header: 'Revised Marks' },
            {
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Evaluated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: any) => (
                <div className="flex gap-1">
                  <Button
                    label="Evaluate"
                    icon="pi-pencil"
                    className="p-button-sm"
                    disabled={item.status === 'Evaluated'}
                    onClick={() =>
                      ToastService.success('Opening evaluation sheet...')
                    }
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
