import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useGradeCardGenerationsQuery } from '../../../queries';

export default function GradeCardGeneration() {
  const { data, isLoading } = useGradeCardGenerationsQuery();
  const [list, setList] = useState(data ?? []);

  const handleGenerate = (id: number) => {
    setList(prev =>
      prev.map(item =>
        item.id === id
          ? ({
              ...item,
              generated: item.totalCards,
              status: 'Completed',
            } as Examination.GradeCardGenerationItem)
          : item
      )
    );
    ToastService.success('Grade cards generated successfully.');
  };

  return (
    <FormPage
      title="Grade Card Generation"
      description="Batch generate PDF grade cards for published results."
    >
      <FormCard>
        <GridPanel
          data={list}
          loading={isLoading}
          columns={[
            { field: 'sessionName', header: 'Exam Session' },
            { field: 'program', header: 'Program' },
            { field: 'publishedDate', header: 'Published Date' },
            {
              header: 'Progress',
              cell: (item: Examination.GradeCardGenerationItem) => (
                <>
                  {item.generated} / {item.totalCards}
                </>
              ),
            },
            {
              header: 'Status',
              cell: (item: Examination.GradeCardGenerationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.GradeCardGenerationItem) => (
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
                    onClick={() =>
                      item.status === 'Completed'
                        ? ToastService.success('Downloading ZIP...')
                        : handleGenerate(item.id)
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
