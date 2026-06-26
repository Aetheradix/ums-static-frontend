import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useStudentResultsQuery } from '../../queries';

export default function StudentResults() {
  const { data, isLoading } = useStudentResultsQuery();

  return (
    <FormPage
      title="My Results"
      description="View your semester examination results"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <InfoCard
          label="SGPA"
          value={data?.sgpa?.toString() ?? '-'}
          color="text-green-600"
          bg="bg-green-50"
        />
        <InfoCard
          label="CGPA"
          value={data?.cgpa?.toString() ?? '-'}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <InfoCard
          label="Semester"
          value={data?.semester ? `Sem ${data.semester}` : '-'}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      <FormCard title="Subject-wise Marks">
        <GridPanel
          data={data?.subjects ?? []}
          loading={isLoading}
          columns={[
            { field: 'subjectCode', header: 'Code' },
            { field: 'subjectName', header: 'Subject' },
            { field: 'obtainedMarks', header: 'Obtained' },
            { field: 'maxMarks', header: 'Max' },
            { field: 'grade', header: 'Grade' },
            { field: 'gradePoint', header: 'Grade Point' },
            {
              header: 'Result',
              cell: (item: Examination.StudentResultItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {item.result}
                </span>
              ),
            },
          ]}
        />
        <div className="flex justify-end mt-4">
          <Button
            label="Download Grade Card"
            icon="download"
            onClick={() => ToastService.success('Grade card PDF downloaded.')}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}

function InfoCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`p-4 rounded-lg ${bg} border`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
