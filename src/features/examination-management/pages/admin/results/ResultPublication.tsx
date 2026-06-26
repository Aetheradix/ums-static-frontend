import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useResultPublicationsQuery } from '../../../queries';

export default function ResultPublication() {
  const { data, isLoading } = useResultPublicationsQuery();
  const [list, setList] = useState(data ?? []);

  const handlePublish = (id: number) => {
    setList(prev =>
      prev.map(item =>
        item.id === id
          ? ({
              ...item,
              status: 'Published',
              processed: item.totalStudents,
            } as Examination.ResultPublicationItem)
          : item
      )
    );
    ToastService.success('Results published successfully.');
  };

  return (
    <FormPage
      title="Result Publication"
      description="Finalize and publish examination results to the student portal."
    >
      <FormCard>
        <GridPanel
          data={list}
          loading={isLoading}
          columns={[
            { field: 'sessionName', header: 'Exam Session' },
            { field: 'program', header: 'Program' },
            { field: 'semester', header: 'Semester' },
            { field: 'totalStudents', header: 'Total Students' },
            { field: 'processed', header: 'Results Processed' },
            {
              header: 'Status',
              cell: (item: Examination.ResultPublicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : item.status === 'Ready for Publication' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ResultPublicationItem) => (
                <div className="flex gap-1">
                  <Button
                    label="Publish"
                    icon="globe"
                    className="p-button-sm p-button-success"
                    disabled={item.status !== 'Ready for Publication'}
                    onClick={() => handlePublish(item.id)}
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
