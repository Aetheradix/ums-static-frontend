import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useGeneratedDuplicatesQuery } from '../../../queries';

export default function Generate() {
  const { data, isLoading } = useGeneratedDuplicatesQuery();

  return (
    <FormPage
      title="Generate Duplicate Marksheets"
      description="Generate duplicate marksheets for approved applications."
    >
      <FormCard>
        <div className="flex justify-end mb-4">
          <Button
            label="Generate Batch"
            icon="cog"
            onClick={() => ToastService.success('Batch generation started.')}
          />
        </div>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search..."
          columns={[
            { field: 'rollNo', header: 'Roll Number' },
            { field: 'name', header: 'Student Name' },
            { field: 'exam', header: 'Exam' },
            { field: 'generatedDate', header: 'Generated Date' },
            {
              header: 'Status',
              cell: (item: Examination.GeneratedDuplicateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Downloaded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: () => (
                <Button
                  icon="download"
                  variant="text"
                  tooltip="Download"
                  onClick={() => ToastService.success('PDF downloaded.')}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
