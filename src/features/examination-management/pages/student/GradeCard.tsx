import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useStudentGradeCardsQuery } from '../../queries';

export default function StudentGradeCard() {
  const { data, isLoading } = useStudentGradeCardsQuery();

  return (
    <FormPage
      title="My Grade Cards"
      description="Download your semester grade cards"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search..."
          columns={[
            { field: 'sessionName', header: 'Session' },
            { field: 'sgpa', header: 'SGPA' },
            { field: 'cgpa', header: 'CGPA' },
            { field: 'publishedDate', header: 'Published Date' },
            {
              header: 'Status',
              cell: (item: Examination.StudentGradeCardItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.StudentGradeCardItem) =>
                item.status === 'Published' ? (
                  <Button
                    icon="download"
                    variant="text"
                    tooltip="Download"
                    onClick={() =>
                      ToastService.success(`Downloading grade card...`)
                    }
                  />
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
