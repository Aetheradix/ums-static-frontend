import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';

export default function GradeCardGeneration() {
  return (
    <FormPage
      title="Grade Card Generation"
      description="Batch generate PDF grade cards for published results."
    >
      <FormCard>
        <GridPanel
          data={[
            {
              id: 1,
              sessionName: 'End Semester Exam Dec 2024',
              program: 'B.Tech',
              publishedDate: '2025-01-15',
              totalCards: 150,
              generated: 0,
              status: 'Pending',
            },
            {
              id: 2,
              sessionName: 'Mid Semester Exam Oct 2024',
              program: 'MBA',
              publishedDate: '2024-11-01',
              totalCards: 80,
              generated: 80,
              status: 'Completed',
            },
          ]}
          loading={false}
          columns={[
            { field: 'sessionName', header: 'Exam Session' },
            { field: 'program', header: 'Program' },
            { field: 'publishedDate', header: 'Published Date' },
            {
              header: 'Progress',
              cell: (item: any) => (
                <>
                  {item.generated} / {item.totalCards}
                </>
              ),
            },
            {
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
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
                    label={
                      item.status === 'Completed'
                        ? 'Download ZIP'
                        : 'Generate PDFs'
                    }
                    icon={
                      item.status === 'Completed' ? 'pi-download' : 'pi-cog'
                    }
                    className={`p-button-sm ${item.status === 'Completed' ? 'p-button-info' : 'p-button-primary'}`}
                    onClick={() => ToastService.success('Action started...')}
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
