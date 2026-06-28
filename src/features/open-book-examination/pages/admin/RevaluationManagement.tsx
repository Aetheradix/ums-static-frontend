import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
} from 'shared/new-components';
import { mockRevaluationRequests } from '../../data';

export default function RevaluationManagement() {
  const [data, setData] = useState(mockRevaluationRequests);
  const [actionPopup, setActionPopup] = useState<{
    open: boolean;
    id?: number;
    action?: 'approve' | 'reject';
  }>({ open: false });

  const pending = data.filter(r => r.status === 'pending');
  const underReview = data.filter(r => r.status === 'under_review');
  const completed = data.filter(r => r.status === 'completed');

  const handleAction = (
    id: number,
    status: 'under_review' | 'completed' | 'rejected'
  ) => {
    const idx = data.findIndex(r => r.id === id);
    if (idx !== -1) {
      data[idx] = {
        ...data[idx],
        status,
        reviewedByName: 'Admin',
        reviewedAt: new Date().toISOString(),
      };
      setData([...data]);
    }
    setActionPopup({ open: false });
  };

  return (
    <FormPage
      title="Revaluation Management"
      description="Manage revaluation requests from students"
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Pending"
          value={pending.length}
          icon="hourglass_empty"
          colorScheme="blue"
        />
        <StatCard
          title="Under Review"
          value={underReview.length}
          icon="search"
          colorScheme="orange"
        />
        <StatCard
          title="Completed"
          value={completed.length}
          icon="check_circle"
          colorScheme="green"
        />
      </div>
      <GridPanel
        title="All Requests"
        data={data}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        columns={
          [
            { field: 'studentName', header: 'Student' },
            { field: 'examTitle', header: 'Exam' },
            { field: 'currentMarks', header: 'Current' },
            {
              field: 'reason',
              header: 'Reason',
              cell: (row: { reason: string }) => (
                <span className="max-w-xs truncate text-gray-600 block">
                  {row.reason}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'completed' ? 'bg-green-100 text-green-800' : row.status === 'under_review' ? 'bg-blue-100 text-blue-800' : row.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {row.status.replace(/_/g, ' ')}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (row: { id: number; status: string }) => (
                <>
                  {row.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button
                        label="Review"
                        icon="search"
                        size="small"
                        onClick={() =>
                          setActionPopup({
                            open: true,
                            id: row.id,
                            action: 'approve',
                          })
                        }
                      />
                      <Button
                        label="Reject"
                        icon="close"
                        variant="text"
                        onClick={() => handleAction(row.id, 'rejected')}
                      />
                    </div>
                  )}
                  {row.status === 'under_review' && (
                    <Button
                      label="Mark Complete"
                      icon="check"
                      size="small"
                      onClick={() => handleAction(row.id, 'completed')}
                    />
                  )}
                </>
              ),
            },
          ] as any
        }
      />
      {actionPopup.open && (
        <FormPopup
          visible
          onHide={() => setActionPopup({ open: false })}
          title="Review Revaluation Request"
        >
          <p className="text-sm text-gray-600 mb-4">
            Accept this request for re-evaluation?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setActionPopup({ open: false })}
            />
            <Button
              label="Accept & Review"
              onClick={() =>
                actionPopup.id && handleAction(actionPopup.id, 'under_review')
              }
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
