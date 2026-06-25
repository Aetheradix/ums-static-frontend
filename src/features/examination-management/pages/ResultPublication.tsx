import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';

export default function ResultPublication() {
  return (
    <FormPage
      title="Result Publication"
      description="Finalize and publish examination results to the student portal."
    >
      <FormCard>
        <GridPanel
          data={[
            {
              id: 1,
              sessionName: 'End Semester Exam Dec 2024',
              program: 'B.Tech',
              semester: '1',
              totalStudents: 150,
              processed: 150,
              status: 'Ready for Publication',
            },
            {
              id: 2,
              sessionName: 'End Semester Exam Dec 2024',
              program: 'MBA',
              semester: '1',
              totalStudents: 80,
              processed: 75,
              status: 'Processing Pending',
            },
          ]}
          loading={false}
          columns={[
            { field: 'sessionName', header: 'Exam Session' },
            { field: 'program', header: 'Program' },
            { field: 'semester', header: 'Semester' },
            { field: 'totalStudents', header: 'Total Students' },
            { field: 'processed', header: 'Results Processed' },
            {
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Ready for Publication' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
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
                    label="Publish"
                    icon="pi-globe"
                    className="p-button-sm p-button-success"
                    disabled={item.status !== 'Ready for Publication'}
                    onClick={() =>
                      ToastService.success('Results published successfully.')
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
