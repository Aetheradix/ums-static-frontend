import { useParams, useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useStudentApplicationsQuery,
  useExamSessionsQuery,
} from '../../../queries';

export default function StudentApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sessions } = useExamSessionsQuery();
  const sessionId = sessions?.[0]?.id ?? 1;
  const { data, isLoading } = useStudentApplicationsQuery(sessionId);
  const application = data?.find(app => app.id === Number(id));

  if (!isLoading && !application) {
    return (
      <FormPage
        title="Application Not Found"
        description="The requested student application does not exist."
      >
        <Button label="Back to List" onClick={() => navigate(-1)} />
      </FormPage>
    );
  }

  return (
    <FormPage
      title={`Application Detail: ${application?.studentName || ''}`}
      description="Review student exam registration details"
    >
      <FormCard title="Student Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{application?.rollNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrollment Number</p>
            <p className="font-medium">
              {application?.enrollmentNumber || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program</p>
            <p className="font-medium">{application?.programName || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{application?.status || '-'}</p>
          </div>
        </div>
      </FormCard>
      <FormCard title="Registered Courses">
        <GridPanel
          data={[]}
          loading={isLoading}
          columns={[
            { field: 'courseCode', header: 'Course Code' },
            { field: 'courseName', header: 'Course Name' },
            { field: 'credits', header: 'Credits' },
            { field: 'type', header: 'Type' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
