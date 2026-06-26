import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useRevaluationsQuery } from '../../../queries';
import { ToastService } from 'services';

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-gray-100 text-gray-700',
  'Fee Verified': 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  'Revised Published': 'bg-purple-100 text-purple-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function RevaluationManagement() {
  const { data, isLoading } = useRevaluationsQuery();
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});

  const cycleStatus = (id: number) => {
    const statuses = ['Applied', 'Fee Verified', 'Under Review', 'Completed'];
    const current = statusMap[id] ?? 'Applied';
    const idx = statuses.indexOf(current);
    const next = statuses[Math.min(idx + 1, statuses.length - 1)];
    setStatusMap(prev => ({ ...prev, [id]: next }));
    ToastService.success(`Status updated to "${next}".`);
  };

  return (
    <FormPage
      title="Revaluation Management"
      description="Manage revaluation, re-totaling, and photocopy requests"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search applications..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'subjectName', header: 'Subject' },
            {
              field: 'revalType',
              header: 'Type',
              cell: (item: Examination.RevaluationApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.revalType === 'Revaluation' ? 'bg-orange-100 text-orange-800' : item.revalType === 'Re-totaling' ? 'bg-cyan-100 text-cyan-800' : 'bg-pink-100 text-pink-800'}`}
                >
                  {item.revalType}
                </span>
              ),
            },
            { field: 'appliedDate', header: 'Applied Date' },
            {
              header: 'Status',
              cell: (item: Examination.RevaluationApplicationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[statusMap[item.id] ?? item.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {statusMap[item.id] ?? item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.RevaluationApplicationItem) => (
                <Button
                  icon="refresh"
                  variant="text"
                  tooltip="Advance Status"
                  onClick={() => cycleStatus(item.id)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
