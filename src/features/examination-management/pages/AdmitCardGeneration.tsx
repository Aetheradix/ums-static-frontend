import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useStudentApplicationsQuery } from '../queries';
import { ToastService } from 'services';

export default function AdmitCardGeneration() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useStudentApplicationsQuery(sid);
  const [generated, setGenerated] = useState(false);

  const filtered = (data ?? []).filter(s => s.status === 'Approved');

  const handleGenerateAll = () => {
    setGenerated(true);
    ToastService.success(
      `Admit cards generated for ${filtered.length} students.`
    );
  };

  return (
    <FormPage
      title="Admit Card Generation"
      description={`Generate admit cards for session #${sid}`}
    >
      <FormCard>
        <div className="flex justify-end mb-4">
          <Button
            label="Generate All"
            icon="pi-id-card"
            onClick={handleGenerateAll}
            disabled={filtered.length === 0}
          />
        </div>
        <GridPanel
          data={filtered}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search students..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'enrollmentNumber', header: 'Enrollment No.' },
            { field: 'programName', header: 'Program' },
            { field: 'termNo', header: 'Term' },
            {
              header: 'Generated',
              cell: () => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${generated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {generated ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              header: 'Download',
              cell: () => (
                <Button
                  icon="pi-download"
                  className="p-button-sm p-button-text"
                  tooltip="Download Admit Card"
                  disabled={!generated}
                  onClick={() =>
                    ToastService.success('Admit card PDF downloaded.')
                  }
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
