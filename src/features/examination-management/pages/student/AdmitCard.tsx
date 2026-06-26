import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useStudentAdmitCardQuery } from '../../queries';

export default function StudentAdmitCard() {
  const { data, isLoading, isError, error } = useStudentAdmitCardQuery();

  if (isLoading) {
    return (
      <FormPage
        title="My Admit Card"
        description="Download your admit card / hall ticket"
      >
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading admit card data...
        </div>
      </FormPage>
    );
  }

  if (isError || !data) {
    return (
      <FormPage
        title="My Admit Card"
        description="Download your admit card / hall ticket"
      >
        <div className="flex justify-center items-center h-64 text-red-500">
          {(error as Error)?.message || 'Admit card not generated yet.'}
        </div>
      </FormPage>
    );
  }

  const { studentData, examSubjects } = data;

  return (
    <FormPage
      title="My Admit Card"
      description="Download your admit card / hall ticket"
    >
      <FormCard title="Admit Card - End Semester Exam Dec 2024">
        <div className="border-2 border-gray-300 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="text-center border-b pb-4 mb-4">
            <h2 className="text-lg font-bold">UNIVERSITY OF TECHNOLOGY</h2>
            <p className="text-sm text-gray-600">
              End Semester Examination December 2024
            </p>
            <p className="text-sm font-semibold mt-1">ADMIT CARD</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Student Name:</span>{' '}
              <span className="font-medium">{studentData.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Roll Number:</span>{' '}
              <span className="font-medium">{studentData.rollNo}</span>
            </div>
            <div>
              <span className="text-gray-500">Enrollment No.:</span>{' '}
              <span className="font-medium">{studentData.enrollment}</span>
            </div>
            <div>
              <span className="text-gray-500">Program:</span>{' '}
              <span className="font-medium">{studentData.program}</span>
            </div>
            <div>
              <span className="text-gray-500">Semester:</span>{' '}
              <span className="font-medium">{studentData.semester}</span>
            </div>
            <div>
              <span className="text-gray-500">Session:</span>{' '}
              <span className="font-medium">{studentData.session}</span>
            </div>
          </div>

          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Subject Code</th>
                <th className="border p-2 text-left">Subject Name</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Time</th>
                <th className="border p-2 text-left">Hall</th>
              </tr>
            </thead>
            <tbody>
              {examSubjects.map((s, i) => (
                <tr key={i}>
                  <td className="border p-2">{s.code}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.date}</td>
                  <td className="border p-2">{s.time}</td>
                  <td className="border p-2">{s.hall}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              * This admit card must be produced at the examination hall along
              with a valid ID proof.
            </p>
            <p>* Report at least 30 minutes before the scheduled start time.</p>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              label="Download PDF"
              icon="download"
              onClick={() => ToastService.success('Admit card PDF downloaded.')}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
