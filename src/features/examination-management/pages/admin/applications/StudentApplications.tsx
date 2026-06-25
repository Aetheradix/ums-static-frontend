import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useStudentApplicationsQuery } from '../../../queries';
import { ToastService } from 'services';

const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-800',
  Verified: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const ACTIONS: Record<
  string,
  { label: string; icon: string; action: () => void; className: string }[]
> = {
  Submitted: [
    {
      label: 'Verify',
      icon: 'pi-check-circle',
      className: 'p-button-sm p-button-text p-button-success',
      action: () => ToastService.success('Application verified.'),
    },
    {
      label: 'Reject',
      icon: 'pi-times',
      className: 'p-button-sm p-button-text p-button-danger',
      action: () => ToastService.error('Application rejected.'),
    },
  ],
  Verified: [
    {
      label: 'Approve',
      icon: 'pi-check',
      className: 'p-button-sm p-button-text p-button-success',
      action: () => ToastService.success('Application approved.'),
    },
    {
      label: 'Reject',
      icon: 'pi-times',
      className: 'p-button-sm p-button-text p-button-danger',
      action: () => ToastService.error('Application rejected.'),
    },
  ],
  Draft: [
    {
      label: 'View',
      icon: 'pi-eye',
      className: 'p-button-sm p-button-text',
      action: () => ToastService.success('Opening application form...'),
    },
  ],
};

export default function StudentApplications() {
  const [sessionId] = useState(1);
  const { data, isLoading } = useStudentApplicationsQuery(sessionId);

  return (
    <FormPage
      title="Student Applications"
      description="View and manage student examination form applications"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search students..."
          sortField="studentName"
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'enrollmentNumber', header: 'Enrollment No.' },
            { field: 'programName', header: 'Program' },
            { field: 'termNo', header: 'Term' },
            {
              header: 'Status',
              cell: (item: Examination.StudentApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.StudentApplicationItem) => (
                <div className="flex gap-0.5">
                  {(ACTIONS[item.status] ?? []).map(act => (
                    <Button
                      key={act.label}
                      icon={act.icon}
                      className={act.className}
                      tooltip={act.label}
                      onClick={act.action}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
